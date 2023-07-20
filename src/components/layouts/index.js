import React from "react";
import Footer from "./Footer/footer";
import Header from "./Header/header";
import UserOptions from "./Header/UserOptions";

const Layout = ({ children }) => {
  return (
    <div>
    <UserOptions />
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
