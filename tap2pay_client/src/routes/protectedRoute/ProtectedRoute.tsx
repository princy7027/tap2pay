import React, { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};

export default ProtectedRoute;
