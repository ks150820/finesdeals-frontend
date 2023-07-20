import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Info from "@mui/icons-material/Info";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <Info
          style={{
            color: "tomato",
            fontSize: 100,
            display: "flex",
            justifyContent: "center",
            margin: "auto",
            marginBottom: 10,
          }}
        />
        <h1>Page Not Found</h1>
        <Button
          variant="outlined"
          color="error"
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "auto",
            marginTop: 10,
          }}
          onClick={() => navigate("/")}
        >
          Home page
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
