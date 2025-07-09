import React, { useEffect, Fragment } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const NoAuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [location.pathname]);

  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};

export default NoAuthPage;
