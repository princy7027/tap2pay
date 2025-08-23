import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../pages/error/NotFound";
import LoginPage from "../pages/login/Login";
import NoAuthPages from "./noAuthPage/NoAuthPage";
import React from "react";
import RegisterPage from "../pages/register/Register";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import Success from "../pages/success/success";
import Subscribe from "../pages/dashboard/Subscribe";
import SubscriptionSuccess from "../pages/success/subscription_success"

const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<NoAuthPages />}>
        <Route index element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        <Route path="/success" element={<Success />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;
