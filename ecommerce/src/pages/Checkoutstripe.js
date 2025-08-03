// Checkout.js
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './Checkout';
import { useGetShipmentQuery,useGetCurrencyQuery } from '../app/apiproducts';

const stripePromise = loadStripe('pk_test_51NcvwgKgFXig68gS6L70mmG6mn6OYPuyBgpMbqQtRtEwfhvfzjU8Emuh8kHJn9U512rxYValI8Jn6MUxoUtf3D2B00k8kkT6Im');

const Checkoutstripe = () => {

   const{data,isLoading} = useGetShipmentQuery()
   const{data:currency} = useGetCurrencyQuery()

    if(isLoading){

    return <div>...isLoading</div>
   }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm data={{data:data,currency:currency}} />
    </Elements >
  );
};

export default Checkoutstripe;
