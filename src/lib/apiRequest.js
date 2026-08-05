import axios from "axios";
import { API_URL } from "./config";

const apiRequest = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


export default apiRequest;
