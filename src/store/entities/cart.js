import { createSelector, createSlice } from "@reduxjs/toolkit";
import * as actions from "../actions/api";

export const slice = createSlice({
  name: "cart",
  initialState: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    error: {},
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
  reducers: {
    addToCartApiStart: () => {},
    addToCart: (cart, { payload }) => {
      const data = payload?.data;
      const { quantity } = payload?.reducerData;
      const item = {
        product: data?.product?._id,
        name: data?.product?.name,
        price: data?.product?.price,
        image: data?.product?.images[0]?.url,
        stock: data?.product?.Stock,
        quantity,
      };
      //   const item = payload;

      const isItemExist = cart.cartItems.find(
        (i) => i?.product === item?.product
      );

      if (isItemExist) {
        cart.cartItems = cart.cartItems.map((i) =>
          i.product === isItemExist?.product ? item : i
        );
      } else {
        cart.cartItems = [...cart.cartItems, item];
      }

      console.log("cart.cartItems =>>", cart.cartItems);

      localStorage.setItem("cartItems", JSON.stringify(cart.cartItems));
    },
    addToCartApiFailed: (cart, { payload }) => {
      cart.error = payload?.data;
    },
    removeItemsFromCart: (cart, { payload }) => {
      cart.cartItems = cart.cartItems.filter(
        (item) => item?.product !== payload
      );

      localStorage.setItem("cartItems", JSON.stringify(cart.cartItems));
    },
    addShippingInfo: (cart, { payload }) => {
      cart.shippingInfo = payload;
      localStorage.setItem("shippingInfo", JSON.stringify(payload));
    },
  },
});

export const {
  addToCartApiStart,
  addToCart,
  addToCartApiFailed,
  removeItemsFromCart,
  addShippingInfo,
} = slice.actions;
export default slice.reducer;

export const addItemsToCart = (id, quantity) => (dispatch) => {
  return dispatch(
    actions.apiCallBegan({
      url: `/product/${id}`,
      onStart: addToCartApiStart.type,
      onSuccess: addToCart.type,
      reducerData: { quantity },
      onError: addToCartApiFailed.type,
      method: "GET",
    })
  );
};

export const removeFromCart = (id) => (dispatch) => {
  return dispatch({ type: removeItemsFromCart.type, payload: id });
};

export const updateShippingInfo = (info) => (dispatch) => {
  return dispatch({ type: addShippingInfo.type, payload: info });
};

export const getAllCartItems = createSelector(
  (state) => state.entities.cart,
  (items) => items.cartItems
);

export const getShippingInfo = createSelector(
  (state) => state.entities.cart,
  (items) => items.shippingInfo
);

export const getCartError = createSelector(
  (state) => state.entities.cart,
  (items) => items.error
);
