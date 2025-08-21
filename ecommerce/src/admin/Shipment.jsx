import React, { useEffect, useState } from 'react'
import Sidebarmenu from './component/Sidebarmenu'
import { useUpdateShipmentMutation,useGetShipmentQuery } from '../app/apiproducts'
import { toast } from 'react-toastify'

function Shipment() {

const  [postshipment] = useUpdateShipmentMutation()
const {data,isLoading,isError,refetch}  = useGetShipmentQuery()
const [formvalid, stateFormvalid] = useState('') //validation
const[shipmentcharges,stateshipment]=useState({

    shipment:''

})

useEffect(() => {


    stateshipment(data?data[0]:'')


  }, [data])



const inputchangehandler=(e)=>{

    const {name,value}=e.target

stateshipment({
...shipmentcharges,[name]:value

})

}


const submithandler = async(e)=>{
  e.preventDefault()
  
  refetch()

  try{
const result =  await postshipment(shipmentcharges)

if(result){

    if(result.data === 'save successfully'){

      toast.success(result.data)
    }else{

      toast.error(result.data)
    }
}
}
catch(error){

    console.log(error)
}


}

if(isLoading){

    return(

        <div>...loading</div>
    )
}
if(isError){

    return(

        <div>something went wrong</div>
    )
}

  return (
    <div className='dashboardcontainer'>



            <Sidebarmenu />


    <div className="marquee-container">

    <form onSubmit={submithandler}>
          <h2 className="page-title"> Shipment Charges</h2>
          <div className='form-group'>


            <input type="text" style={{ textAlign: 'center' }}
              name="shipment" value={shipmentcharges?shipmentcharges.shipment:''} onChange={inputchangehandler} />

          </div>

          
          {formvalid ?
            <div style={{width:'20%',margin:'auto'}} className='alert alert-danger'>
              {formvalid}
            </div>
            : null}

          <div className='form-group'>
            <input type="submit" className='btn btn-danger' value="save"/>
          </div>

        </form>

        </div>


    </div>     
  )
}

export default Shipment