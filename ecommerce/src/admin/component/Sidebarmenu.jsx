import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser,faFilter, faShoppingBag, faPlus, faTruck, faFolderOpen, faRubleSign, faClipboardList, faKey, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';
import { useAllOrdersforadminQuery } from '../../app/apiorders';
import { useGetReviewsforadminQuery } from '../../app/apiproducts';
function Sidebarmenu() {
  const [search, searchItem] = useState('')

  const { data: allorders, isLoading, refetch: ordersRec } = useAllOrdersforadminQuery(search)

  const { data: allreviews, refetch } = useGetReviewsforadminQuery(search)


  const reviewpend = () => {
    const filtered = allreviews ? allreviews.Reviews.filter(record => record.status === 'pending') : '';
    return filtered.length
  };


  const orderpend = () => {
    const filtered = allorders ? allorders.orders.filter(record => record.status === 'pending') : '';
    return filtered.length
  };








  //toggle sidebar menu
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => {
    setIsOpen(true);
    ordersRec()
    refetch()
  };
  const closeSidebar = () => {

    setIsOpen(false);
  };



  return (
    <div className='leftsidebarmenu'>
      <button className='dashmenu' onClick={openSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'close'}`}>
        <button className='btncloseside' onClick={closeSidebar}>×</button>

        <ul className='menu-list'>
          <li><FontAwesomeIcon icon={faUser} /><Link to='/alluser'>All User</Link></li>
          <li><FontAwesomeIcon icon={faShoppingBag} /><Link to='/allproducts'>Products</Link></li>
          <li><FontAwesomeIcon icon={faPlus} /><Link to='/addproduct'>Add Product</Link></li>
          <li><FontAwesomeIcon icon={faFilter} /><Link to='/productfilter'>Product Filter</Link></li>
          <li><FontAwesomeIcon icon={regularStar} /><Link to='/productreviews'>Product Reviews</Link>{reviewpend() > 0 && <span className='tag'>{reviewpend()}</span>}</li>
          <li><FontAwesomeIcon icon={faClipboardList} /><Link to='/orders'>Orders</Link>{orderpend() > 0 && <span className='tag'>{orderpend()}</span>}</li>
          <li><FontAwesomeIcon icon={faFolderOpen} /><Link to='/addcategory'>Categories</Link></li>
          <li><FontAwesomeIcon icon={faRubleSign} /><Link to='/addcurrency'>Currency</Link></li>
          <li><FontAwesomeIcon icon={faTruck} /><Link to='/shipment'>Shipment</Link></li>
          <li><FontAwesomeIcon icon={faKey} /><Link to='/changepass'>Change Password</Link></li>
        </ul>
      </div>
    </div>

  )
}

export default Sidebarmenu