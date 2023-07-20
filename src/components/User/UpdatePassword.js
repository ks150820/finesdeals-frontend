import React, { Fragment, useEffect, useState } from "react";
import "./updatePassword.css";
import { IoLockClosed, IoLockOpenOutline, IoKey } from "react-icons/io5";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  callUpdatePasswordApi,
  getAuthLoadingState,
  getErrorDetails,
  getIsUpdated,
  resetProfileUpdated,
} from "../../store/auth";
import Alert from "../pop-up";
import MetaData from "../layouts/MetaData";
import ActiveLoader from "../loader";

const UpdatePassword = () => {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const error = useSelector(getErrorDetails);
  const isLoading = useSelector(getAuthLoadingState);
  const isUpdated = useSelector(getIsUpdated);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(callUpdatePasswordApi(myForm));
  };

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      setOpen(true);
      //   dispatch(clearErrors());
    }
    if (isUpdated) {
      // alert("Profile updated successfully");
      navigate("/account");
      dispatch(resetProfileUpdated());
    }
  }, [error, navigate, dispatch, isUpdated]);
  return (
    <div>
      <MetaData title="Change Password" />
      {isLoading ? (
        <div className="loader">
          <ActiveLoader />
        </div>
      ) : (
        <Fragment>
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Change Password</h2>
              <form
                className="updatePasswordForm"
                encType="multipart/form-data"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <IoKey className="authIcon" />
                  <input
                  type="password"
                    placeholder="Old password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <IoLockOpenOutline className="authIcon" />
                  <input
                    type="password"
                    placeholder="New password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                  value="Change"
                  className="updatePasswordBtn"
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

export default UpdatePassword;
