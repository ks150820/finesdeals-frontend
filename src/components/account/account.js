import React, { Fragment, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import { useSelector } from "react-redux";
import { getUserDetails, getUserIsAuthenticated } from "../../store/auth";
import { Link, useNavigate } from "react-router-dom";
import "./account.css";

const Account = () => {
  const user = useSelector(getUserDetails);
  const isAuthenticated = useSelector(getUserIsAuthenticated);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  return (
    <Fragment>
      <MetaData title={`${user?.name}'s Profile`} />
      <div className="profileContainer">
        <div>
          <h1>My Profile</h1>
          <img
            src={
              user?.avatar?.url
                ? user?.avatar?.url
                : "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.pn"
            }
            alt={user?.name}
          />
          <Link to="/me/update">Edit profile</Link>
        </div>
        <div>
          <div>
            <h4>Full Name</h4>
            <p>{user?.name}</p>
          </div>
          <div>
            <h4>Email</h4>
            <p>{user?.email}</p>
          </div>
          <div>
            <h4>Joined On</h4>
            <p>{String(user?.createdAt).substring(0, 10)}</p>
          </div>
          <div>
            <Link to="/orders">My Orders</Link>
            <Link to="/password/update">Change Password</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Account;
