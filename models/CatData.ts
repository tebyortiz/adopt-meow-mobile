export interface CatData {
    _id?: string,
    name: string;
    age: number;
    sex: "male" | "female";
    castrated: "yes" | "no";
    description: string;
    ownerId: string;
    weight: string;
    specialCare: string;
    vaccinations: string;
    lat: number;
    lng: number;
    image: string;
    adopterId?: string[];
    adopted?: boolean;
  }