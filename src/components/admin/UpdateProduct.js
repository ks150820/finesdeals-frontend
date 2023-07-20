import React, { useEffect, Fragment, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import {
  editProduct,
  resetProductUpdateStatus,
  getLoadingState,
  startCallingProductDetailApi,
  getProductDetail,
  getUpdateProductStatus,
} from "../../store/entities/product";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";
import SpellCheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Sidebar from "./Sidebar";
import Alert from "../pop-up";
import MetaData from "../layouts/MetaData";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const UpdateProduct = () => {
  const [
    productSuccessfullyUpdateAlertOpen,
    setProductSuccessfullyUpdateAlertOpen,
  ] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {id : productId} = useParams();

  const loading = useSelector(getLoadingState);
  const success = useSelector(getUpdateProductStatus);
  const product = useSelector(getProductDetail);

  const handleOpen = () => setProductSuccessfullyUpdateAlertOpen(true);
  const handleClose = () => {
    setProductSuccessfullyUpdateAlertOpen(false);
    dispatch(resetProductUpdateStatus());
    navigate("/admin/products");
  };

  useEffect(() => {
    if (product && product?._id !== productId) {
      dispatch(startCallingProductDetailApi(productId));
    }else{
        setName(product?.name);
        setDescription(product?.description);
        setPrice(product?.price);
        setCategory(product?.category);
        setStock(product?.Stock);
        setOldImages(product?.images);
    }
    if (success) {
      setProductSuccessfullyUpdateAlertOpen(true);
      
    }
  }, [
    success,
    dispatch,
    navigate,
    setProductSuccessfullyUpdateAlertOpen,
    productId,
    product,
  ]);

  const updateProductSubmitHandler = (e) => {
    e?.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", stock);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(editProduct(productId, myForm));
  };

  const updateProductImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />

      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Create Product</h1>
            <div>
              <SpellCheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <DescriptionIcon />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols={30}
                rows={1}
              />
            </div>
            <div>
              <AccountTreeIcon />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose category</option>
                {categories?.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                multiple
                onChange={updateProductImageChange}
              />
            </div>
            <div id="createProductFormImage">
            {oldImages && oldImages?.map((image, index) => (
              <img key={index} src={image?.url} alt="Old Product Preview" />
            ))}
          </div>
            <div id="createProductFormImage">
              {imagesPreview?.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Create
            </Button>
          </form>
        </div>
      </div>
      <Alert
        open={productSuccessfullyUpdateAlertOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        message="Product updated successfully."
      />
    </Fragment>
  );
};

export default UpdateProduct;
