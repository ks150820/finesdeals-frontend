import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearErrors,
  getAllProducts,
  getLoadingState,
  getErrors,
  startCallingGetAllProductsApi,
} from "../../store/entities/product";
import ProductCard from "../Home/ProductCard";
import ActiveLoader from "../loader";
import Alert from "../pop-up";
import "./products.css";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import MetaData from "../layouts/MetaData";

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones"
]

const Products = () => {
  const [open, setOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [price, setPrice] = React.useState([0, 25000]);
  const [category, setCategory] = useState('');
  const [ratings, setRatings] = useState(0);

  const isLoading = useSelector(getLoadingState);
  const products = useSelector(getAllProducts);
  const error = useSelector(getErrors);

  const { keyword } = useParams();

  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const handlePrice = (event, newPrice) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      setOpen(true);
      dispatch(clearErrors());
    }
    dispatch(startCallingGetAllProductsApi(keyword, currentPage, price, category, ratings));
  }, [keyword, error, dispatch, currentPage, price, category, ratings]);
  return (
    <Fragment>
      {isLoading ? (
        <div className="loader">
          <ActiveLoader />
        </div>
      ) : (
        <Fragment>
        <MetaData title="PRODUCTS - FINESTDEALS" />
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products.products?.map((item, index) => {
              return <ProductCard product={item} key={index} />;
            })}
          </div>
          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={price}
              onChange={handlePrice}
              valueLabelDisplay="auto"
              getAriaValueText={() => ""}
              min={0}
              max={25000}
            />
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category, index) => {
                return (
                  <li
                    className="category-link"
                    key={index}
                    onClick={() => setCategory(category)}
                  >
                    {category}
                  </li>
                );
              })}
            </ul>

            <fieldset>
            <Typography component="legend">Ratings Above</Typography>
            <Slider
              value={ratings }
              onChange={(e, newRating) => {
                setRatings(newRating)
              }}
              size="small"
              aria-label="Small"
              valueLabelDisplay="auto"
              min={0}
              max={5}
            />
            </fieldset>
          </div>

          {products?.resultPerPage < products?.productsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={products?.resultPerPage}
                totalItemsCount={products.productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}

      <Alert
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        message={error.message}
      />
    </Fragment>
  );
};

export default Products;
