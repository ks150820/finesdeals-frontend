import React, { Fragment } from "react";
import CheckoutSteps from "./CheckoutSteps";
import "./confirmOrder.css";
import Alert from "../pop-up";
import { useNavigate, Link } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { getShippingInfo, getAllCartItems } from "../../store/entities/cart";
import { getUserDetails } from "../../store/auth";

const ConfirmOrder = () => {
  const shippingInfo = useSelector(getShippingInfo);
  const cartItems = useSelector(getAllCartItems);

  const user = useSelector(getUserDetails);

  const navigate = useNavigate();

  const subtotal = cartItems?.reduce(
    (acc, current) => acc + current?.quantity * current?.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + shippingCharges + tax;

  const address = `${shippingInfo?.address}, ${shippingInfo?.city}, ${shippingInfo?.state}, ${shippingInfo?.pinCode}, ${shippingInfo?.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    navigate("/process/payment");
  };

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <div style={{ marginTop: 30, marginBottom: 20 }}>
        <CheckoutSteps activeStep={1} />
      </div>

      <div className="confirmOrderPage">
        <div>
          <div className="confirmShippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmShippingAreaBox">
              <div>
                <p>Name: </p>
                <span>{user?.name}</span>
              </div>
              <div>
                <p>Phone: </p>
                <span>{shippingInfo?.phoneNo}</span>
              </div>
              <div>
                <p>Address: </p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Confirm Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems?.map((item) => {
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
        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>Rs.{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>Rs.{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>Rs.{tax}</span>
              </div>
            </div>
            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>Rs.{totalPrice}</span>
            </div>
            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
