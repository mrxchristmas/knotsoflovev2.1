import { useReducer, useEffect, useState } from "react"
import { EmailAuthProvider, signInAnonymously, signInWithPopup, 
    GithubAuthProvider, TwitterAuthProvider, FacebookAuthProvider, GoogleAuthProvider, 
    reauthenticateWithCredential, deleteUser, confirmPasswordReset, sendPasswordResetEmail, 
    updatePassword, sendEmailVerification, signInWithEmailAndPassword, signOut, 
    createUserWithEmailAndPassword, updateProfile, updateEmail } from "firebase/auth"
import { auth } from "../firebase/config"
import { useAuthContext } from '../hooks/useAuthContext' 

let initState = {
    user: null,
    isPending: false,
    error: null,
    success: null
}
const authReducer =(state, action)=>{
    switch (action.type) {
        case 'IS_PENDING':
            return {isPending: true, user: null, success: false, error: null}
        case 'LOGIN':
            return { isPending: false, user: action.payload, success: true, error: null}
        case 'LOGOUT':
            return { isPending: false, user: action.payload, success: true, error: null}
        case 'SIGNUP':
            return { isPending: false, user: action.payload, success: true, error: null}
        case 'UPDATE':
            return { isPending: false, user: null, success: true, error: null}
        case 'ERROR':
            return { isPending: false, user: null, success: false, error: action.payload}
        case 'RESET':
            return { isPending: false, user: null, success: false, error: null}
    
        default:
            return state
    }

}

