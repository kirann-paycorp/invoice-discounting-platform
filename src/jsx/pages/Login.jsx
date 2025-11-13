import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import {
  loadingToggleAction, loginAction,
} from '../../store/actions/AuthActions';
import { DEMO_CREDENTIALS } from '../../services/UserDatabase';

// Modern fintech login styles
import '../../assets/css/fintech-login.css';

// image
import logo from "../../assets/images/logo-white.png";
import logoWhite from "../../assets/images/logo-whiite-text.png";
import loginbg from "../../assets/images/bg-login.jpg";

function Login(props) {
  let year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  let errorsObj = { email: '', password: '' };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  // Function to set demo credentials quickly
  const setDemoCredentials = (role) => {
    const creds = DEMO_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  function onLogin(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (email === '') {
      errorObj.email = 'Email is Required';
      error = true;
    }
    if (password === '') {
      errorObj.password = 'Password is Required';
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }
    dispatch(loadingToggleAction(true));
    dispatch(loginAction(email, password, navigate));
  }

  return (
    <div className="fintech-login-main">
      {/* Modern Fintech Login Container */}
      <div className="fintech-login-container">
        {/* Left Side - Branding & Info */}
        <div className="fintech-login-left">
          <div className="fintech-brand-section">
            <div className="fintech-logo-container">
              <img src={logoWhite} alt="Invome" className="fintech-logo" />
            </div>
            <div className="fintech-welcome-content">
              <h1 className="fintech-main-title">
                Welcome to <span className="fintech-accent">Invome</span>
              </h1>
              <p className="fintech-subtitle">
                Your trusted partner in invoice discounting and financial solutions. 
                Streamline your cash flow with our secure, professional platform.
              </p>
              <div className="fintech-features">
                <div className="fintech-feature-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Bank-level Security</span>
                </div>
                <div className="fintech-feature-item">
                  <i className="fas fa-clock"></i>
                  <span>Instant Processing</span>
                </div>
                <div className="fintech-feature-item">
                  <i className="fas fa-chart-line"></i>
                  <span>Real-time Analytics</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fintech-footer">
            <div className="fintech-social-links">
              <Link to={"https://www.facebook.com/dexignzone"} target='_blank' className="fintech-social-link">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link to={"https://twitter.com/dexignzones"} target='_blank' className="fintech-social-link">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link to={"https://www.linkedin.com/in/dexignzone"} target='_blank' className="fintech-social-link">
                <i className="fab fa-linkedin-in"></i>
              </Link>
            </div>
            <div className="fintech-legal-links">
              <Link to={"#"} className="fintech-legal-link">Privacy Policy</Link>
              <Link to={"#"} className="fintech-legal-link">Terms of Service</Link>
              <span className="fintech-copyright">© {year} Invome</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="fintech-login-right">
          <div className="fintech-login-form-container">
            <div className="fintech-form-header">
              <h2 className="fintech-form-title">Sign In</h2>
              <p className="fintech-form-subtitle">Access your financial dashboard</p>
            </div>

            {/* Error/Success Messages */}
            {props.errorMessage && (
              <div className='fintech-alert fintech-alert-error'>
                <i className="fas fa-exclamation-circle"></i>
                {props.errorMessage}
              </div>
            )}
            {props.successMessage && (
              <div className='fintech-alert fintech-alert-success'>
                <i className="fas fa-check-circle"></i>
                {props.successMessage}
              </div>
            )}

            <form onSubmit={onLogin} className="fintech-login-form">
              <div className="fintech-form-group">
                <label className="fintech-form-label">
                  Email Address <span className="fintech-required">*</span>
                </label>
                <input 
                  type="email" 
                  className="fintech-form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
                {errors.email && <div className="fintech-form-error">{errors.email}</div>}
              </div>

              <div className="fintech-form-group">
                <label className="fintech-form-label">
                  Password <span className="fintech-required">*</span>
                </label>
                <input
                  type="password"
                  className="fintech-form-input"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="fintech-form-error">{errors.password}</div>}
              </div>

              {/* Demo Credentials Section */}
              {showDemoCredentials && (
                <div className="fintech-demo-section">
                  <div className="fintech-demo-header">
                    <h6 className="fintech-demo-title">
                      <i className="fas fa-users"></i>Demo User Accounts
                    </h6>
                    <button 
                      type="button" 
                      className="fintech-demo-close" 
                      onClick={() => setShowDemoCredentials(false)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="fintech-demo-grid">
                    <div className="fintech-demo-card">
                      <div className="fintech-demo-badge fintech-badge-seller">Seller</div>
                      <div className="fintech-demo-desc">Creates contracts & projects</div>
                      <button 
                        type="button" 
                        className="fintech-demo-btn"
                        onClick={() => setDemoCredentials('seller')}
                      >
                        Use Seller Account
                      </button>
                    </div>
                    <div className="fintech-demo-card">
                      <div className="fintech-demo-badge fintech-badge-financier">Financier</div>
                      <div className="fintech-demo-desc">Reviews & funds projects</div>
                      <button 
                        type="button" 
                        className="fintech-demo-btn"
                        onClick={() => setDemoCredentials('financier')}
                      >
                        Use Financier Account
                      </button>
                    </div>
                    <div className="fintech-demo-card">
                      <div className="fintech-demo-badge fintech-badge-admin">Admin</div>
                      <div className="fintech-demo-desc">Full system access</div>
                      <button 
                        type="button" 
                        className="fintech-demo-btn"
                        onClick={() => setDemoCredentials('admin')}
                      >
                        Use Admin Account
                      </button>
                    </div>
                    <div className="fintech-demo-card">
                      <div className="fintech-demo-badge fintech-badge-buyer">Buyer</div>
                      <div className="fintech-demo-desc">Manages purchase orders</div>
                      <button 
                        type="button" 
                        className="fintech-demo-btn"
                        onClick={() => setDemoCredentials('buyer')}
                      >
                        Use Buyer Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="fintech-form-options">
                <div className="fintech-remember-check">
                  <input
                    type="checkbox"
                    className="fintech-checkbox"
                    id="fintech_remember"
                  />
                  <label className="fintech-checkbox-label" htmlFor="fintech_remember">
                    Remember me
                  </label>
                </div>
                <Link to="#" className="fintech-forgot-link">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                className="fintech-submit-btn"
                disabled={props.showLoading}
              >
                {props.showLoading ? (
                  <>
                    <span className="fintech-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="fintech-form-footer">
              <p className="fintech-register-text">
                Don't have an account?{" "}
                <Link className="fintech-register-link" to="/page-register">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};
export default connect(mapStateToProps)(Login);
