import React, { Fragment, useState } from "react";
import "./shipping.css";
import { useDispatch, useSelector } from "react-redux";
import { getShippingInfo, updateShippingInfo } from "../../store/entities/cart";
import MetaData from "../layouts/MetaData";
import PinDropIcon from "@mui/icons-material/PinDrop";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import PhoneIcon from "@mui/icons-material/Phone";
import TransferWithInAStateIcon from "@mui/icons-material/TransferWithinAStation";
import { Country, State } from "country-state-city";
import CheckoutSteps from "./CheckoutSteps";
import Alert from "../pop-up";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const shippingInfo = useSelector(getShippingInfo);

  const [address, setAddress] = useState(shippingInfo?.address || "");
  const [city, setCity] = useState(shippingInfo?.city || "");
  const [state, setState] = useState(shippingInfo?.state || "");
  const [country, setCountry] = useState(shippingInfo?.country || "");
  const [pinCode, setPinCode] = useState(shippingInfo?.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo);

  const [open, setOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrorMessage("");
    setOpen(false);
  };

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 10 || phoneNo?.length > 10) {
      setErrorMessage("Phone number should be 10 digit");
      handleOpen();
      return;
    }

    dispatch(updateShippingInfo({address, city, state, country, pinCode, phoneNo}));

    navigate("/order/confirm");
  };

  return (
    <Fragment>
      <MetaData title="Shipping Details" />
      <div style={{marginTop: 30, marginBottom: 20}}>
      <CheckoutSteps activeStep={0} />
      </div>
      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div>
              <HomeIcon />
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <LocationCityIcon />
              <input
                type="text"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <PinDropIcon />
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
            <div>
              <PhoneIcon />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size={10}
              />
            </div>

            <div>
              <PublicIcon />
              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country &&
                  Country?.getAllCountries()?.map((item) => {
                    return (
                      <option key={item?.isoCode} value={item?.isoCode}>
                        {item?.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            {country && (
              <div>
                <TransferWithInAStateIcon />
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country)?.map((item) => {
                      return (
                        <option key={item?.isoCode} value={item?.isoCode}>
                          {item?.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
      <Alert
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        message={errorMessage}
      />
    </Fragment>
  );
};

export default Shipping;
