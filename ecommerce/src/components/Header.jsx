import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faUser, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation, useUserDetailsMutation } from '../app/apiauth';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Hamburger from './hamburger';
import Cartpreview from './Cartpreview';
import { backendurl, frontendurl } from '../baseurl/baseurl';



function Header() {


  const [refetchuser] = useUserDetailsMutation();
  const [logoutuser] = useLogoutUserMutation();
  const totalQuantity = useSelector((state) => state.cart.cart.length);
  const [register, setRegister] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userdata, setUserdata] = useState('')
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen(isOpen => !isOpen);
  const handleUserAuth = () => setRegister(!register);


  const handleLogoutuser = async () => {

    const logout = await logoutuser()

  
    if (logout) {

      navigate('/login')
    }


  }

  useEffect(() => {

    const getuser = async () => {

      const userdata = await refetchuser()

      setUserdata(userdata?.data || '')

    }

    getuser()



  }, [userdata])


  return (
    <div className='headercontainer'>
      <div className='headercontent'>
        <div className='logocontainer'>
          <div className='site-logo-contianer'>
            <Link to={`${frontendurl}`}>
            <img className='site-logo' src={`${backendurl}/uploads/thrifter.png`} alt='Logo' />
            </Link>
          </div>
          <div>
            {!userdata?.userrole ?
              <>
                <div className='userbutton'>
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px' }} onClick={handleUserAuth} />
                  <FontAwesomeIcon icon={faArrowCircleDown} style={{ fontSize: '15px' }} onClick={handleUserAuth} />
                </div>
                <div className='dropdownuser' style={{ display: register ? 'block' : 'none' }}>
                  <li><Link to="/login" onClick={() => setRegister(false)}>Login</Link></li>
                  <li><Link to="/register" onClick={() => setRegister(false)}>Register</Link></li>
                </div>
              </> :
              <><FontAwesomeIcon className='logouticon'  onClick={handleLogoutuser} icon={faRightFromBracket} /></>

            }
          </div>
        </div>
        <div className='navmenu'>
          <Link className='menuheader' to="/" onClick={() => setRegister(false)}>Shop</Link>
          <Link className='menuheader' to="/cart" onClick={() => setRegister(false)}>Cart</Link>
          <Link className='menuheader' to="/checkout" onClick={() => setRegister(false)}>Checkout</Link>
          {userdata?.userrole === 'admin' ? <Link className='menuheader' to="/dashboard">Dashboard</Link> : ''}
          {userdata?.userrole === 'subscriber' && <Link className='menuheader' to="/client">Dashboard</Link>}
        </div>
        
          <div className="iconcontainer">
          <div className="iconsetup">
           <Link to={`${frontendurl}/cart`}>
            <FontAwesomeIcon
              className="carticon"
              icon={faShoppingBag} 
            

            />
            <span className="qunatity">{totalQuantity}</span>
          </Link>
          </div>

          <div className="cartpreview">
            <Cartpreview />
          </div>
        </div>
     </div>
      <Hamburger 
        toggleMenu={toggleMenu} 
        setIsOpen={setIsOpen} 
        isOpen={isOpen}
        userdata={userdata}
        handleLogoutuser={handleLogoutuser}
        />
    </div>
  );
}

export default Header;
