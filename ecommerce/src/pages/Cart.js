import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { decreaseQuantity, removeFromCart, increaseQuantity } from '../reducers/cartslice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetCurrencyQuery,useGetProductssliderQuery} from '../app/apiproducts';
import Slider from 'react-slick';
import { settings } from '../components/slickcrousel';
import { backendurl } from '../baseurl/baseurl';

function Cart() {

 const{data,isLoading} =useGetCurrencyQuery()
 const {data:sliderdata} =useGetProductssliderQuery()

 const cartItems = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();

  const handleRemoveFromCart = (productId) => {

    dispatch(removeFromCart(productId));
  
    toast.success("item removed successfully")
  };


  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const getTotalPrice = () => {
    
      return cartItems.reduce((total, item) => total + item.saleprice * item.quantity, 0);
  
  };
    
    
    const carttotal= getTotalPrice();

    localStorage.setItem('carttotal',carttotal)



   
    if (isLoading) return <div>Loading...</div>;
  return (
    <div className='cartcontainer'>

      
     
      {cartItems.length === 0 ?


        <h6 style={{ display:'block',textAlign: "center" }}>cart is empty</h6>

        :

        (
          <>

            <table className="carttable">
              <thead>
                <tr>
                  <th>Sr</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th className='qtycart'>Qty</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item, index) => (

                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td><div><img style={{ width: 50 }} src={`${backendurl}/uploads/${item.productimage}`} alt='' /></div><div>{item.productname}</div></td>
                    <td>{item.saleprice}</td>
                    <td>
                      <button className='cartincbtnleft'  onClick={() => handleDecreaseQuantity(item._id)}>
                       -
                      </button>
                    
                     {item.quantity} 
                      
                      <button className='cartincbtnright' onClick={() => handleIncreaseQuantity(item._id)} disabled={item.quantity === item.inventory}
                       >
                        +
                      </button>
                     </td>
                    <td><button style={{color:'red',background:'none',border:"none",cursor:'pointer'}} onClick={() => handleRemoveFromCart(item._id)}><FontAwesomeIcon icon={faTrashAlt} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>

         <div className='proceedcheckout'>
            <h5 className='totalprice'>Total Price: {getTotalPrice()} {data?data[0].currency:''}</h5>
                  <Link to='/checkout'>
                  <button  className='btn btn-danger'>Proeced to Checkout</button>
                  </Link>
            </div>
       <div className='slidecrousel'>
      <h2 style={{marginBottom:22,fontFamily:'aviano'}}>Latest Products</h2>
      <Slider {...settings}>
        {sliderdata?sliderdata.map((product) => (
         
          <div className='latestprocrous'>
            <Link key={product.id} to={`/product/${product._id}`}>
            <img className='imgcrousel' src={`${backendurl}/uploads/${product.productimage}`} alt={product.name} />
            </Link> 
            <p style={{textAlign:'center',textDecoration:'none'}}>{product.productname}</p>
            <p>{product.saleprice} {data? data[0].currency:''}</p>
          </div>
       
        )):null}
      </Slider>
    </div>

           
          </>
         
        )
      }

    </div>
  )
}

export default Cart
