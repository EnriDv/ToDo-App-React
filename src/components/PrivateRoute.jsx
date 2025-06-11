import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";

const PrivateRoute = ({ children }) => {
  const { session } = UserAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return <Layout>{session ? <>{children}</> : <Navigate to="/login" />}</Layout>;
};

export default PrivateRoute;