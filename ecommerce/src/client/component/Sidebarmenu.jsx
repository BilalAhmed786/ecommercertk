import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogoutUserMutation } from '../../app/apiauth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMapMarkerAlt, faClipboardList, faUserCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAllOrdersforclientQuery } from '../../app/apiorders';

function Sidebarmenu() {
  const [search, searchItem] = useState('')

  const { data: allorders, isLoading, refetch: ordersRec } = useAllOrdersforclientQuery(search)

  const [logoutuser] = useLogoutUserMutation();

  const navigate = useNavigate();


  const Logout = async () => {


    try {


      await logoutuser();

      localStorage.removeItem('user')
      
      navigate('/login')

    }

    catch (error) {

      console.log(error)

    }
  }

  //toggle sidebar menu
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => {
    setIsOpen(true);
  };
  const closeSidebar = () => {

    setIsOpen(false);
  };

  return (
    <div className='leftsidebarmenu'>
      <div><button className='dashmenu' onClick={openSidebar}><FontAwesomeIcon icon={faBars} /></button></div>
      <div className={`sidebar ${isOpen ? 'open' : 'close'}`}>
        <div><button className='btncloseside' onClick={closeSidebar}>x</button></div>
        <div className="no-marker clintmenu">
          <ul>

            <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faMapMarkerAlt} /><Link className='menuitems' to='/billingaddress'>Billing Address</Link></li>
            <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faClipboardList} /><Link className='menuitems' to='/clientorders'>Orders</Link></li>
            <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faUserCog} /><Link className='menuitems' to='/Profile'>Account details</Link></li>
            <li className='menudashboard'><FontAwesomeIcon style={{ color: 'red' }} icon={faSignOutAlt} /><Link className='menuitems' to='/logout' onClick={Logout}>Logout</Link></li>

          </ul>
        </div>
      </div>
    </div>
  )

}

export default Sidebarmenu