import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";

import AppLayout from "./AppLayout";
import ProductDetails from "./components/product/product-details";
import Products from "./components/products/Products";
import Search from "./components/products/search";
import LoginSignUp from "./components/User/LoginSignUp";
import Account from "./components/account/account";
import { loadUser } from "./store/auth";
import Home from "./components/Home/home";
import { useEffect, useState } from "react";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import httpService from "./services/httpSerivces";
import Payment from "./components/cart/Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderSuccess from "./components/cart/OrderSuccess";
import MyOrders from "./components/orders/MyOrders";
import OrderDetails from "./components/orders/OrderDetails";
import Dashboard from "./components/admin/Dashboard";
import PrivateRoute from "./privateRoute";
import ProductList from "./components/admin/ProductList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrdersList from "./components/admin/OrderList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";
import Contact from "./components/User/contact";
import NotFound from "./components/NotFound";

const AppRouter = () => {
  const dispatch = useDispatch();

  const [stripeApiKey, setStripeApikey] = useState("");

  const getStripeApiKey = async () => {
    try {
      const response = await httpService.request(
        "http://localhost:4000/api/v1/stripeapikey",
        { withCredentials: true }
      );
      setStripeApikey(response?.data?.stripeApiKey);
    } catch (error) {
      console.log("stripe error ==>", error);
    }
  };

  useEffect(() => {
    getStripeApiKey();
    dispatch(loadUser());
  }, []);

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/product/:id",
          element: <ProductDetails />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/products/:keyword",
          element: <Products />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/login",
          element: <LoginSignUp />,
        },
        {
          path: "/account",
          element: <Account />,
        },
        {
          path: "/me/update",
          element: <UpdateProfile />,
        },
        {
          path: "/password/update",
          element: <UpdatePassword />,
        },
        {
          path: "/password/forgot",
          element: <ForgotPassword />,
        },
        {
          path: "/password/reset/:token",
          element: <ResetPassword />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/shipping",
          element: <Shipping />,
        },
        {
          path: "/order/confirm",
          element: <ConfirmOrder />,
        },
        {
          path: "/success",
          element: <OrderSuccess />,
        },
        {
          path: "/orders",
          element: <MyOrders />,
        },
        {
          path: "/order/:id",
          element: <OrderDetails />,
        },
        {
          path: "/admin/dashboard",
          element: (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "/admin/products",
          element: (
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          ),
        },
        {
          path: "/admin/product/:id",
          element: (
            <PrivateRoute>
              <UpdateProduct />
            </PrivateRoute>
          ),
        },
        {
          path: "/admin/user/:id",
          element: (
            <PrivateRoute>
              <UpdateUser />
            </PrivateRoute>
          ),
        },
        {
          path: "/admin/order/:id",
          element: (
            <PrivateRoute>
              <ProcessOrder />
            </PrivateRoute>
          ),
        },
        {
          path: "/admin/orders",
          element: (
            <PrivateRoute>
              <OrdersList />
            </PrivateRoute>
          ),
        },
        {
          path: "/admin/product",
          element: (
            <PrivateRoute>
              <NewProduct />
            </PrivateRoute>
          ),
        },
        {
          path: "/admin/users",
          element: (
            <PrivateRoute>
              <UsersList />
            </PrivateRoute>
          ),
        },
        {
          path: "/admin/reviews",
          element: (
            <PrivateRoute>
              <ProductReviews />
            </PrivateRoute>
          ),
        },
        {
          path: "/process/payment",
          element: stripeApiKey ? (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Payment />
            </Elements>
          ) : (
            <></>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={appRouter} />;
};

export default AppRouter;
