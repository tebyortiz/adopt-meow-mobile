import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CatData } from "../models/CatData";
import {
  getCatsRequest,
  deleteCatRequest,
  createCatRequest,
  applyAdoptionRequest,
  updateCatOwnerRequest,
  confirmAdoptionRequest,
  removeAdopterRequest,
} from "../services/auth";

interface CatContextProps {
  cats: CatData[];
  getCats: () => void;
  deleteCat: (id: string) => Promise<void>;
  createCat: (cat: CatData) => Promise<void>;
  applyAdoption: (catId: string, adopterId: string) => Promise<void>;
  updateCatOwner: (catId: string, newOwnerId: string) => Promise<void>;
  confirmAdoption: (catId: string, adopterId: string) => Promise<void>;
  removeAdopter: (catId: string) => Promise<void>;
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

  const applyAdoption = async (catId: string, adopterId: string) => {
    try {
      await applyAdoptionRequest(catId, adopterId);
      // getCats();
    } catch (error) {
      //console.error("Failed to apply adoption:", error);
      throw error;
    }
  };

  const updateCatOwner = async (catId: string, newOwnerId: string) => {
    try {
      await updateCatOwnerRequest(catId, newOwnerId);
      getCats();
    } catch (error) {
      //console.error("Failed to update cat owner", error);
      throw error;
    }
  };

  const confirmAdoption = async (catId: string, adopterId: string) => {
    try {
      await confirmAdoptionRequest(catId, adopterId);
      getCats();
    } catch (error) {
      //console.error("Failed to confirm adoption", error);
      throw error;
    }
  };

  const removeAdopter = async (catId: string) => {
    try {
      await removeAdopterRequest(catId);
      getCats();
    } catch (error) {
      //console.error("Failed to remove adopter:", error);
      throw error;
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
        createCat,
        applyAdoption,
        updateCatOwner,
        confirmAdoption,
        removeAdopter,
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
