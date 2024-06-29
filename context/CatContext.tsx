import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CatData } from "../models/CatData";
import { getCatsRequest, deleteCatRequest, createCatRequest, } from "../services/auth";

interface CatContextProps {
  cats: CatData[];
  getCats: () => void;
  deleteCat: (id: string) => Promise<void>;
  createCat: (cat: CatData) => Promise<void>;
}

const CatContext = createContext<CatContextProps | undefined>(undefined);

export const CatProvider = ({ children }: { children: ReactNode }) => {
  const [cats, setCats] = useState<CatData[]>([]);

  const getCats = async () => {
    try {
      const response = await getCatsRequest();
      setCats(response.data);
    } catch (error) {
      //console.error("Failed to fetch cats", error);
    }
  };

  const deleteCat = async (id: string) => {
    try {
      await deleteCatRequest(id);
      getCats();
    } catch (error) {
      //console.error("Failed to delete cat", error);
    }
  };

  const createCat = async (cat: CatData) => {
    try {
      await createCatRequest(cat);
      getCats();
    } catch (error) {
      //console.error("Failed to create cat", error);
    }
  };

  useEffect(() => {
    getCats();
  }, []);

  return (
    <CatContext.Provider
      value={{
        cats,
        getCats,
        deleteCat,
        createCat
      }}
    >
      {children}
    </CatContext.Provider>
  );
};

export const useCats = () => {
  const context = useContext(CatContext);
  if (!context) {
    throw new Error("useCats must be used within a CatProvider");
  }
  return context;
};
