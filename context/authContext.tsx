import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
} from "../services/auth";
import { UserRegistrationData } from "../models/UserRegistrationData";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  user: UserRegistrationData | null;
  loading: boolean;
  signup: (userData: UserRegistrationData) => Promise<void>;
  signIn: (credentials: UserRegistrationData) => Promise<void>;
  isAuthenticated: boolean;
  authErrors: { field: string; message: string }[];
  clearErrors: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro de un provider AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserRegistrationData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authErrors, setAuthErrors] = useState<
    { field: string; message: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const signup = async (userData: UserRegistrationData): Promise<void> => {
    try {
      const response = await registerRequest(userData);
      if (response && response.data) {
        const { data } = response;
        setUser(data);
        setIsAuthenticated(false);
        return Promise.resolve();
      }
    } catch (error) {
      handleAuthError(error);
      return Promise.reject(error);
    }
  };

  const signIn = async (credentials: UserRegistrationData): Promise<void> => {
    clearErrors();
    try {
      //console.log("Iniciando sesión con:", credentials);
      const response = await loginRequest(credentials);
      //console.log("Respuesta del servidor:", response);

      if (response && response.data && response.headers) {
        const { data, headers } = response;
        //console.log("Datos:", data);
        //console.log("Headers:", headers);

        if (headers.authorization) {
          const token = headers.authorization.split(" ")[1];
          await AsyncStorage.setItem("token", token);
          //console.log("Token guardado en AsyncStorage:", token);
          //console.log("ID de usuario:", data.id);
          await AsyncStorage.setItem("userId", data.id);
          await AsyncStorage.setItem("userType", data.userType);
          setUser(data);
          setIsAuthenticated(true);
          return Promise.resolve();
        } else {
          //console.error("El servidor no proporcionó un token de autorización.");
          setAuthErrors([{ field: "network", message: "Error de red" }]);
          return Promise.reject();
        }
      }
    } catch (error) {
      //console.error("Error en signIn:", error);
      handleAuthError(error);
      return Promise.reject(error);
    }
  };

  const handleAuthError = (error: any): void => {
    //console.error("Error capturado en handleAuthError:", error);

    if (error.response && error.response.data) {
      const responseData = error.response.data;
      //console.log("Datos de la respuesta de error:", responseData);

      if (responseData.errors) {
        const yupErrors = responseData.errors.map((err: any) => ({
          field: err.field,
          message: err.message,
        }));
        setAuthErrors(yupErrors);
      } else if (responseData.message) {
        if (responseData.message === "El correo electrónico ya está en uso") {
          setAuthErrors([
            { field: "email", message: "El correo electrónico ya está en uso" },
          ]);
        } else {
          setAuthErrors([{ field: "network", message: responseData.message }]);
        }
      } else {
        setAuthErrors([{ field: "network", message: "Error desconocido" }]);
      }
    } else {
      setAuthErrors([{ field: "network", message: "Error de red" }]);
    }
  };

  const clearErrors = useCallback(() => {
    setAuthErrors([]);
  }, []);

  const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("userType");
    setUser(null);
    setIsAuthenticated(false);
    setAuthErrors([]);
  };

  useEffect(() => {
    async function checkLogin() {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(token);

        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        //console.error("Error al verificar el token:", error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        signIn,
        isAuthenticated,
        authErrors,
        clearErrors,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
