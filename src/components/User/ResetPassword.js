import React, { Fragment, useEffect, useState } from "react";
import "./resetPassword.css";
import { IoLockClosed, IoLockOpenOutline } from "react-icons/io5";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  callResetPasswordApi,
  getAuthLoadingState,
  getErrorDetails,
  getResetSuccess,
} from "../../store/auth";
import Alert from "../pop-up";
import MetaData from "../layouts/MetaData";
import ActiveLoader from "../loader";

const ResetPassword = () => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const error = useSelector(getErrorDetails);
  const isLoading = useSelector(getAuthLoadingState);
  const success = useSelector(getResetSuccess);

  const { token = "" } = useParams();
  console.log('token ==>>', token);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(callResetPasswordApi(myForm, token));
  };

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      setOpen(true);
      //   dispatch(clearErrors());
    }

    if(success){
        alert("password reset successfully.");
        navigate("/login");
    }
  }, [error, navigate, dispatch, success]);
  return (
    <div>
      <MetaData title="Change Password" />
      {isLoading ? (
        <div className="loader">
          <ActiveLoader />
        </div>
      ) : (
        <Fragment>
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Reset Password</h2>
              <form
                className="resetPasswordForm"
                encType="multipart/form-data"
                onSubmit={resetPasswordSubmit}
              >
                <div className="loginPassword">
                  <IoLockOpenOutline className="authIcon" />
                  <input
                    type="password"
                    placeholder="New password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <IoLockClosed className="authIcon" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="resetPasswordBtn"
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
  );
};

export default ResetPassword;
