export interface UserRegistrationData {
  id?: string;
  email: string;
  password: string;
  username?: string;
  image?: string;
  userType?: "owner" | "adopter";
}
