import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { authenticate, validateUsername } from '../store'
import { Link } from 'react-router-dom'


/**
 * COMPONENT
 */
const AuthForm = props => {
  const {
    name, displayName, handleAuthenticate, error, validateUsername,
    userExists,
  } = props;
  const dispatch = useDispatch();

  const [showPwInput, setShowPwInput] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  
  const [usernameInput, setUsernameInput] = useState("");
  const handleUsernameInput = (event) => {
    setUsernameInput(event.target.value);
  }

  const handleValidateUsername = async() => {
    if(usernameInput.length === 0) {
      return;
    }

    const response = await validateUsername(usernameInput);
    // console.log("handleValidateUsername, response:", response);
    if(response) {
      setShowPwInput(true);
      setShowUsernameInput(false);
    }
    
  }

  const [pwInput, setPwInput] = useState("");
  const handlePwInput = (event) => {
    setPwInput(event.target.value);
  }

  const [emailInput, setEmailInput] = useState("");
  const handleEmailInput = (event) => {
    setEmailInput(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formName = event.target.name;
    handleAuthenticate(usernameInput, pwInput, emailInput, formName)
  }

  const handleToSignup = () => {
    dispatch({
      type: "CLEAR_AUTH_STATE",
    });
  }

  const handleToLogin = () => {
    setShowPwInput(false);
    setShowUsernameInput(true);

    dispatch({
      type: "CLEAR_AUTH_STATE",
    });
  }

  console.log("AuthForm RENDER, auth.error:", error)

  return (
    <div id="login-signup-page">
      <div className="auth-form-wrapper">
        <div className="auth-form-main-title">
          <h1 className="auth-form-main-title-txt">TrelloClone1</h1>
        </div>
        <div className="auth-form-container">
          
          <div className="auth-form">
            {
              displayName === "Login" && userExists ?
              <h4 
                className="auth-form-login-title-after-txt"
              >
                Login to continue to: 
                <div className="login-title-after-txt-container">
                  <b>Trello</b>
                </div>
              </h4> : (
                name === "signup" ?
                <h4 
                  className="auth-form-signup-title-txt"
                >
                  Sign up for your account
                </h4> :
                <h4 
                  className="auth-form-login-title-txt"
                >
                  Login to Trello
                </h4>

              )
               
            }
            
            <form
              className="auth-form-form" 
              onSubmit={handleSubmit} name={name}
            >
              {
                showUsernameInput ? 
                <div>
                  <input
                    className="auth-form-input-username" 
                    name="username" type="text"
                    value={usernameInput}
                    onChange={handleUsernameInput}
                    placeholder="Enter username" 
                  />
                </div> :
                <div className="auth-form-input-username-after-container">
                  <span className="auth-form-input-username-after">{usernameInput}</span>
                </div>
              }
              

              {
                !showPwInput && name === "login" ?
                <div>
                  <button
                    type="button"
                    className="auth-form-continue-btn | bdr-none br-025rem"
                    onClick={handleValidateUsername}
                  >
                    Continue
                  </button>
                </div> : null
              }
              

              {
                showPwInput || name === "signup" ?
                <div>
                  <input 
                    className="auth-form-input-pw"
                    name="password" type="password"
                    value={pwInput}
                    onChange={handlePwInput}
                    placeholder="Enter password"
                  />
                </div> : null
              }

              {
                name === 'signup' ? 
                <div>
                  <input 
                    className="auth-form-input-email"
                    name="email" type="email"
                    value={emailInput}
                    onChange={handleEmailInput}
                    placeholder="Enter email address"
                  />
                </div> : null
              }

              {
                displayName === "Login" && userExists ?
                <div>
                  <button
                    className="auth-form-submit-login-btn | bdr-none br-025rem"
                    type="submit"
                  >
                    {displayName}
                  </button>
                </div> : (
                  displayName === "Sign Up" ?
                  <div>
                  <button
                    className="auth-form-submit-signup-btn | bdr-none br-025rem"
                    type="submit"
                  >
                    {displayName}
                  </button>
                </div> : null
                )
              }
              
              {error && error.response && <div> {error.response.data} </div>}
            </form>

            <hr className="auth-form-separator" />

            <div >
                <Link 
                  className="auth-form-to-login | text-decoration-none" to="/login"
                  onClick={handleToLogin}
                >
                  Login
                </Link>
                <div className="auth-form-separate-login-signup-container">
                  <span className="auth-form-separate-login-signup"></span>
                </div>
                <Link className="auth-form-to-signup | text-decoration-none" to="/signup"
                  onClick={handleToSignup}
                >
                  Sign Up
                </Link>
            </div>
        
          </div>
        </div>
        
      </div>
    </div>
    
  
  )
}

const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.auth.error,
    userExists: state.auth.userExists
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.auth.error
  }
}

const mapDispatch = dispatch => {
  return {
    // handleSubmit(evt) {
    //   evt.preventDefault()
    //   const formName = evt.target.name
    //   const username = evt.target.username.value
    //   const password = evt.target.password.value

    //   let email = '';
    //   if(evt.target.email) {
    //     email = evt.target.email.value;
    //   }
      
    //   dispatch(authenticate(username, password, email, formName))
    // },
    handleAuthenticate: (username, password, email, formName) => dispatch(authenticate(username, password, email, formName)),
    validateUsername: (username) => dispatch(validateUsername(username)),
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)
