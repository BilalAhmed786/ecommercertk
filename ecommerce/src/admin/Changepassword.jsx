import React, { useState } from 'react'
import Sidebarmenu from './component/Sidebarmenu'
import { useAdminchangePasswordMutation } from '../app/apiauth'

function Changepassword(props) {

    const [changePassword] = useAdminchangePasswordMutation()

    const [validation, stateValidation] = useState()


    const targetval = (e) => {

        const { name, value } = e.target


        changepassState({
            ...Passwordchange, [name]: value

        })

    }


    const [Passwordchange, changepassState] = useState({

        currentpass: '',
        changepass: '',
        confirmpass: ''

    })


    const handlesubmit = async (e) => {

        e.preventDefault()

        const result = await changePassword({
            formdata: Passwordchange,
            useremail: props.user.useremail
        })

        if (result) {


            stateValidation(result.data)


        } else {

            console.log("somthing wrong")
        }


    }


    return (
        <div className='dashboardcontainer'>

            <Sidebarmenu />

            <div className="marquee-container">
              <h5 className="page-title">Change password</h5>
                <form style={{marginTop:20}} onSubmit={handlesubmit}>
                    <div className='form-group'>
                        <label>Current Password</label>< br />
                        <input name="currentpass" type='password' onChange={targetval} />
                    </div>
                    <div className='form-group'>
                        <label>Change Password</label>< br />
                        <input name="changepass" type='password' onChange={targetval} />
                    </div>
                    <div className='form-group'>
                        <label>Confirm Password</label>< br />
                        <input name="confirmpass" type='password' onChange={targetval} />
                    </div>

                    {validation ?
                        <div style={{display:'block',width:'15%',
                        margin:'auto',textAlign:'center',marginBottom:5}} className='alert alert-danger'>
                                {validation}

                        </div>
                        : null
                    }
                    <input style={{ display: 'block', margin: 'auto' }} className='btn btn-danger' type="submit" value="Save" />

                </form>
            </div>
        </div>
    )
}

export default Changepassword