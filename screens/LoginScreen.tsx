import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAuth } from "../context/authContext";
import { UserRegistrationData } from "../models/UserRegistrationData";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const { signIn, authErrors, clearErrors } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setLoginSuccessful(false);
      clearErrors();
      setEmail("");
      setPassword("");
      setAnimationKey((prevKey) => prevKey + 1);
    }, [clearErrors])
  );

  const handleLogin = async () => {
    const credentials: UserRegistrationData = { email, password };

    try {
      await signIn(credentials);
      setLoginSuccessful(true);

      const userType = await AsyncStorage.getItem("userType");
      setTimeout(() => {
        if (userType === "owner") {
          navigation.navigate("Owner-Main");
        } else if (userType === "adopter") {
          navigation.navigate("Adopter-Main");
        } else {
          console.error("Tipo de usuario desconocido");
        }
      }, 2000);
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-white h-full w-full">
          <Image
            className="h-[800] w-full absolute"
            source={require("../assets/images/background-topblue.png")}
          />

          <View className="flex-row justify-around w-full absolute">
            <Animated.Image
              key={animationKey + "-1"}
              entering={FadeInUp.delay(200).duration(1000).springify()}
              className="h-[225] w-[90]"
              source={require("../assets/images/light.png")}
            />

            <Animated.Image
              key={animationKey + "-2"}
              entering={FadeInUp.delay(400).duration(1000).springify()}
              className="h-[175] w-[70]"
              source={require("../assets/images/light.png")}
            />
          </View>

          <View className="h-full w-full flex justify-around pt-60 pb-1">
            <View className="flex items-center">
              <Animated.Text
                key={animationKey + "-3"}
                entering={FadeInUp.duration(1000).springify()}
                className="text-white font-semi-bold tracking-wider text-6xl mt-8 mb-48"
              >
                Bienvenidos
              </Animated.Text>
            </View>

            <View className="flex items-center mx-4 gap-4">
              <Animated.View
                key={animationKey + "-4"}
                entering={FadeInDown.duration(1000).springify()}
                className="bg-black/5 p-5 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={"gray"}
                  style={{
                    color: "#2B26AD",
                    fontSize: 18,
                    fontWeight: "semibold",
                  }}
                  value={email}
                  onChangeText={setEmail}
                />
              </Animated.View>

              <Animated.View
                key={animationKey + "-5"}
                entering={FadeInDown.delay(200).duration(1000).springify()}
                className="bg-black/5 p-5 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor={"gray"}
                  style={{
                    color: "#2B26AD",
                    fontSize: 18,
                    fontWeight: "semibold",
                  }}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </Animated.View>

              {authErrors.length > 0 && (
                <Animated.View
                  key={animationKey + "-6"}
                  entering={FadeInDown.delay(400).duration(1000).springify()}
                  style={{
                    width: "100%",
                    backgroundColor: "#FFD4D4",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  {authErrors.map((error, index) => (
                    <Text
                      key={index}
                      style={{
                        color: "#B40000",
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      {error.message}
                    </Text>
                  ))}
                </Animated.View>
              )}

              {loginSuccessful && (
                <Animated.View
                  key={animationKey + "-7"}
                  entering={FadeInDown.delay(400).duration(1000).springify()}
                  style={{
                    width: "100%",
                    backgroundColor: "#D4FFD4",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#008000",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Inicio de sesión exitoso
                  </Text>
                </Animated.View>
              )}

              <Animated.View
                key={animationKey + "-8"}
                entering={FadeInDown.delay(400).duration(1000).springify()}
                className="w-full"
              >
                <TouchableOpacity
                  onPress={handleLogin}
                  style={{
                    width: "100%",
                    backgroundColor: "#6EADE1",
                    padding: 12,
                    borderRadius: 20,
                    marginBottom: 48,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Ingresar
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                key={animationKey + "-9"}
                entering={FadeInDown.delay(600).duration(1000).springify()}
                className="flex-row justify-center"
              >
                <Text>No tienes una cuenta? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text className="text-blue-400 mb-60"> Regístrate</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
