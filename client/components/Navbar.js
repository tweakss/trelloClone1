import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import {logout} from '../store'



const Navbar = (props) => {
  const {
    handleClick, isLoggedIn,
    user,
  } = props;

  // console.log("Navbar, user:", user);
  
  return (
    <div className="navbar-main">
      <nav>
        {isLoggedIn ? (
          <div>
            {/* The navbar will show these links after you log in */}
            <Link className="nav-home | text-decoration-none" to="/home">Home</Link>
            <a className="nav-logout | text-decoration-none " href="#" onClick={handleClick}>
              Logout
            </a>
            <span>Logged in as: {user.username}, userId: {user.id} </span>
          </div>
        ) : (
          <div>
            {/* The navbar will show these links before you log in */}
            <Link className="nav-login | text-decoration-none" to="/login">Login</Link>
            <Link className="nav-signup | text-decoration-none" to="/signup">Sign Up</Link>
          </div>
        )}
      </nav>
      {/* <hr /> */}
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)
