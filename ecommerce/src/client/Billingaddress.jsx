import React, { useEffect, useState } from 'react'
import Sidebarmenu from './component/Sidebarmenu'
import { useGetBillingaddressQuery, useUpdateBillingaddressMutation } from '../app/apiorders'


function Billingaddress(props) {

    const { data, isLoading } = useGetBillingaddressQuery(props.useremail)
    const [updateBillingaddress] = useUpdateBillingaddressMutation()

    const[validation,stateValidation]=useState()

    const [setvalue, userData] = useState({

        name: '',
        email: '',
        mobile: '',
        city: '',
        address: ''



    })



    useEffect(() => {



        userData(data ? data[0] : '')


    }, [data])



    const handleBilling = (e) => {

        const { name, value } = e.target

        userData({
            ...setvalue,
            [name]: value
        })

    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            const result = await updateBillingaddress(setvalue)


            if (result) {

                stateValidation(result.data)
            }


        } catch (error) {

            console.log(error)
        }


    }

    if (isLoading) {

        return <div>...isLoading</div>
    }


    return (
        <div className='dashboardcontainer'>


            <Sidebarmenu />


            <div className="marquee-container">
                <h3 style={{
                    textAlign: 'center',padding:25
                }}>Billing Address</h3>
                <form onSubmit={handleSubmit}>

                    <div className='form-group'>
                        <lable forHtml="name">Name</lable><br />
                        <input type='text' name="name" value={setvalue?setvalue.name:''} onChange={handleBilling} />
                    </div>
                    <div className='form-group'>
                        <lable forHtml="name">Email</lable><br />
                        <input type='text' name="email" value={setvalue?setvalue.email:''} onChange={handleBilling} />
                    </div>
                    <div className='form-group'>
                        <lable forHtml="name">Contact no</lable><br />
                        <input type='text' name="mobile" value={setvalue?setvalue.mobile:''} onChange={handleBilling} />
                    </div>
                    <div className='form-group'>
                        <lable forHtml="name">City</lable><br />
                        <input type='text' name="city" value={setvalue?setvalue.city:''} onChange={handleBilling} />

                    </div>
                    <div className='form-group'>
                        <lable forHtml="name">Address</lable><br />
                        <textarea
                            cols='50' rows='5' name="address" value={setvalue?setvalue.address:''} onChange={handleBilling}></textarea>
                    </div>

                {validation?
                    <div style={{display:'block',width:'20%',marginBottom:5,
                    margin:'auto',textAlign:'center'}} className='alert alert-danger'>

                        {validation}
                    </div>

                    :null}

                    <button style={{display:'block',margin:'auto'}} className='btn btn-danger' type='submit'>Update</button>
                </form>

            </div>
        </div>
    )
}

export default Billingaddress