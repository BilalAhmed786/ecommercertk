import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useStripePaymentMutation } from '../app/apiproducts';
import { useUserDetailsMutation } from '../app/apiauth';
import { useGetBillingaddressQuery } from '../app/apiorders';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { frontendurl } from '../baseurl/baseurl';

function Checkout(props) {
    const navigate = useNavigate();
    const shipmentcharges = props.data?.data?.[0]?.shipment || 0;
    const currency = props.data?.currency?.[0]?.currency || '';
    const cartdetails = useSelector((state) => state.cart.cart);

    const [data] = useUserDetailsMutation();
    const [userinfo, setUserinfo] = useState('');
    const { data: billingaddress, isLoading } = useGetBillingaddressQuery(userinfo ? userinfo?.useremail : '');

    let productname = [], productsprice = [], inventory = [], productid = [], productquantity = [];

    if (cartdetails.length > 0) {
        productname = cartdetails.map((item) => item.productname);
        productsprice = cartdetails.map((item) => item.saleprice);
        inventory = cartdetails.map((item) => item.inventory);
        productid = cartdetails.map((item) => item._id);
        productquantity = cartdetails.map((quantity) => quantity.quantity);
    } else {
        navigate('/');
    }

    const getTotalPrice = () => {
        return cartdetails.reduce((total, item) => total + item.saleprice * item.quantity, 0);
    };

    let carttotal = getTotalPrice();
    let totalamount = parseInt(carttotal) + parseInt(shipmentcharges);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const result = await data();
                if (result && result.data) {

                  console.log(result.data)
                    setUserinfo(result.data);

                    
                    if (billingaddress && billingaddress.length > 0) {
                        const defaultBilling = billingaddress[0];
                        setPaymentMethod((prev) => ({
                            ...prev,
                            name: defaultBilling.name || '',
                            email: defaultBilling.email || '',
                            mobile: defaultBilling.mobile || '',
                            city: defaultBilling.city || '',
                            address: defaultBilling.address || ''
                        }));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserInfo();
    }, [billingaddress]);


    const [paymentMode] = useStripePaymentMutation();
    const stripe = useStripe();
    const elements = useElements();
    const [paymentMethod, setPaymentMethod] = useState({
        name: '', email: '', mobile: '', city: '', address: '', stripepayment: '',
    });

    const handlePaymentMethodChange = (e) => {
        const { name, value } = e.target;
        setPaymentMethod({ ...paymentMethod, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (paymentMethod.stripepayment === 'Stripe') {
            const { token, error } = await stripe.createToken(elements.getElement(CardElement));
            if (token) {
                const result = await paymentMode({
                    token: token.id, paymentMethod, productname, productid,
                    productsprice, inventory, productquantity, carttotal, shipmentcharges, totalamount,
                });
                if (!result.data.msg) toast.error(result.data);
                else window.location.href =frontendurl;
            } else toast.error(error.message);
        } else {
            const result = await paymentMode({
                paymentMethod, productname, productid,
                productsprice, inventory, productquantity, carttotal, shipmentcharges, totalamount,
            });
            if (!result.data.msg) toast.error(result.data);
            else {
                toast.success(result.data.msg);
                localStorage.removeItem('cartItems');
                window.location.href = frontendurl;
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className='checkout-container'>
            <h2 className='checkout-title'>Checkout</h2>
            <form className='checkout-form' onSubmit={handleSubmit}>
                <div className='checkout-columns'>
                    <div className='checkout-left'>
                        <div className='form-group'>
                            <label>Name</label>
                            <input type='text' name='name' value={paymentMethod.name} onChange={handlePaymentMethodChange} />
                        </div>
                        <div className='form-group'>
                            <label>Email</label>
                            <input type='text' name='email' value={paymentMethod.email} onChange={handlePaymentMethodChange} />
                        </div>
                        <div className='form-group'>
                            <label>Contact No</label>
                            <input type='text' name='mobile' value={paymentMethod.mobile} onChange={handlePaymentMethodChange} />
                        </div>
                        <div className='form-group'>
                            <label>City</label>
                            <input type='text' name='city' value={paymentMethod.city} onChange={handlePaymentMethodChange} />
                        </div>
                        <div className='form-group'>
                            <label>Address</label>
                            <textarea name='address' rows='4' value={paymentMethod.address} onChange={handlePaymentMethodChange}></textarea>
                        </div>
                    </div>
                    <div className='checkout-right'>
                        <div className='order-summary'>
                            <h5>Order Summary</h5>
                            <ul>
                                {cartdetails.map((product, index) => (
                                    <li key={index}><b>{index + 1}</b>. {product.productname} x {product.quantity}</li>
                                ))}
                            </ul>
                            <p><b>Cart Total:</b> {carttotal}</p>
                        </div>
                        <div className='checkout-totals'>
                            <p><b>Shipment Charges:</b> {shipmentcharges}</p>
                            <p><b>Total Amount:</b> {totalamount} {currency}</p>
                        </div>
                        <div className='payment-options'>
                            <h5>Payment Method</h5>
                            <label>
                                <input type='radio' name='stripepayment' value='Stripe' checked={paymentMethod.stripepayment === 'Stripe'} onChange={handlePaymentMethodChange} required /> Stripe
                            </label>
                            <label>
                                <input type='radio' name='stripepayment' value='cod' checked={paymentMethod.stripepayment === 'cod'} onChange={handlePaymentMethodChange} required /> Cash on Delivery
                            </label>
                            {paymentMethod.stripepayment === 'Stripe' && <CardElement className='card-element' />}
                        </div>
                        <button type='submit' className='btn btn-danger checkout-btn'>Pay</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Checkout;