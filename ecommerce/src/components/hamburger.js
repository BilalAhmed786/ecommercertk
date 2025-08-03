import { Link } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Hamburger({ setIsOpen, toggleMenu, isOpen, Logout, userdata }) {

  return (
    <div className="hamburgercontainer">
      <div className="hamburger-icons">

        <button onClick={toggleMenu} style={{ display: isOpen ? 'flex' : 'none', background: 'none', border: 'none', fontSize: '24px' }}>
          <FaTimes />
        </button>


        <button onClick={toggleMenu} style={{ display: !isOpen ? 'flex' : 'none', background: 'none', border: 'none', fontSize: '24px' }}>
          <FaBars />
        </button>
      </div>
      <div className="dropdown-hamburger" style={{
        maxHeight: isOpen ? '700px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out',
      }}>

        <li><Link to="/" onClick={() => setIsOpen(false)}>Shop</Link></li>
        <li><Link to="/cart" onClick={() => setIsOpen(false)}>Cart</Link></li>
        <li><Link to="/checkout" onClick={() => setIsOpen(false)}>Checkout</Link></li>
        {!userdata.userrole ?
          <>
            <li><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
            <li><Link to="/register" onClick={() => setIsOpen(false)}>Register</Link></li>
          </>
          :
          <>
            {userdata?.userrole === 'admin' && 
            <li><Link className='menuheader' to="/dashboard">Dashboard</Link></li> }
            {userdata?.userrole === 'subscriber' &&
            <li> <Link className='menuheader' to="/client">Dashboard</Link></li>}
            <li onClick={Logout}><Link>Logout</Link></li>
          </>
        }
      </div>
    </div>
  );
}
