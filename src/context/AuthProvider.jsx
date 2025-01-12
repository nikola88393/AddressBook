import { createContext, useState, useEffect } from "react";
import propTypes from "prop-types";
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  useEffect(() => {
    //check if the user is logged in on the first render
    const refresh = async () => {
      const response = await axios.post(
        "api/account/token/refresh/",
        {},
        {
          withCredentials: true,
        }
      );
      setAuth({ accessToken: response.data.access_token });

      console.log(response.data);
      return response.data.access_token;
    };

    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: propTypes.node,
};

export default AuthContext;
