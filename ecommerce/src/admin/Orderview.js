import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebarmenu from './component/Sidebarmenu';
import { useGetSingleorderforadminQuery, useSingleOrderStatusMutation } from '../app/apiorders';
import { useGetCurrencyQuery } from '../app/apiproducts';
import { toast } from 'react-toastify';


function Orderview() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading, error, refetch } = useGetSingleorderforadminQuery(id);
    const { data: currency } = useGetCurrencyQuery();
    const [ordersingleStatus] = useSingleOrderStatusMutation();
    const [orderstatus, setOrderstatus] = useState({ status: '' });

    const userdata = data?.[0];
    const curr = currency?.[0] || {};

    const productsname = userdata?.productname || [];
    const productsquantity = userdata?.productquantity || [];
    const productsprice = userdata?.productsprice || [];
    const productsid = userdata?._id;

    const handleStatusChange = (e) => {
        const { name, value } = e.target;
        setOrderstatus({ ...orderstatus, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await ordersingleStatus({
                status: orderstatus,
                productsname,
                productsquantity,
                productsid,
            });

            if (result?.data === 'update successfully') {
                toast.success(result.data);
                refetch();
            } else {
                toast.error(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error loading order.</div>;

    return (
        <div className="dashboardcontainer">
            <Sidebarmenu />
            <main className="order-container">
                <div className="order-header">
                    <button className="back-button" onClick={() => navigate('/orders')}>← All Orders</button>
                </div>
                    <h2 className="page-title">Order Details</h2>
                <form className="status-form" onSubmit={handleSubmit}>
                    <button  className="status-btn" type="submit" >Update</button>
                    <select className="status" onChange={handleStatusChange} >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="return">Return</option>
                        <option value="fulfilled">Fulfilled</option>
                    </select>
                </form>

                <div style={{ overflowX: 'auto' }}>
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{productsname.map((name, i) => <div key={i}>{i + 1}. {name}</div>)}</td>
                            <td>{productsquantity.map((qty, i) => <div key={i}>{qty}</div>)}</td>
                            <td>{productsprice.map((price, i) => <div key={i}>{price}</div>)}</td>
                            <td><span className="status-badge">{userdata?.status}</span></td>
                        </tr>
                    </tbody>
                </table>
                </div>

                <div className="amount-summary">
                    <div><strong>Cart Total:</strong> {userdata?.carttotal}</div>
                    <div><strong>Shipment:</strong> {userdata?.shipmentcharges}</div>
                    <div><strong>Total:</strong> {curr.currency} {userdata?.totalamount}</div>
                </div>

                <div className="biller-info">
                    <h3>Biller Info</h3>
                    <div>{userdata?.address}</div>
                    <div>{userdata?.email}</div>
                    <div>{userdata?.mobile}</div>
                </div>
            </main>
        </div>
    );
}

export default Orderview;
