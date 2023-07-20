import React, { Fragment, useEffect } from "react";
import { MdOutlineMouse } from "react-icons/md";
import "./home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layouts/MetaData";
import { useSelector, useDispatch } from "react-redux";

import {
  getAllProducts,
  startCallingGetAllProductsApi,
  getLoadingState,
  getErrors,
} from "../../store/entities/product";
import ActiveLoader from "../loader";
import Alert from "../pop-up";

const Home = () => {
  const [open, setOpen] = React.useState(false);

  const allProducts = useSelector(getAllProducts);
  const isLoading = useSelector(getLoadingState);
  const error = useSelector(getErrors);

  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      setOpen(true);
      return;
    }
    dispatch(startCallingGetAllProductsApi());
  }, [error, dispatch]);

  if (isLoading) {
    return (
      <div className="loader">
        <ActiveLoader />
      </div>
    );
  }
  return (
    <Fragment>
      <MetaData title="Finestdeals" />
      <div className="banner">
        <p>Welcome to Finestdeals</p>
        <h1>FIND AMAZING PRODUCT BELOW</h1>
        <a href="#container">
          <button>
            Scroll <MdOutlineMouse />
          </button>
        </a>
      </div>
      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
        {allProducts.products?.map((item, index) => {
          return <ProductCard product={item} key={index} />;
        })}
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

export default Home;
