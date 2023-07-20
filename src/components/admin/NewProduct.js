import React, { useEffect, Fragment, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import {
  startCreateProductApi,
  resetCreatedNewProduct,
  getLoadingState,
  getNewCreatedProductDetails,
} from "../../store/entities/product";
import { useNavigate } from "react-router-dom";
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

const NewProduct = () => {
  const [productSuccesfullAlertOpen, setProductSuccesfullAlertOpen] =
    useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loading = useSelector(getLoadingState);
  const success = useSelector(getNewCreatedProductDetails)?.success;

  const handleOpen = () => setProductSuccesfullAlertOpen(true);
  const handleClose = () => {
    setProductSuccesfullAlertOpen(false);
    dispatch(resetCreatedNewProduct());
  };

  useEffect(() => {
    if (success) {
      setProductSuccesfullAlertOpen(true);
      navigate("/admin/dashboard");
    }
  }, [success, dispatch, navigate, setProductSuccesfullAlertOpen]);

  const createFormSubmitHandler = (e) => {
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

    dispatch(startCreateProductApi(myForm));
  };

  const createProductImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

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
            onSubmit={createFormSubmitHandler}
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
              <select onChange={(e) => setCategory(e.target.value)}>
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
                onChange={createProductImageChange}
              />
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
        open={productSuccesfullAlertOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        message="Product created successfully."
      />
    </Fragment>
  );
};

export default NewProduct;
