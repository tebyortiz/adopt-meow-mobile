import axios from "axios";

const instance = axios.create({
  baseURL: "https://mi-adopt-meow-31371569006f.herokuapp.com/api",
  withCredentials: true,
});

instance.defaults.headers["Access-Control-Expose-Headers"] = "*";
export default instance;
