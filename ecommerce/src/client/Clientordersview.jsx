import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Sidebarmenu from './component/Sidebarmenu'
import { useGetSingleorderforclientQuery } from '../app/apiorders'
import { useGetCurrencyQuery } from '../app/apiproducts'

function Clientordersview() {

    const { id } = useParams()
    const { data, error, isLoading } = useGetSingleorderforclientQuery(id)
    const { data: currency } = useGetCurrencyQuery()
    const userdata = data ? data[0] : ''
    const curr = currency ? currency[0] : ''


    if (isLoading) {

        return <div>...isLoading</div>
    }

    if (error) return <div>Error: {error.message}</div>;
    return (
        <div className="dashboardcontainer">
            <Sidebarmenu />

            <div className="order-container">
                <div className="order-header">
                    <Link to="/clientorders" className="back-link">← All Orders</Link>
                </div>
                    <h2 className='page-title'>Order Details</h2>

                <div className="table-wrapper">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userdata.productname.map((product, index) => (
                                <tr key={index}>
                                    <td>{product}</td>
                                    <td>{userdata.productquantity[index]}</td>
                                    <td>{userdata.productsprice[index]}</td>
                                    {index === 0 && (
                                        <td rowSpan={userdata.productname.length} className="status-cell">
                                            {userdata.status}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="order-summary">
                    <div><strong>Cart Total:</strong> {userdata.carttotal}</div>
                    <div><strong>Shipment:</strong> {userdata.shipmentcharges}</div>
                    <div><strong>Total:</strong> {curr.currency} {userdata.totalamount}</div>
                </div>

                <div className="billing-card">
                    <h3>Billing Details</h3>
                    <p>{userdata.address}</p>
                    <p>{userdata.email}</p>
                    <p>{userdata.mobile}</p>
                </div>
            </div>
        </div>


    )
}

export default Clientordersview