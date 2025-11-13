import axios from 'axios';
import swal from "sweetalert";
import {
    loginConfirmedAction,
    Logout,
} from '../store/actions/AuthActions';
import { validateCredentials, getUserByEmail } from './UserDatabase';

export function signUp(email, password) {
    // For demo purposes, we'll simulate a signup
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // In a real app, this would create a new user
            resolve({
                data: {
                    email,
                    localId: 'demo_user_' + Date.now(),
                    idToken: 'demo_token_' + Date.now(),
                    expiresIn: '3600'
                }
            });
        }, 1000);
    });
}

export function login(email, password) {
    // Use our hardcoded user database instead of Firebase
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = validateCredentials(email, password);
            
            if (result.success) {
                // Format response to match expected structure
                resolve({
                    data: {
                        email: result.user.email,
                        localId: result.user.profile.id,
                        idToken: result.user.token,
                        expiresIn: result.user.expiresIn.toString(),
                        role: result.user.role,
                        profile: result.user.profile,
                        permissions: result.user.permissions
                    }
                });
            } else {
                // Reject with error format that matches Firebase
                reject({
                    response: {
                        data: {
                            error: {
                                message: result.error
                            }
                        }
                    }
                });
            }
        }, 1000); // Simulate network delay
    });
}

export function formatError(errorResponse) {
    const errorMessage = errorResponse?.response?.data?.error?.message || errorResponse?.error?.message || 'UNKNOWN_ERROR';
    
    switch (errorMessage) {
        case 'EMAIL_EXISTS':
            swal("Oops", "Email already exists", "error");
            break;
        case 'EMAIL_NOT_FOUND':
            swal("Login Failed", "Email not found. Please check your email or try one of the demo accounts.", "error", { button: "Try Again!" });
            break;
        case 'INVALID_PASSWORD':
            swal("Login Failed", "Invalid password. Please check your password or try one of the demo accounts.", "error", { button: "Try Again!" });
            break;
        case 'USER_DISABLED':
            swal("Account Disabled", "This user account has been disabled", "error");
            break;
        default:
            swal("Error", "An unexpected error occurred. Please try again.", "error");
            break;
    }
}

export function saveTokenInLocalStorage(tokenDetails) {
    tokenDetails.expireDate = new Date(
        new Date().getTime() + tokenDetails.expiresIn * 1000,
    );
    
    // Store additional user information for our demo
    const userDetails = {
        ...tokenDetails,
        email: tokenDetails.email,
        role: tokenDetails.role,
        profile: tokenDetails.profile,
        permissions: tokenDetails.permissions
    };
    
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
}

export function runLogoutTimer(dispatch, timer, navigate) {
    setTimeout(() => {
        //dispatch(Logout(history));
        dispatch(Logout(navigate));
    }, timer);
}

export function checkAutoLogin(dispatch, navigate) {
    const tokenDetailsString = localStorage.getItem('userDetails');
    let tokenDetails = '';
    if (!tokenDetailsString) {
        dispatch(Logout(navigate));
		return;
    }

    tokenDetails = JSON.parse(tokenDetailsString);
    let expireDate = new Date(tokenDetails.expireDate);
    let todaysDate = new Date();

    if (todaysDate > expireDate) {
        dispatch(Logout(navigate));
        return;
    }
		
    dispatch(loginConfirmedAction(tokenDetails));
	
    const timer = expireDate.getTime() - todaysDate.getTime();
    runLogoutTimer(dispatch, timer, navigate);
}
