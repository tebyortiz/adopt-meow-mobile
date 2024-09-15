import axios from "axios";

const instance = axios.create({
  baseURL: "https://adopt-meow-back-emd-production.up.railway.app/api",
  withCredentials: true,
});

instance.defaults.headers["Access-Control-Expose-Headers"] = "*";
export default instance;
