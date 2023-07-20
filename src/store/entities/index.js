import { combineReducers } from "redux";
import product from "./product";
import cart from "./cart";
import order from "./orders";
import reviews from "./reviews";

const entities = combineReducers({
  product,
  cart,
  order,
  reviews
});

export default entities;
