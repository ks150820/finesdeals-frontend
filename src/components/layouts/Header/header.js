import React from "react";
import { Navbar, Nav } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import Search from "@rsuite/icons/legacy/Search";
import CartPlus from "@rsuite/icons/legacy/CartPlus";
import AdminIcon from "@rsuite/icons/Admin";
import "./header.css";
import "rsuite/dist/rsuite.min.css";
import { useNavigate } from "react-router-dom";
import { Badge } from "rsuite";
import { useSelector } from "react-redux";
import { getAllCartItems } from "../../../store/entities/cart";

const Header = () => {
  const navigate = useNavigate();

  const cartItems = useSelector(getAllCartItems);

  const handleClick = (route) => {
    navigate(route);
  };
  return (
    <Navbar className="navbar">
      <Navbar.Brand href="#" style={{color: "#fff"}}>FinestDeals</Navbar.Brand>
      <Nav pullRight>
        <Nav.Item
          icon={<HomeIcon />}
          onClick={() => handleClick("/")}
          style={{ color: "#fff" }}
        >
          Home
        </Nav.Item>
        <Nav.Item
          onClick={() => handleClick("/products")}
          style={{ color: "#fff" }}
        >
          Products
        </Nav.Item>

        <Nav.Item
          icon={
            <Badge
              content={cartItems?.length}
              style={{ zIndex: 0, color: "#fff" }}
            >
              <CartPlus />
            </Badge>
          }
          onClick={() => handleClick("/cart")}
          style={{ color: "#fff" }}
        >
          cart
        </Nav.Item>
        <Nav.Item
          icon={<AdminIcon />}
          onClick={() => handleClick("/login")}
          style={{ color: "#fff" }}
        >
          {" "}
          Profile
        </Nav.Item>
        <Nav.Item
          onClick={() => handleClick("/contact")}
          style={{ color: "#fff" }}
        >
          {" "}
          Contact
        </Nav.Item>
        <Nav.Item
          icon={<Search />}
          onClick={() => handleClick("/search")}
          style={{ color: "#fff" }}
        >
          search
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default Header;