export const useAuth =()=>{
    const [response, dispatch] = useReducer(authReducer, initState)
    const [isCancelled, setIsCancelled] = useState(false)

    const { dispatch: authDispatch } = useAuthContext()

    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
    const twitterProvider = new TwitterAuthProvider();
    const githubProvider = new GithubAuthProvider();

    const getProviderForProviderId =(providerId)=>{
        console.log(providerId)
        switch (providerId) {
            case 'google.com':
                return googleProvider
            case 'facebook.com':
                return facebookProvider
            case 'twitter.com':
                return twitterProvider
            case 'github.com':
                return githubProvider
            default:
                break;
        }
    }

    // only Dispatch If Not Cancelled
    const DINC = action =>{
        if(!isCancelled){
            dispatch(action)
        }
    }

    // login
    const login = async (email, password) =>{
        dispatch({
            type: 'IS_PENDING'
        })
        try {
            signInWithEmailAndPassword(auth, email, password)
            .then(res => {
                console.log('user logged in: ', res);
                DINC({
                    type: 'LOGIN',
                    payload: res.user
                })
                authDispatch({
                    type: 'LOGIN',
                    payload: res.user
                })
            })
            .catch(err => {
                console.log(err.code)
                let errmsg = ""
                if(err.code === "auth/user-not-found"){
                    errmsg = "User not Found"
                }
                DINC({
                    type: 'ERROR',
                    payload: errmsg
                })
            })
        } catch (err) {
            DINC({
                type: 'ERROR',
                payload: err.message
            })
        }
        
    }

    // logout
    const logout = async () =>{
        dispatch({
            type: 'IS_PENDING'
        })

        const signout = () => {
            signOut(auth)
                .then(() => {
                    console.log('user signed out');
                    DINC({
                        type: 'LOGOUT'
                    })
                    authDispatch({
                        type: 'LOGOUT'
                    })
                })
                .catch(() => {
                    DINC({
                        type: 'ERROR',
                        payload: "Something went wrong..."
                    })
                })
        }

        try {
            // console.log()
            if(auth.currentUser.isAnonymous){
                console.log("all data will be lost if you logout..")
                // confirm prompt
                signout()
            }else{
                signout()
            }
            
            
        } catch (err) {
            DINC({
                type: 'ERROR',
                payload: err.message
            })
        }
    }

    const signup = async (email, password) =>{
        dispatch({
            type: 'IS_PENDING'
        })
        try {
            createUserWithEmailAndPassword(auth, email, password)
            .then(res => {
                console.log('user signed up: ', res.user);
                DINC({
                    type: 'SIGNUP',
                    payload: res.user
                })
                authDispatch({
                    type: 'LOGIN',
                    payload: res.user
                })
            })
            .catch(err => {
                console.log(err.code)
                let errmsg = ""
                if(err.code === 'auth/email-already-in-use'){
                    errmsg= "This email is already associated with an account. Please login to that account instead."
                }else if(err.code === 'auth/weak-password'){
                    errmsg= "Password is too weak!"
                }else if(err.code === 'auth/invalid-email'){
                    errmsg= "Please provide a valid Email."
                }else{
                    errmsg= "Invalid Email or Password: "
                }

                DINC({
                    type: 'ERROR',
                    payload: errmsg
                })
                
                
            })
        } catch (err) {
            DINC({
                type: 'ERROR',
                payload: err.message
            })
        }
        
    }

    const _updateProfile = async (displayName, photoURL) =>{
        dispatch({
            type: 'IS_PENDING'
        })

        updateProfile(auth.currentUser, {displayName, photoURL})
        .then(() => {
            console.log('updated profile');
            DINC({
                type: 'UPDATE'
            })
        })
        .catch(() => {
            DINC({
                type: 'ERROR',
                payload: "Unable to Update Profile"
            })
        })
    }

    // use _reauthenticateWithCredential before doing
    const _updateEmail = async (email) =>{
        dispatch({
            type: 'IS_PENDING'
        })

        updateEmail(auth.currentUser, email)
        .then(() => {
            console.log('updated email');
            DINC({
                type: 'UPDATE'
            })
        })
        .catch(() => {
            DINC({
                type: 'ERROR',
                payload: "Unable to Update Email"
            })
        })
    }

    const _sendEmailVerification = async () =>{
        dispatch({
            type: 'IS_PENDING'
        })

        sendEmailVerification(auth.currentUser)
        .then(() => {
            console.log('verification email sent');
            DINC({
                type: 'UPDATE'
            })
        })
        .catch(() => {
            DINC({
                type: 'ERROR',
                payload: "Unable to Update Email"
            })
        })
    }

    // use _reauthenticateWithCredential before doing
    const _updatePassword = async (password) =>{
        dispatch({
            type: 'IS_PENDING'
        })

        updatePassword(auth.currentUser, password)
        .then(() => {
            console.log('updated password');
            DINC({
                type: 'UPDATE'
            })
        })
        .catch(() => {
            DINC({
                type: 'ERROR',
                payload: "Unable to Update Password"
            })
        })
    }
    
    const _sendPasswordResetEmail = async (email) =>{
        dispatch({
            type: 'IS_PENDING'
        })

        sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log('password-reset email sent!');
            DINC({
                type: 'UPDATE'
            })
        })
        .catch(() => {
            DINC({
                type: 'ERROR',
                payload: "Unable to Send Verification Email"
            })
        })
    }

    const _confirmPasswordReset = async (code, newpassword) =>{
        dispatch({
            type: 'IS_PENDING'
        })

        confirmPasswordReset(auth, code, newpassword)
        .then(() => {
            console.log('code confirmed and password changed!');
            DINC({
                type: 'UPDATE'
            })
        })
        .catch(() => {
            DINC({
                type: 'ERROR',
                payload: "Code is Invalid"
            })
        })
    }

    // use _reauthenticateWithCredential before doing
    const _deleteUser = async () =>{
        dispatch({
            type: 'IS_PENDING'
        })

        deleteUser(auth.currentUser)
        .then(() => {
            console.log('user Deleted');
            DINC({
                type: 'UPDATE'
            })
        })
        .catch(() => {
            DINC({
                type: 'ERROR',
                payload: "An Error Occured while deleting the User"
            })
        })
    }

    // login and get credentials
    const loginGetCredentials = async (password) =>{
        return EmailAuthProvider.credential(auth.currentUser.email, password)
    }

    const _reauthenticateWithCredential = async (password, callback) =>{
        dispatch({
            type: 'IS_PENDING'
        })

        loginGetCredentials(password)
        .then(cred => {
            // return new Promise((res, rej)=>{
                reauthenticateWithCredential(auth.currentUser, cred)
                .then(cred => {
                    console.log('user reauthenticated', cred);
                    DINC({
                        type: 'UPDATE'
                    })
                    // res(cred)
                    callback(cred)
                })
                .catch(() => {
                    DINC({
                        type: 'ERROR',
                        payload: "Invalid Credentials"
                    })
                    callback(null)
                    // rej("Invalid Credentials: ", err)
                })
            // });
        })
        .catch(() => {
            DINC({
                type: 'ERROR',
                payload: "Invalid Credentials"
            })
        })

        // authCredential needs to be tested
        

        
    }

    const socialLogin = async (providerid) => {
        dispatch({
            type: 'IS_PENDING'
        })
        const provider = getProviderForProviderId(providerid)
        try{
            const result = await signInWithPopup(auth, provider)
            console.log(result);
            if(!response){
                throw new Error('loginerror')
            }
            dispatch({
                type: 'LOGIN',
                payload: result.user
            })
        }catch (error) {
            dispatch({
                type: 'ERROR',
                payload: "An Error has Occured..."
            })
        }
  
    }

    
    const _signInAnonymously = async () =>{
        dispatch({
            type: 'IS_PENDING'
        })

        // authCredential needs to be tested
        signInAnonymously(auth)
        .then((result) => {
            DINC({
                type: 'LOGIN',
                payload: result.user
            })
            authDispatch({
                type: 'LOGIN',
                payload: result.user
            })
        }).catch((err) => {
            DINC({
                type: 'ERROR',
                payload: err.message
            })
        });

        
    }
    

    useEffect(() => {

        return () => setIsCancelled(true)
    }, [])

    // useEffect(() => {
    //     if(response.error){
    //         setTimeout(() => {
    //             DINC({
    //                 type: 'RESET'
    //             })
    //         }, 2000);
    //     }

    // }, [response.error])

    return {socialLogin, login, loginGetCredentials, logout, signup, _updateProfile, _updateEmail, _sendEmailVerification, 
        _updatePassword, _sendPasswordResetEmail, _confirmPasswordReset, _reauthenticateWithCredential,
        _deleteUser, _signInAnonymously, response}

}