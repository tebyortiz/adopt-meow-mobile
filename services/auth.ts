import axios from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserRegistrationData } from "../models/UserRegistrationData";

axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        //console.log("Token agregado a las cabeceras:", token);
      }
      return config;
    } catch (error) {
      //console.error("Error al agregar token a las cabeceras:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerRequest = async (user: UserRegistrationData) => {
  try {
    //console.log("Enviando datos de registro:", user);
    const response = await axios.post(`/register`, user);
    //console.log("Respuesta del servidor al registrar:", response);
    return response;
  } catch (error) {
    //console.error("Error en registerRequest:", error);
    throw error;
  }
};

export const loginRequest = async (user: UserRegistrationData) => {
  try {
    //console.log("Enviando datos de inicio de sesión:", user);
    const response = await axios.post(`/login`, user);
    //console.log("Respuesta del servidor al iniciar sesión:", response);
    return response;
  } catch (error) {
    //console.error("Error en loginRequest:", error);
    throw error;
  }
};

export const verifyTokenRequest = async (token: string) => {
  try {
    //console.log("Verificando token:", token);
    const response = await axios.get(`/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log("Respuesta del servidor al verificar token:", response);
    return response;
  } catch (error) {
    //console.error("Error en verifyTokenRequest:", error);
    throw error;
  }
};
