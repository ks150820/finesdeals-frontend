import React, { Fragment, useEffect, useState } from "react";
import "../cart/confirmOrder.css";
import Alert from "../pop-up";
import { useNavigate, Link, useParams } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import {
  geOrderDetails,
  callMyOrderDetailApi,
  callToUpdateAdminOrders,
  getOrderUpdatedStatus,
  resetOrderUpdatedStatus,
} from "../../store/entities/orders";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Button } from "@mui/material";
import "./processOrder.css";

const ProcessOrder = () => {
  const [status, setStatus] = useState("");
  const orderDetails = useSelector(geOrderDetails);
  const isOrderUpdated = useSelector(getOrderUpdatedStatus);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { id = "" } = useParams();

  const handleClose = () => {
    dispatch(resetOrderUpdatedStatus());
    navigate("/admin/orders");
  };

  useEffect(() => {
    dispatch(callMyOrderDetailApi(id));
  }, []);

  const updateOrderSubmitHandler = (e) => {
    e?.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);

    dispatch(callToUpdateAdminOrders(id, myForm));
  };

  return (
    <Fragment>
      <MetaData title="Process Order" />

      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          <div className="confirmOrderPage" style={{display: orderDetails?.orderStatus === "Delivered" ? "block" : "grid"}}>
            <div>
              <div className="confirmShippingArea">
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
                        (orderDetails.orderStatus === "Delivered" ||
                          orderDetails.orderStatus === "delivered")
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {orderDetails?.orderStatus && orderDetails?.orderStatus}
                    </p>
                  </div>
                </div>
              </div>
              <div className="confirmCartItems">
                <Typography>Confirm Cart Items:</Typography>
                <div className="confirmCartItemsContainer">
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
            {/* ---- */}
            <div style={{
              display: orderDetails?.orderStatus === "Delivered" ? "none" : "block"
            }}>
              <form
                className="updateOrderForm"
                onSubmit={updateOrderSubmitHandler}
              >
                <h1>Process Order</h1>

                <div>
                  <AccountTreeIcon />
                  <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Choose category</option>
                    {orderDetails?.orderStatus === "Processing" && (
                      <option value="Shipped">Shipped</option>
                    )}
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={status === "" ? true : false}
                >
                  Process
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Alert
        open={isOrderUpdated}
        handleClose={handleClose}
        message="Order updated successfully."
      />
    </Fragment>
  );
};

export default ProcessOrder;
