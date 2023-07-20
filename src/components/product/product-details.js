import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {
  clearErrors,
  getErrors,
  getLoadingState,
  getProductDetail,
  startCallingProductDetailApi,
} from "../../store/entities/product";
import ActiveLoader from "../loader";

import "./product-details.css";
import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard";
import Alert from "../pop-up";
import MetaData from "../layouts/MetaData";
import { addItemsToCart } from "../../store/entities/cart";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Rating,
} from "@mui/material";
import {
  addNewReview,
  getReviewErrors,
  getReviewSuccessStatus,
  resetReviewStatus,
} from "../../store/entities/reviews";

const ProductDetails = () => {
  const [open, setOpen] = React.useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const product = useSelector(getProductDetail);
  const isLoading = useSelector(getLoadingState);
  const error = useSelector(getErrors);
  const isReviewSuccess = useSelector(getReviewSuccessStatus);
  const reviewError = useSelector(getReviewErrors);
  const dispatch = useDispatch();

  const { id } = useParams();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    dispatch(clearErrors());
    dispatch(resetReviewStatus());
    setOpen(false);
  };

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true,
  };

  const increaseQuantity = () => {
    if (product?.Stock <= quantity) {
      return;
    }
    const quant = quantity + 1;
    setQuantity(quant);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      return;
    }
    const quant = quantity - 1;
    setQuantity(quant);
  };

  const addToCardHandler = () => {
    dispatch(addItemsToCart(id, quantity));
  };

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      setOpen(true);
    }
    dispatch(startCallingProductDetailApi(id));
  }, [dispatch, id, error]);

  useEffect(() => {
    if (isReviewSuccess) {
      alert("Review submitted successfully");
      dispatch(resetReviewStatus());
    }
  }, [isReviewSuccess]);

  const submitReviewToggle = () => {
    setOpenDialog(!openDialog);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(addNewReview(myForm));
    setComment("");
    setOpenDialog(false);
    setRating(0);
  };

  // const reviews = [...product.reviews, ...product.reviews];
  return (
    <Fragment>
      {isLoading ? (
        <div className="loader">
          <ActiveLoader />
        </div>
      ) : (
        <Fragment>
          <MetaData title={`${product?.name || ""}--FINESTDEALS`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="carouselImage"
                      key={item.url}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span>( {product.numOfReviews} Reviews)</span>
              </div>
              <div className="detailsBlock-3">
                <h1>₹{product.price}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input value={quantity} type="number" readOnly />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCardHandler}
                  >
                    Add to cart
                  </button>
                </div>
                <p>
                  Status:{" "}
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>
          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={openDialog}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <DialogActions>
                <Button onClick={submitReviewToggle} color="secondary">
                  Cancel
                </Button>
                <Button onClick={reviewSubmitHandler} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => <ReviewCard review={review} />)}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
      <Alert
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        message={reviewError?.message ? reviewError?.message : error.message}
      />
    </Fragment>
  );
};

export default ProductDetails;
