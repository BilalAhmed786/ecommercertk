const User = require('../schema/users')
const Leads = require('../schema/leads')

const alluser = async (req, res) => {

    const { searchTerm } = req.query;

    try {
        const query = {
            $or: [
                { name: { $regex: new RegExp(searchTerm, 'i') } },
                { email: { $regex: new RegExp(searchTerm, 'i') } },
                { role: { $regex: new RegExp(searchTerm, 'i') } },

            ]
        };

        const totalUsers = await User.countDocuments(query);

        const Users = await User.find(query, { password: 0, retypepassword: 0 });

        res.json({
            Users,
            totalUsers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const singleuser = async (req, res) => {

    try {
        const singleuser = await User.find({ _id: req.params.id }, { name: 1, email: 1, role: 1 })

        res.json(singleuser)

    }

    catch (error) {

        console.log(error)
    }
}

const updatesingleuser = async (req, res) => {

    try {


        const { _id, name, email, role } = req.body




        if (!_id || !name || !email || !role) {

            return res.json('All fields required')
        }



        const updateuser = await User.updateOne({ _id: _id }, { $set: { name: name, email: email, role: role } })

        if (updateuser) {

            res.json('user updated!!')

        }
    }

    catch (error) {
        console.log(error)
    }


}

const deleteuser = async (req, res) => {

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const deletemultipleUser = async (req, res) => {

    try {

        if (req.body.length === 0) {

            return res.json('no item selected')

        }
        const multiuserdel = await User.deleteMany({ _id: { $in: req.body } })

        if (multiuserdel) {

            res.json('selected user deleted!!')
        } else {

            console.log('user not deleted')
        }

    } catch (error) {

        console.log(error)
    }

}



const searchuser = async (req, res) => {


    const { query } = req.query;

    try {
        const users = await User.find({
            $or: [
                { name: { $regex: new RegExp(query, 'i') } },
                { email: { $regex: new RegExp(query, 'i') } },
                { role: { $regex: new RegExp(query, 'i') } },

            ],
        });

        if (users.length > 0) {
            res.json(users);
        } else {

            res.json('user not found');
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const newsletter = async (req, res) => {

    const {email} = req.body

    try {

        if (!email) {

            res.json('field required')
        }

        const finduser = await Leads.find({email})

        if(finduser){
 
            const updateuser = await Leads.updateOne({_id:finduser[0]._id},{$set:{email}})
            
            if(updateuser){

                console.log('user update')
            }else{

                console.log('not update')
            }

        }

        const newsletter = new Leads({ email })

        const savelead = await newsletter.save()

        if (savelead) {

            res.json('thanks for Subscription')
        } else {


            console.log('somehting wro')
        }

    } catch (error) {
        if(error){

            console.log('invalid email address')
        }
    }


}


module.exports = {
    alluser,
    singleuser,
    updatesingleuser,
    deleteuser,
    deletemultipleUser,
    searchuser,
    newsletter
}