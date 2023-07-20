import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  geOrderDetails,
  callMyOrderDetailApi,
  getLoadingState,
  clearErrors,
} from "../../store/entities/orders";
import ActiveLoader from "../loader";
import { Typography } from "@mui/material";
import MetaData from "../layouts/MetaData";
import { Link, useParams } from "react-router-dom";
import Alert from "../pop-up";
import LaunchIcon from "@mui/icons-material/Launch";
import { getUserDetails } from "../../store/auth";
import "./orderDetails.css";

const OrderDetails = () => {
  const orderDetails = useSelector(geOrderDetails);
  const isLoading = useSelector(getLoadingState);

  const dispatch = useDispatch();

  const { id = "" } = useParams();
  console.log("id ==>>", id);

  useEffect(() => {
    dispatch(callMyOrderDetailApi(id));
  }, []);
  return (
    <Fragment>
      <MetaData title="Order details" />
      {isLoading ? (
        <div className="loader">
          <ActiveLoader />
        </div>
      ) : (
        <div className="orderDetailsPage">
          <div className="ordersDetailContainer">
            <h1>Order #{orderDetails && orderDetails._id}</h1>
            <Typography>Shipping Info</Typography>
            <div className="orderDetailsContainerBox">
              <div>
                <p>Name: </p>
                <span>{orderDetails.user && orderDetails.user.name}</span>
              </div>
              <div>
                <p>Phone: </p>
                <span>
                  {orderDetails?.shippingInfo &&
                    orderDetails.shippingInfo?.phoneNo}
                </span>
              </div>

              <div>
                <p>Address: </p>
                <span>
                  {orderDetails?.shippingInfo &&
                    `${orderDetails.shippingInfo?.address}, ${orderDetails.shippingInfo?.city}, ${orderDetails.shippingInfo?.state}, ${orderDetails.shippingInfo?.pinCode}, ${orderDetails.shippingInfo?.country}`}
                </span>
              </div>
            </div>
            <Typography>Payment</Typography>
            <div className="orderDetailsContainerBox">
              <div>
                <p
                  className={
                    orderDetails?.paymentInfo &&
                    orderDetails.paymentInfo.status === "succeeded"
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  {orderDetails?.paymentInfo &&
                  orderDetails.paymentInfo.status === "succeeded"
                    ? "PAID"
                    : "NOT PAID"}
                </p>
              </div>
              <div>
                <p>Amount:</p>
                <span>
                  {orderDetails?.totalPrice && orderDetails?.totalPrice}
                </span>
              </div>
            </div>
            <Typography>Order Status</Typography>
            <div className="orderDetailsContainerBox">
              <div>
                <p
                  className={
                    orderDetails?.orderStatus &&
                    orderDetails.orderStatus === "Delivered"
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  {orderDetails?.orderStatus && orderDetails?.orderStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="orderDetailsCartItems">
            <Typography>Order Items:</Typography>
            <div className="orderDetailsCartItemsContainer">
              {orderDetails?.orderItems &&
                orderDetails?.orderItems?.map((item) => {
                  return (
                    <div key={item?.product}>
                      <img src={item?.image} alt="product" />
                      <Link to={`/product/${item?.product}`}>
                        {item?.name}&nbsp;
                      </Link>
                      <span>
                        {item?.quantity} X Rs.{item?.price} ={" "}
                        <b>Rs.{item?.price * item?.quantity}</b>
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default OrderDetails;
