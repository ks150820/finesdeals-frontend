import React, { Fragment, useEffect, useState } from "react";
import MetaData from '../layouts/MetaData'
import ActiveLoader from '../loader';
import { IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../pop-up";
import {
    callForgotPasswordApi,
    getAuthLoadingState,
    getErrorDetails,
    getForgotPasswordSuccessMessage,
  } from "../../store/auth";
import "./forgotPassword.css";

const ForgotPassword = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState()

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const isLoading = useSelector(getAuthLoadingState);
    const error = useSelector(getErrorDetails);
    const message = useSelector(getForgotPasswordSuccessMessage);

    const dispatch = useDispatch();

    const submitForgotPassword = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("email", email);

        dispatch(callForgotPasswordApi(myForm));
    };

    useEffect(() => {
        if (Object.keys(error).length > 0) {
          setOpen(true);
          //   dispatch(clearErrors());
        }

        console.log('message ==>', message);

        if(message) {
            alert(message);
        }
      }, [error, message]);
  return (
    <div>
      <MetaData title="Forgot Password" />
      {isLoading ? (
        <div className="loader">
          <ActiveLoader />
        </div>
      ) : (
        <Fragment>
          <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Forgot Password</h2>
              <form
                className="forgotPasswordForm"
                onSubmit={submitForgotPassword}
              >
              <div className="forgotPasswordEmail">
                  <IoMailOutline className="authIcon" />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Change"
                  className="forgotPasswordBtn"
                  //   disabled={loading ? true : false}
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
      <Alert
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        message={error?.message}
      />
    </div>
  )
}

export default ForgotPassword