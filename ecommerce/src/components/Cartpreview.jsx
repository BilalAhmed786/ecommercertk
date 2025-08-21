import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { decreaseQuantity, removeFromCart, increaseQuantity } from '../reducers/cartslice';
import { useGetCurrencyQuery } from '../app/apiproducts';
import { Link } from 'react-router-dom';
import { backendurl } from '../baseurl/baseurl';

function Cartpreview() {

  const { data, isLoading } = useGetCurrencyQuery()



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



  return (
    <>
      {cartItems.length > 0 ?
        <> 
          <table className="carttable cartviewtab">
            <thead>
              <tr>
                <th>Sr</th>
                <th>Name</th>
                <th>Price</th>
                <th style={{ padding: 14 }} className='qtycart'>Qty</th>
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
                    <button style={{ background: 'none', border: 'none' }} onClick={() => handleDecreaseQuantity(item._id)}>
                      -
                    </button>{item.quantity}
                    <button style={{ background: 'none', border: 'none' }} onClick={() => handleIncreaseQuantity(item._id)} disabled={item.quantity === item.inventory}
                    >
                      +
                    </button>
                  </td>
                  <td>
                    <button style={{ color: 'red', background: 'none', border: "none", cursor: 'pointer' }} onClick={(e) => handleRemoveFromCart(item._id, e)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>

              ))}
            </tbody>
          </table>

          <div className='cartviewoptions'>
            <div>
              Total: {getTotalPrice()}{data ? data[0].currency : ''}</div>
            <div><Link to='/cart'><button className='btn-cartpreview'>view cart</button></Link></div>
          </div>

        </>

        : null}

    </>
  )
}

export default Cartpreview