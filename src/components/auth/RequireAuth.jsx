import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
// import useRefreshToken from "../../hooks/useRefreshToken";
// import { useEffect, useState } from "react";
import Loading from "../common/Loading";

const RequireAuth = () => {
  const { auth, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/authenticate" state={{ from: location }} replace />
  );
};

export default RequireAuth;
