import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resposneIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        console.log(error?.response);
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          console.log("Refreshing token");
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(resposneIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
