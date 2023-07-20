import React, { useEffect } from "react";

import {useDispatch, useSelector} from 'react-redux';
import "./dashboard.css";
import Sidebar from "./Sidebar";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { getAdminProducts, startCallingAdminProductsApi } from "../../store/entities/product";
import { callToGetAllAdminOrders, getAdminAllOrders } from "../../store/entities/orders";
import { callToGetAllAdminUserDetails, getAllAdminUserDetails } from "../../store/auth";

const Dashboard = () => {

  let outOfStock = 0;

  const dispatch = useDispatch();

  const products = useSelector(getAdminProducts);
  const orders = useSelector(getAdminAllOrders);
  const users = useSelector(getAllAdminUserDetails);

  let totalAmount = 0;

  orders && orders?.forEach((item) => {
    totalAmount += item?.totalPrice;
  })

  useEffect(() =>{
    dispatch(startCallingAdminProductsApi());
    dispatch(callToGetAllAdminOrders());
    dispatch(callToGetAllAdminUserDetails());
  },[])

  products && products?.forEach((item) => {
    if(item?.Stock === 0){
      outOfStock += 1;
    }
  });

    const lineState = {
        labels: ["Initials Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgb(197,72,49)"],
                data: [0, totalAmount],
            }
        ],
    }

    const doughnutState = {
        labels: ["Out of stock", "InStock"],
        datasets: [
            {
                backgroundColor: ["#00A684", "#6800B4"],
                hoverBackgroundColor: ["#4B5000", "#35014F"],
                data: [outOfStock, products?.length - outOfStock]
            }
        ]
    };
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>
        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> Rs.{totalAmount && totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products && products?.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders?.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users?.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
        <Chart type='line' data={lineState} />
        </div>
        <div className="doughnutChart">
        <Chart type="doughnut" data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
