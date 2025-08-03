const fs = require('fs').promises;
const ejs = require('ejs');
const path = require('path');
const Products = require('../schema/products')
const clientorderdet = require('../schema/clientorderdetail')
const adminorderdet = require('../schema/adminorderdetails')
const Billingaddress = require('../schema/billingaddress')
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPEKEY);

const paymentmode = async (req, res) => {

    var { productid, token, productname, productsprice, productquantity,
        inventory, carttotal, shipmentcharges, totalamount,
        paymentMethod: { stripepayment, name, email, mobile, city, address }

    } = req.body



    const updatedprodinvent = inventory.map((item, index) => {//update inventory after order

        return item - productquantity[index]
    })


    if (!name || !email || !mobile || !city || !address || !stripepayment) {

        return res.json('All fields required')
    }

    if (token) {
        const charge = await stripe.charges.create({
            source: token,
            amount: totalamount * 100,
            currency: 'usd',

        });

        // Handle successful payment
        console.log('Payment Successful:', charge);


    }



    // Generate a random number between 1000 and 9999
    const orderno = `#${Math.floor(Math.random() * 9000) + 1000}`;



    const corederdet = new clientorderdet({

        orderno, name, email, mobile, city, address,
        productname, productsprice, productquantity, carttotal,
        shipmentcharges, totalamount, stripepayment
    })

    const cordercreate = await corederdet.save()

    if (cordercreate) {

        console.log('record stored in client')

    }


    const aorederdet = new adminorderdet({
        orderno, name, email, mobile, city, address,
        productname, productsprice, productquantity, carttotal,
        shipmentcharges, totalamount, stripepayment
    })

    const aordercreate = await aorederdet.save()

    if (aordercreate) {

        console.log('record stored in admin')

        res.json({ msg: 'Order Placed' })

    }

    // biller address save if already exist update
    const billuser = await Billingaddress.find({ email: email })



    if (billuser.length === 0) {

        const bill = new Billingaddress({

            name, email, mobile, city, address

        })


        const billsave = await bill.save()

        if (billsave) {

            console.log('billaddresss save')

        }
    } else {

        const updatebilladdress = await Billingaddress.updateOne({ _id: billuser[0]._id },
            { $set: { name, email, mobile, city, address } }

        )


        if (updatebilladdress) {


            console.log('billingaddress updated')
        }

    }


    productid.forEach(async (id, index) => {

        const updateqty = await Products.updateOne({ _id: id }, { $set: { inventory: updatedprodinvent[index] } });

        if (updateqty) {
            console.log('updated inventory')

        }

    })


    const pathtemplate = path.join(__dirname, '../public/index.html')

    const emailTemplate = await fs.readFile(pathtemplate, 'utf8',);

    const compiledTemplate = ejs.compile(emailTemplate);

    //mail to client and owner
    const htmlcontent = compiledTemplate({
        name, email, mobile, city, address,
        productname, productsprice, productquantity, shipmentcharges,
        carttotal, totalamount, stripepayment

    })
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.FROM,
            pass: process.env.PASSWORD
        }
    });

    const mailclient = {
        from: process.env.FROM,
        to: email,
        subject: 'ThriftersPoint',
        html: htmlcontent
    };
    const mailadmin = {
        from: process.env.FROM,
        to: process.env.FROM,
        subject: 'ThriftersPoint',
        html: htmlcontent
    };
    transporter.sendMail(mailclient, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    transporter.sendMail(mailadmin, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

const getorders = async (req, res) => {

    const {searchTerm } = req.query;

    try {
        const query = {
            $or: [
                { name: { $regex: new RegExp(searchTerm, 'i') } },
                { email: { $regex: new RegExp(searchTerm, 'i') } },
                { status: { $regex: new RegExp(searchTerm, 'i') } },
                { timestamp: { $regex: new RegExp(searchTerm, 'i') } },


            ]
        };

        const totalCount = await adminorderdet.countDocuments(query);

        const orders = await adminorderdet.find(query);

        res.json({
            orders,
            totalCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


}



const getsingleorder = async (req, res) => {
console.log(req.params)
    try {

        const {id} = req.params

       
        
        
        const singleorder = await adminorderdet.find({ _id: id })

    
        return res.json(singleorder)

    } catch (error) {

        console.log(error)
    }


}

const removesingleorder = async (req, res) => {

    try {
        const id = req.params.id

        const deleteorder = await adminorderdet.findByIdAndDelete(id)

        if (deleteorder) {

            console.log('delete order')

           return res.json('delete order successfuly')

        }


    } catch (error) {

        console.log(error)
    }
}


const removemultipleorders = (req,res)=>{


    if(req.body.length == 0){


        return res.json('no item selected')


 }

    adminorderdet.deleteMany({ _id: { $in:req.body} })

    .then(result => {

            console.log(result)
      
         return res.json('orders deleted successfully')
      
     
    })
    .catch(error => {
      console.error('Error deleting documents:', error);
    });


}

const orderstatus = async (req, res) => {


    const { productsid, productsname, productsquantity, status } = req.body

console.log(status.status)


    if (!status.status) {

        return res.json('field required')
    }



    const products = await Products.find({ productname: { $in: productsname } })

    const orderstatus = await adminorderdet.find({ _id: productsid })



    const actstatus = orderstatus[0].status

    const orderno = orderstatus[0].orderno


    const productsids = products.map(prodids => prodids._id)


    const addupdateinventory = products.map((invent, index) => {

        return parseInt(invent.inventory) + parseInt(productsquantity[index])

    })

    const subtupdateinventory = products.map((invent, index) => {

        return parseInt(invent.inventory) - parseInt(productsquantity[index])

    })

  

    if ((status.status === actstatus) || (status.status === "fulfilled" && actstatus === "pending") ||
        (status.status === "pending" && actstatus === "fulfilled")) {



        const adminordstatus = await adminorderdet.updateOne({ _id: productsid }, { $set: { status: status.status } })
        const clientordstatus = await clientorderdet.updateOne({ orderno: orderno }, { $set: { status: status.status } })

        if (adminordstatus && clientordstatus) {


            console.log('update successfully')
            res.json('update successfully')
        } else {

            console.log('somthing went wrong')
        }


    }

    //add inventory case

    if ((status.status === "return" && actstatus === "fulfilled") || (status.status === "return" && actstatus === "pending")) {

        const adminordstatus = await adminorderdet.updateOne({ _id: productsid }, { $set: { status: status.status } })
        const clientordstatus = await clientorderdet.updateOne({ orderno: orderno }, { $set: { status: status.status } })

        if (adminordstatus && clientordstatus) {


            console.log('update successfully')

        } else {

            console.log('somthing went wrong')
        }


        productsids.map(async (ids, index) => {




            const updateinvent = await Products.updateOne({ _id: ids }, { $set: { inventory: addupdateinventory[index] } })

            if (updateinvent) {


                console.log('inventory updated')

                res.json('update successfully')
            } else {

                console.log('inventory not updated')
            }


        })

    }

    //subtract inventory case

    if ((status.status === "pending" && actstatus === "return") || (status.status === "fulfiled" && actstatus === "return")) {

        const adminordstatus = await adminorderdet.updateOne({ _id: productsid }, { $set: { status: status.status } })
        const clientordstatus = await clientorderdet.updateOne({ orderno: orderno }, { $set: { status: status.status } })

        if (adminordstatus && clientordstatus) {


            console.log('update successfully')
        } else {

            console.log('somthing went wrong')
        }


        productsids.map(async (ids, index) => {


            const updateinvent = await Products.updateOne({ _id: ids }, { $set: { inventory: subtupdateinventory[index] } })

            if (updateinvent) {


                console.log('inventory updated')
                res.json('update successfully')

            } else {

                console.log('inventory not updated')
            }


        })


    }

}
module.exports = {
    paymentmode, getorders,
    getsingleorder, removesingleorder,
    removemultipleorders,
    orderstatus

}