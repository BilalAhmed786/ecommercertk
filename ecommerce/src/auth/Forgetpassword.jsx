import { useState } from 'react';
import { useForgetpasswordMutation } from '../app/apiauth';
import { toast } from 'react-toastify';

function Forgetpassword() {
   const[Userdata] = useForgetpasswordMutation()
    const [Forgetvalid, stateForgetvalid] = useState('')

  
    const [Forget, ForgteState] = useState({
        email: '',
     
        })

    const ForgetUser = (e) => {

        const { name, value } = e.target
    
    
        ForgteState({
          ...Forget,
          [name]: value
    
        })
    
      }


    const ForgetCread = async (e) => {

        e.preventDefault();

        
    try {

        const validation = await Userdata(Forget)

        

        
        if(validation.data === 'Password reset email sent'){

            toast.success(validation.data)

        }else{

          toast.error(validation.data)

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
                <h2 className="text-uppercase text-center mb-5">Forget password</h2>

                <div style={{ color: "red" }}>


                </div>


                <form method="POST" onSubmit={ForgetCread}>

                 

                  <div className="form-outline mb-4">
                    <input type="email" name='email' className="form-control form-control-lg" onChange={ForgetUser} />
                    <label className="form-label" htmlFor="youremail">Your Email</label>
                  </div>

                  {Forgetvalid?
                    <div className='alert alert-danger' 
                    style={{textAlign:'center'}}>
                    
                        {Forgetvalid}
                        
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

export default Forgetpassword