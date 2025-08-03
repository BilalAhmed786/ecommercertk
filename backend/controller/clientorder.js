const Billingaddress = require('../schema/billingaddress')
 const clientorderdetail = require('../schema/clientorderdetail')

const getBillingaddress = async (req, res) => {


    const billinguser = await Billingaddress.find({ email: req.params.email })

    if (billinguser) {

        res.json(billinguser)
    } else {

        console.log('somthing went wrong')
    }


}

const updateBillingaddress = async (req, res) => {


    try {
        const { _id, name, email, mobile, city, address } = req.body



        if (!name || !email || !mobile || !city || !address) {

            return res.json('All fields required')

        }


        const updateaddress = await Billingaddress.updateOne({ _id }, { $set: { name, email, mobile, city, address } })

        if (updateaddress) {


            res.json('update address successfully')
        }
    } catch (error) {

        console.log(error)
    }


}


const getclientorders =async(req,res)=>{

    const {searchTerm,email} = req.query;

    
    try {
        const query = {
            $or: [
                { name: { $regex: new RegExp(searchTerm, 'i') } },
                { email: { $regex: new RegExp(searchTerm, 'i') } },
                { status: { $regex: new RegExp(searchTerm, 'i') } },
                { timestamp: { $regex: new RegExp(searchTerm, 'i') } },


            ]
        };

        const totalCount = await clientorderdetail.countDocuments(query);

        const orders = await clientorderdetail.find(query).where({email});

        res.json({
            orders,
            totalCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

const removeclientorders=async(req,res)=>{
    try {
        const id = req.params.id

        const deleteorder = await clientorderdetail.findByIdAndDelete(id)

        if (deleteorder) {

            console.log('delete order')

            res.json('delete order successfuly')

        }


    } catch (error) {

        console.log(error)
    }
}

const removemultipleclientorder = (req,res)=>{
   
    if(req.body.length == 0){


        return res.json('no item selected')


 }

    clientorderdetail.deleteMany({ _id: { $in:req.body} })

    .then(result => {

            console.log(result)
      
         return res.json('orders deleted successfully')
      
     
    })
    .catch(error => {
      console.error('Error deleting documents:', error);
    });

}
const getsingleclientorder =async(req,res)=>{

    try {

        const id = req.params.id

        const singleorder = await clientorderdetail.find({ _id: id })

        res.json(singleorder)

    } catch (error) {

        console.log(error)
    }

}
    


module.exports = { getBillingaddress, updateBillingaddress,getclientorders,
        removeclientorders,getsingleclientorder,removemultipleclientorder }