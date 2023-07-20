import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "./components/layouts";

const AppLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default AppLayout;
