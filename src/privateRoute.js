import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserDetails, getUserIsAuthenticated } from "./store/auth";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();

  const user = useSelector(getUserDetails);
  const isAuthenticated = useSelector(getUserIsAuthenticated);

  if (!user?.role === "admin" && !isAuthenticated) {
    return navigate("/login");
  }
  if (!isAuthenticated) {
    return navigate("/login");
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
