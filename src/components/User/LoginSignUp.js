import React, { Fragment, useEffect, useRef, useState } from "react";
import "./LoginSignUp.css";
import ActiveLoader from "../loader";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import { callLoginApi, callRegisterApi, getAuthLoadingState, getErrorDetails, getUserIsAuthenticated, resetErrors } from "../../store/auth";
import Alert from "../pop-up";

const LoginSignUp = () => {
  const [open, setOpen] = React.useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState('/Profile.png')
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const {name, email, password} = user;

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const error = useSelector(getErrorDetails);
  const isLoading = useSelector(getAuthLoadingState);
  const isAuthenticated = useSelector(getUserIsAuthenticated);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [searchParams] = useSearchParams();

  const redirect =searchParams?.get("redirect") ? "/" +searchParams?.get("redirect") : "/account";

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      setOpen(true);
    //   dispatch(resetErrors())
      return;
    }
  }, [error, dispatch]);

  useEffect(() => {
    if(isAuthenticated){
      navigate(redirect)
    }
  }, [isAuthenticated, navigate, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }

    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name",  name);
    myForm.set("email",  email);
    myForm.set("password",  password);
    myForm.set("avatar",  avatar);

    console.log("Sign up Form Submit");
    dispatch(callRegisterApi(myForm));
  }

  const loginSubmit = (e) => {
    e.preventDefault();
    console.log("Login Form Submit");
    dispatch(callLoginApi(loginEmail, loginPassword));
  };

  const registerDataChange = (e) => {
    if(e.target.name === "avatar"){
        const reader = new FileReader();

        reader.onload = () => {
            if(reader.readyState === 2){
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        }
        
        reader.readAsDataURL(e.target.files[0]);
    }else{
        setUser({...user, [e.target.name]: e.target.value});
    }
  }

  if (isLoading) {
    return (
      <div className="loader">
        <ActiveLoader />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="LoginSignUpContainer">
        <div className="LoginSignUpBox">
          <div>
            <div className="login_signUp_toggle">
              <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
              <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
            </div>
            <button ref={switcherTab}></button>
          </div>
          <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
            <div className="loginEmail">
              <IoMailOutline className="authIcon" />
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="loginPassword">
              <IoLockClosedOutline className="authIcon" />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Link to="/password/forgot">Forget Password ?</Link>
            <input type="submit" value="Login" className="loginBtn" />
          </form>
          <form
            ref={registerTab}
            className="signUpForm"
            encType="multipart/form-data"
            onSubmit={registerSubmit}
          >
            <div className="signUpName">
              <IoPersonOutline className="authIcon" />
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={registerDataChange}
              />
            </div>
            <div className="signUpEmail">
              <IoMailOutline className="authIcon" />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                name="email"
                onChange={registerDataChange}
              />
            </div>
            <div className="signUpPassword">
              <IoLockClosedOutline className="authIcon" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                name="password"
                onChange={registerDataChange}
              />
            </div>

            <div id="registerImage">
              <img src={avatarPreview} alt="Avatar Preview" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={registerDataChange}
              />
            </div>
            <input
              type="submit"
              value="Register"
              className="signUpBtn"
            //   disabled={loading ? true : false}
            />
          </form>
        </div>
      </div>
      <Alert open={open} handleOpen={handleOpen}  handleClose={handleClose}
      message={error.message} />
    </Fragment>
  );
};

export default LoginSignUp;
