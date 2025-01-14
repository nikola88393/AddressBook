import { createContext, useState, useEffect } from "react";
import propTypes from "prop-types";
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await axios.post(
          "api/auth/refresh/",
          {},
          {
            withCredentials: true,
          }
        );
        setAuth({ accessToken: response.data.access_token });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: propTypes.node,
};

export default AuthContext;
