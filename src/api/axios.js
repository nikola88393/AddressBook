import axios from "axios";
const BASE_URL = "http://127.0.0.1:8000/";

//Create an axios instance with a base URL
export default axios.create({
  //Change the baseURL to the URL of the API
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  //Change the baseURL to the URL of the API
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
