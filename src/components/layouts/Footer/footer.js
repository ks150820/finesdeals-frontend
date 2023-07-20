import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>Download Our App</h4>
        <p>Download our app from IOS and ANDROID mobile Phone</p>
        <img
          src="https://e7.pngegg.com/pngimages/733/638/png-clipart-google-play-text-google-play-android-app-store-google-play-text-logo.png"
          alt="playstore-icon"
        />
      </div>
      <div className="midFooter">
        <h1>FinestDeals.</h1>
        <p>high Quality is our first priority</p>

        <p>Copyrights 2021 &copy; FinestDeals </p>
      </div>
      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="/">Instagram</a>
        <a href="/">Youtube</a>
        <a href="/">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
