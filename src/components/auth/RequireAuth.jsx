import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useEffect, useState } from "react";
import Loading from "../common/Loading";

const RequireAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    // If no access token, attempt to refresh; otherwise, loading is complete
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, [auth?.accessToken, refresh]);

  if (isLoading) {
    return <Loading />;
  }

  // Redirect to login if no access token
  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/authenticate" state={{ from: location }} replace />
  );
};

export default RequireAuth;
