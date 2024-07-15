import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";
import { AuthProvider } from "./context/authContext";
import { CatProvider } from "./context/CatContext";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import OwnerMainScreen from "./screens/OwnerMainScreen";
import OwnerNewReportScreen from "./screens/OwnerNewReportScreen";
import AdopterMainScreen from "./screens/AdopterMainScreen";
import { RootStackParamList } from "./models/RootStackParamList";
import AdopterCatDetailsScreen from "./screens/AdopterCatDetailsScreen";
import OwnerCatAdoptersScreen from "./screens/OwnerCatAdoptersScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <CatProvider>
        <GestureHandlerRootView>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Owner-Main" component={OwnerMainScreen} />
              <Stack.Screen
                name="Owner-New-Report"
                component={OwnerNewReportScreen}
              />
              <Stack.Screen name="Adopter-Main" component={AdopterMainScreen} />
              <Stack.Screen
                name="Adopter-Cat-Details"
                component={AdopterCatDetailsScreen}
              />
              <Stack.Screen
                name="Owner-Cat-Adopters"
                component={OwnerCatAdoptersScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </CatProvider>
    </AuthProvider>
  );
}
