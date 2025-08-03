import React, { useEffect, useState } from 'react'
import Sidebarmenu from './component/Sidebarmenu'
import { useGetCurrencyQuery } from '../app/apiproducts'
import { useUpdateCurrencyMutation } from '../app/apiproducts'
import { toast } from 'react-toastify'
function Currency() {

  const [updateCurrency] = useUpdateCurrencyMutation()

  const { data, isLoading, refetch } = useGetCurrencyQuery()

  console.log(data)

  useEffect(() => {


    stateCurrencydata(data ? data[0] : '')


  }, [data])


  const [formvalid, stateFormvalid] = useState('') //validation

  const [currencydata, stateCurrencydata] = useState({

    currency: ''

  })



  const inputchangehandler = (e) => {
    const { name, value } = e.target
    stateCurrencydata({
      ...currencydata, [name]: value

    })

  }

  const submithandler = async (e) => {

    refetch()

    e.preventDefault()

    try {


      const updatecurr = await updateCurrency(currencydata);

      if (updatecurr) {

        if (updatecurr.data === 'save successfully') {

          toast.success(updatecurr.data)
        } else {

          toast.error(updatecurr.data)
        }
      }
    }
    catch (error) {

      console.log(error)
    }


  }







  return (

    <div className='dashboardcontainer'>

      <Sidebarmenu />

      <div className="marquee-container">

        <form onSubmit={submithandler}>
          <h2 className="page-title"> Currency</h2>
          <div className='form-group'>


            <input type="text" style={{ textAlign: 'center' }}
              name="currency" value={currencydata ? currencydata.currency : ''} onChange={inputchangehandler} />

          </div>

          <div className='form-group'>
            <input type="submit" className='btn btn-danger' value="Save Currency" />
          </div>

        </form>




      </div>

    </div>
  )
}

export default Currency