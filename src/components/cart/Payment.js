import React, { Fragment, useEffect, useRef, useState } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layouts/MetaData";
import { Typography } from "@mui/material";
import Alert from "../pop-up";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
  Elements,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import "./payment.css";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {
  getShippingInfo,
  getAllCartItems,
  getCartError,
} from "../../store/entities/cart";
import { getUserDetails } from "../../store/auth";
import httpService from "../../services/httpSerivces";
import { useNavigate } from "react-router-dom";
import { callOrdersApi, clearError, getError } from "../../store/entities/orders";

const Payment = () => {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState({});
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const shippingInfo = useSelector(getShippingInfo);
  const cartItems = useSelector(getAllCartItems);
  const user = useSelector(getUserDetails);
  const cartError = useSelector(getCartError);
  const orderError = useSelector(getError);

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo?.subtotal,
    taxPrice: orderInfo?.tax,
    shippingPrice: orderInfo?.shippingCharges,
    totalPrice: orderInfo?.totalPrice
  }

  const paymentData = {
    amount: Math.round(orderInfo?.totalPrice * 100),
  }

  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const payBtn = useRef(null);

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (Object.keys(orderError).length > 0) {
      setOpen(true);
      setError(error);
      dispatch(clearError())
    }
  }, [dispatch, error, orderError]);

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                
            },
            withCredentials: true,
        }

        const {data} = await httpService.post("http://localhost:4000/api/v1/payment/process", paymentData, config);

        const client_secret = data?.client_secret;

        if(!stripe || !elements){ return;}

        const result = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: {
                    name: user?.name,
                    email: user?.email,
                    address: {
                        line1: shippingInfo?.address,
                        city: shippingInfo?.city,
                        state: shippingInfo?.state,
                        postal_code: shippingInfo?.pinCode,
                        country: shippingInfo?.country,
                    }
                }
            }
        })

        if(result?.error){
            payBtn.current.disabled = false;
            setError({message: result?.error?.message});
        }else{
            if(result.paymentIntent.status === "succeeded"){
                order.paymentInfo = {
                    id: result?.paymentIntent?.id,
                    status: result?.paymentIntent?.status,
                }

                dispatch(callOrdersApi(order));
                navigate("/success");
            }else{
                setOpen(true);
                setError({message: "There's some issue While processing payment."})
            }
        }
        
    } catch (error) {
        setOpen(true);
        payBtn.current.disabled = false;
        const option = {message: error?.response?.data?.message};
        setError(option);
    }
  };
  return (
    <Fragment>
      <MetaData title="Payment" />
      <div style={{ marginTop: 20, marginBottom: 10 }}>
        <CheckoutSteps activeStep={2} />
      </div>

      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={submitHandler}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />

            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>
          <input
            type="submit"
            value={`Pay - Rs. ${orderInfo && orderInfo?.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
      <Alert
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        message={error.message}
      />
    </Fragment>
  );
};

export default Payment;
