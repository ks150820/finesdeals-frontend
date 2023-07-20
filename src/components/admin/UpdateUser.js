import React, { useEffect, Fragment, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import PersonIcon from '@mui/icons-material/Person'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import Sidebar from "./Sidebar";
import Alert from "../pop-up";
import MetaData from "../layouts/MetaData";
import { callToGetSingleAdminUserDetails, callToUpdateAdminUsers, getAdminUpdateUserStatus, getSingleAdminUserDetail, resetAdminUpdateStatus } from "../../store/auth";


const UpdateUser = () => {
  const [userSuccessfullyAlertOpen, setUserSuccessfullyAlertOpen] =
    useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [role, setRole] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {id = ''} = useParams();

  const success = useSelector(getAdminUpdateUserStatus);
  const user = useSelector(getSingleAdminUserDetail);

  const handleOpen = () => setUserSuccessfullyAlertOpen(true);
  const handleClose = () => {
    setUserSuccessfullyAlertOpen(false);
    dispatch(resetAdminUpdateStatus());
    navigate("/admin/users");
  };

  useEffect(() => {
    if (user && user?._id !== id) {
      dispatch(callToGetSingleAdminUserDetails(id));
    }else{
        setName(user?.name);
        setRole(user?.role);
        setEmail(user?.email);
    }
    if (success) {
      setUserSuccessfullyAlertOpen(true);
    }
  }, [success, dispatch, navigate, user, id, setUserSuccessfullyAlertOpen]);

  const updateUserSubmitHandler = (e) => {
    e?.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(callToUpdateAdminUsers(id ,myForm));
  };

  return (
    <Fragment>
      <MetaData title="Update User - Admin" />

      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            onSubmit={updateUserSubmitHandler}
          >
            <h1>Update User</h1>
            <div>
              <PersonIcon />
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <VerifiedUserIcon />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Choose role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={role === "" ? true : false}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
      <Alert
        open={userSuccessfullyAlertOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        message="User updated successfully."
      />
    </Fragment>
  );
};

export default UpdateUser;