import React, { useEffect, useState } from 'react'
import Sidebarmenu from './component/Sidebarmenu'
import { useClientchangePasswordMutation,useUserDetailsMutation } from '../app/apiauth'
function Profile(props) {
    
    const [validation, statevalidation] = useState('')
    const [changepassword] = useClientchangePasswordMutation()
    const[data]  = useUserDetailsMutation()

    //validation remove by client side

  const LoginvalidatedItems = (event, value) => {

    event.preventDefault();

    const validatedItems = validation.filter(item => item !== value);


    statevalidation(validatedItems);
  }



    const [userprofile, stateUserprofile] = useState({

        userid: '',
        username: '',
        useremail: '',
        currentpass: '',
        newpass: '',
        confirmpass: '',

    })


    const changehandle = async (e) => {

        const { name, value } = e.target

        stateUserprofile({
            ...userprofile, [name]: value

        })


    }
    useEffect(() => {


        stateUserprofile(props)

    }, [props])








    const submithandle = async (e) => {

        e.preventDefault()


        try {

            const result = await changepassword(userprofile)

            if (result) {

            const profile  =  await data()
              statevalidation(result.data)
            
            } else {

                console.log('something went wrong')
            }

        } catch (error) {

            console.log(error)
        }

    }
    return (
        <div className='dashboardcontainer'>


            <Sidebarmenu />


            <div className="marquee-container">
                <form onSubmit={submithandle}>
                    <div className='form-group'>
                        <label>name</label><br />
                        <input type="text" name="username" value={userprofile.username} onChange={changehandle} />
                    </div>
                    <div className='form-group'>
                        <label>email</label><br />
                        <input type="text" name="useremail" value={userprofile.useremail} onChange={changehandle} />
                    </div>
                    <div className='form-group'>
                        <label>current password</label><br />
                        <input name="currentpass" type="password" onChange={changehandle} />
                    </div>
                    <div className='form-group'>
                        <label>New password</label><br />
                        <input name="newpass" type="password" onChange={changehandle} />
                    </div>
                    <div className='form-group'>
                        <label>Confirm password</label><br />
                        <input name="confirmpass" type="password" onChange={changehandle} />
                        <input type="hidden" name="userid" value={userprofile.userid} />
                    </div>
                    {validation ? validation.map((valid, index) => (

                        <div style={{ display: 'block', margin: 'auto', width: '25%',marginBottom:5 }} className='alert alert-danger'>

                        <li key={index} style={{ listStyleType: "none", color: "red", textAlign: "center", margin: 10 }} >
                            {valid}
                            <button
                              style={{ marginLeft: 55, background: "none", border: "none", float: "right" }}

                              onClick={(e) => LoginvalidatedItems(e, valid)}>X</button>
                          </li>
                        </div>

                    )) : null}

                    <input style={{ display: 'block', margin: 'auto' }}
                        className='btn btn-danger' type="submit" value="Save" />
                </form>
            </div>
        </div>
    )
}

export default Profile