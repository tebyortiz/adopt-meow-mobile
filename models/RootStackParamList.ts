import { CatData } from "./CatData";
import { UserRegistrationData } from "./UserRegistrationData";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  "Owner-Main": undefined;
  "Owner-New-Report": undefined;
  "Owner-Cat-Adopters": { cat: CatData; adopters: UserRegistrationData[] };
  "Adopter-Main": undefined;
  "Adopter-Cat-Details": { cat: CatData; owner: UserRegistrationData };
  "Adopter-Applications-Status": undefined;
};