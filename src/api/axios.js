import axios from "axios";
const BASE_URL = "https://address-book-api-567333973960.europe-west4.run.app/";
// const BASE_URL = "http://localhost:3000/";

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
