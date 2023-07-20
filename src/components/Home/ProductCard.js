import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const options = {
  edit: false,
  color: "rgba(0,0,0,0.1)",
  activeColor: "tomato",
  isHalf: true,
  size: window.innerWidth < 600 ? 20 : 25,
};

const ProductCard = ({ product }) => {
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} value={product.rating} /> <span> ({product.ratings}) </span>
      </div>
      <span>₹{product.price}</span>
    </Link>
  );
};

export default ProductCard;
