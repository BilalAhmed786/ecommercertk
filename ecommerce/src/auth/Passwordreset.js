import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useResetpasswordMutation } from '../app/apiauth'
import { toast } from 'react-toastify';
function Passwordreset() {

    const token = useParams()

    const [passwordreset] = useResetpasswordMutation()

    const [resetvalidation, setresetValid] = useState('')

    const [restpass, setresetpass] = useState({

        newpassword: '',
        confirmpassword: '',

    })

    const resetUser = (e) => {

        const { name, value } = e.target

        setresetpass({
            ...restpass,

            [name]: value


        })



    }


    const resetCread = async (e) => {
        e.preventDefault()

        try {

            const result = await passwordreset({restpass,token})

            if (result.data==='Password has been successfully updated.') {

               toast.success(result.data)
               
                // setresetValid(result.data)
            } else{

                toast.error(result.data)

            }

        } catch (error) {
            console.log(error)
        }


    }
    return (
        <section className="vh-100 bg-image">
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card">
                                <div className="card-body p-5">
                                    <h2 className="text-uppercase text-center mb-5">Reset password</h2>

                                    <div style={{ color: "red" }}>


                                    </div>


                                    <form method="POST" onSubmit={resetCread}>



                                        <div className="form-outline mb-4">
                                            <input type="password" name='newpassword' className="form-control form-control-lg" onChange={resetUser} />
                                            <label className="form-label" htmlFor="youremail">New Password</label>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input type="password" name='confirmpassword' className="form-control form-control-lg" onChange={resetUser} />
                                            <label className="form-label" htmlFor="youremail">Confirm Password</label>
                                        </div>

                                        {resetvalidation ?
                                            <div className='alert alert-danger'
                                                style={{ textAlign: 'center' }}>

                                                {resetvalidation}

                                            </div>
                                            : null

                                        }
                                        <div className="d-flex justify-content-center">
                                            <button type="submit"
                                                className="btn btn-danger">Submit</button>

                                        </div>


                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Passwordreset