import useAuth from "./useAuth";
import axios from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    //change the URL to the refresh token endpoint
    const response = await axios.post(
      "api/auth/refresh/",
      {},
      {
        withCredentials: true,
      }
    );
    setAuth((prev) => {
      return {
        ...prev,
        accessToken: response.data.access,
      };
    });
    console.log(response.data);
    return response.data.access;
  };

  return refresh;
};

export default useRefreshToken;
