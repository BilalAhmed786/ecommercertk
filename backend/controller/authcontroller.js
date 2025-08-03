const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../schema/users')
const register = async (req, res) => {


    const { name, email, password, retypepassword } = req.body


    try {

        const errors = [];



        if (!name || !email || !password || !retypepassword) {

            const err = 'All fields required';

            errors.push(err);


        }

        if (password != retypepassword) {

            const err = 'Mismatch Passwords';

            errors.push(err);



        }
        if (password.length < 6) {

            const err = 'password with atleat 7 charaters';

            errors.push(err);



        }

        const finduser = await User.findOne({ email: email });

        if (finduser) {

            const err = 'this email alrady taken'

            errors.push(err);

        }



        if (errors.length > 0) {

            return res.json(errors)

        }



        const hash = await bcrypt.hash(password, 10);


        if (!hash) {

            console.log('something went wrong');
        }



        const usercreate = new User({ name, email, password: hash, retypepassword: hash })


        const result = await usercreate.save();

        if (result) {

            errors.push('registerd successfully')

            return res.json(errors)

        } else {

            console.log('somthing went wrong');
        }
    }

    catch (err) {

        throw err

    }



}

//login users

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        jwt.sign(
            {
                userId: user._id,
                username: user.name,
                useremail: user.email,
                userrole: user.role,
            },
            process.env.SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    return res.status(500).json({ error: 'Token generation failed' });
                }

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 7 * 24 * 60 * 60 * 1000

                });

                return res.json({ role: user.role });
            }
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};


// logout user
const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,       
        sameSite: 'None',     
        expires: new Date(0), 
    });

    return res.json({ message: 'Logout successful' });
};


const Forgetpass = async (req, res) => {


    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {

        return res.json('you are not registerd');

    }
    const token = jwt.sign({ _id: user._id }, process.env.FORGOT_SECRET, { expiresIn: '5m' });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.FROM,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.FROM,
        to: email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click <a href="http://localhost:3000/reset-password/${token}">here</a> to reset your password.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            return res.json('Password reset email sent');
        }
    });
}


const resetpassword = async (req, res) => {

    try {
        const { restpass: { newpassword, confirmpassword }, token: { token } } = req.body


        if (!newpassword || !confirmpassword) {


            return res.json("All fields required")

        }

        if (newpassword !== confirmpassword) {


            return res.json("passwords Mismatch")

        }

        const hashed = await bcrypt.hash(newpassword, 10)


        const decoded = await new Promise((resolve, reject) => {

            jwt.verify(token, process.env.FORGOT_SECRET, (err, decoded) => {

                if (err) reject(err);

                resolve(decoded);

            });
        });

        const resetpassword = await User.updateOne({ _id: decoded._id }, { password: hashed, retypepassword: hashed })

        if (resetpassword) {

            res.json('Password has been successfully updated.');

        } else {


            console.log('not change password')
        }



    } catch (error) {

        console.log(error)
    }

}


//function for auth user
const auth = async (req, res) => {

    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user info' });
    }

    res.json(req.user);
};


const changepass = async (req, res) => {



    const { formdata: { currentpass, changepass, confirmpass }, useremail } = req.body


    if (!currentpass || !changepass || !confirmpass) {

        return res.json('All fields required')

    }

    if (changepass !== confirmpass) {

        return res.json('Passwords Mismatch')

    }




    const user = await User.find({ email: useremail })



    if (user) {

        const passmatch = await bcrypt.compare(currentpass, user[0].password)

        if (!passmatch) {


            return res.json('invalid password')

        }

        const updatepass = await bcrypt.hash(changepass, 10)



        if (updatepass) {



            const passchange = await User.updateOne({ _id: user[0]._id }, { $set: { password: updatepass, retypepassword: updatepass } })


            if (passchange) {

                console.log("password change successfully")

                res.json("password change successfully")
            }

        }




    }



}

const clientchangepass = async (req, res) => {



    const { userid, username, useremail, currentpass, newpass, confirmpass } = req.body

    const valid = []

    if (!username || !useremail || !currentpass || !newpass || !confirmpass) {


        valid.push("All fields required")



    }

    if (newpass !== confirmpass) {


        valid.push("Mismatch paswords")


    }


    const user = await User.find({ _id: userid })


    if (currentpass) {

        const compare = await bcrypt.compare(currentpass, user[0].password)


        if (!compare) {


            valid.push('invalid password')

        }

    }


    if (valid.length > 0) {


        return res.json(valid)
    }


    const passwordupdate = await bcrypt.hash(newpass, 10)




    const updateclient = await User.updateOne({ _id: userid },

        { $set: { name: username, email: useremail, password: passwordupdate, retypepassword: passwordupdate } })


    if (updateclient) {

        valid.push('update record successfully')


        return res.json(valid)

    }




}





module.exports = {
    register, login, logout, auth, changepass,
    clientchangepass, Forgetpass, resetpassword
}
