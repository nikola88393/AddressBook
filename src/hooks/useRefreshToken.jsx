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

    setAuth({ accessToken: response.data.access_token });

    console.log(response.data);
    return response.data.access;
  };

  return refresh;
};

export default useRefreshToken;
