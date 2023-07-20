import React, { Fragment } from "react";
import "./cart.css";
import { useDispatch, useSelector } from "react-redux";
import CartItemCard from "./CartItemCard";
import {
  addItemsToCart,
  getAllCartItems,
  removeFromCart,
} from "../../store/entities/cart";
import { Link, useNavigate } from "react-router-dom";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import MetaData from "../layouts/MetaData";

const Cart = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const items = useSelector(getAllCartItems);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;

    if (stock <= quantity) {
      return;
    }

    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;

    if (1 >= quantity) {
      return;
    }

    dispatch(addItemsToCart(id, newQty));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOutHandler = () => {
    navigate("/login?redirect=shipping")
  }

  return (
    <Fragment>
    <MetaData title="Cart" />
      {items?.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon className="emptyCartIcon" />
          <p>No product in your cart.</p>
          <Link to="/products">View products</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>SubTotal</p>
            </div>
            <div>
              {items?.length !== 0 &&
                items?.map((item) => {
                  return (
                    <div key={item?.product} className="cartContainer">
                      <CartItemCard
                        item={item}
                        deleteCartItem={handleRemoveFromCart}
                      />
                      <div className="cartInput">
                        <button
                          onClick={() =>
                            decreaseQuantity(item?.product, item?.quantity)
                          }
                        >
                          -
                        </button>
                        <input type="number" value={item?.quantity} readOnly />
                        <button
                          onClick={() =>
                            increaseQuantity(
                              item?.product,
                              item?.quantity,
                              item?.stock
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="cartSubTotal">{`Rs.${
                        item?.price * item?.quantity
                      }`}</p>
                    </div>
                  );
                })}
              <div className="cartGrossTotal">
                <div></div>
                <div className="cartGrossTotalBox">
                  <p>Gross Total</p>
                  <p>
                    Rs.
                    {items?.reduce(
                      (acc, current) =>
                        acc + current?.quantity * current?.price,
                      0
                    )}
                  </p>
                </div>
                <div></div>
                <div className="checkOutBtn">
                  <button onClick={checkOutHandler}>Check Out</button>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
