import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  callLogoutApi,
  getUserDetails,
  getUserIsAuthenticated,
  userLogout,
} from "../../../store/auth";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ExitToApp from "@mui/icons-material/ExitToApp";
import Person from "@mui/icons-material/Person";
import { Backdrop } from "@mui/material";
import "./header.css";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getAllCartItems } from "../../../store/entities/cart";
import Badge from "@mui/material/Badge";

const UserOptions = () => {
  const [open, setOpen] = useState(false);
  const isAuthenticated = useSelector(getUserIsAuthenticated);
  const userDetail = useSelector(getUserDetails);
  const dispatch = useDispatch();
  const cartItems = useSelector(getAllCartItems);

  const navigate = useNavigate();

  const dashboard = () => {
    navigate("/admin/dashboard");
  };
  const orders = () => {
    navigate("/orders");
  };
  const account = () => {
    navigate("/account");
  };
  const logoutUser = () => {
    dispatch(callLogoutApi());
    alert("Logout Successfully");
  };

  const goToCartPage = () => {
    navigate("/cart");
  };

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <Person />, name: "Profile", func: account },
    { icon: <ExitToApp />, name: "Logout", func: logoutUser },
    {
      icon: (
        <Badge badgeContent={cartItems?.length} color="primary">
          <ShoppingCartIcon />
        </Badge>
      ),
      name: "Cart",
      func: goToCartPage,
    },
  ];

  if (userDetail?.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  if (!isAuthenticated) {
    return;
  }
  return (
    <Fragment>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        className="speedDial"
        direction="up"
        icon={
          <img
            className="speedDialIcon "
            src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
            alt="profile"
          />
        }
      >
        {options?.map((item, index) => {
          return (
            <SpeedDialAction
              key={index}
              icon={item.icon}
              tooltipTitle={item.name}
              onClick={item.func}
              tooltipOpen={window.innerWidth <= 600}
            />
          );
        })}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
