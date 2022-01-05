import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useLogin } from "shared/hooks/useLogin";

const PrivateRoute = (props) => {
  const isLogin = useLogin();

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    isLogin || (!isLogin && window.location.href.includes("/media")) ?
      <Route {...props} />
      :
      <Redirect to="/" />
  );
};

export default PrivateRoute;
