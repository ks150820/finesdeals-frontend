import React, { Fragment, useEffect, useState } from "react";
import "./updateProfile.css";
// import ActiveLoader from "../loader";
import { IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  callUpdateProfileApi,
  clearErrors,
  getAuthLoadingState,
  getErrorDetails,
  getIsUpdated,
  getUserDetails,
  getUserIsAuthenticated,
  loadUser,
  resetProfileUpdated,
} from "../../store/auth";
import Alert from "../pop-up";
import MetaData from "../layouts/MetaData";
import ActiveLoader from "../loader";

const UpdateProfile = () => {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useSelector(getUserDetails);
  const error = useSelector(getErrorDetails);
  const isLoading = useSelector(getAuthLoadingState);
  const isUpdated = useSelector(getIsUpdated);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateProfileSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);

    dispatch(callUpdateProfileApi(myForm));
  };

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      setOpen(true);
      //   dispatch(clearErrors());
    }
    if (user) {
      setName(user?.name);
      setEmail(user?.email);
      setAvatarPreview(user?.avatar?.url);
    }
    if (isUpdated) {
      // alert("Profile updated successfully");
      navigate("/account");
      dispatch(resetProfileUpdated());
      dispatch(loadUser());
    }
  }, [user, error, navigate, dispatch, isUpdated]);

  return (
    <div>
      <MetaData title="Update profile" />
      {isLoading ? (
        <div className="loader">
          <ActiveLoader />
        </div>
      ) : (
        <Fragment>
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>
              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <IoPersonOutline className="authIcon" />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
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

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
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

export default UpdateProfile;
