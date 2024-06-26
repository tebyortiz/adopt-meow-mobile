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

function RegisterScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const { signup, authErrors, clearErrors } = useAuth();
  const [adopterSelected, setAdopterSelected] = useState(false);
  const [ownerSelected, setOwnerSelected] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      clearErrors();
      setUsername("");
      setEmail("");
      setPassword("");
      setImageUrl("");
      setRegistrationSuccess(false);
    }, [clearErrors])
  );

  const handleAdopterSelect = () => {
    setAdopterSelected(true);
    setOwnerSelected(false);
  };

  const handleOwnerSelect = () => {
    setAdopterSelected(false);
    setOwnerSelected(true);
  };

  const handleRegister = async () => {
    const userData: UserRegistrationData = {
      username,
      email,
      password,
      image: imageUrl,
      userType: adopterSelected ? "adopter" : "owner",
    };

    try {
      const signupResponse = await signup(userData);
      console.log("Signup response", signupResponse);
      setRegistrationSuccess(true);
      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);
    } catch (error) {
      setRegistrationSuccess(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-white h-full w-full">
          <Image
            className="h-[550] w-full absolute"
            source={require("../assets/images/background-topblue.png")}
          />
          <View className="flex-row justify-around w-full absolute">
            <Animated.Image
              entering={FadeInUp.delay(200).duration(1000).springify()}
              className="h-[100] w-[100] mt-28 ml-[-12]"
              source={require("../assets/images/cat-print.png")}
            />
            <Animated.Image
              entering={FadeInUp.delay(400).duration(1000).springify()}
              className="h-[50] w-[50] mt-28"
              source={require("../assets/images/cat-print.png")}
            />
          </View>
          <View className=" h-full w-full flex justify-around pt-5">
            <View className="flex items-center mt-12 mb-16">
              <Animated.Text
                entering={FadeInUp.duration(1000).springify()}
                className="text-white font-semi-bold tracking-wider text-5xl "
              >
                Nueva Cuenta
              </Animated.Text>
            </View>

            <View className="flex items-center mx-4 gap-4">
              <Animated.View
                entering={FadeInDown.duration(1000).springify()}
                className="bg-black/5 p-5 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="Nombre de Usuario"
                  placeholderTextColor={"gray"}
                  style={{
                    color: "#2B26AD",
                    fontSize: 18,
                    fontWeight: "semibold",
                  }}
                  value={username}
                  onChangeText={setUsername}
                />
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(200).duration(1000).springify()}
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
                entering={FadeInDown.delay(400).duration(1000).springify()}
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

              <Animated.View
                entering={FadeInDown.delay(600).duration(1000).springify()}
                className="bg-black/5 p-5 rounded-2xl w-full"
              >
                <TextInput
                  placeholder="URL de Imagen de Perfil"
                  placeholderTextColor={"gray"}
                  style={{
                    color: "#2B26AD",
                    fontSize: 18,
                    fontWeight: "semibold",
                  }}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                />
              </Animated.View>

              <Animated.Text
                entering={FadeInDown.delay(600).duration(1000).springify()}
                className="text-center text-gray-600 text-base mb-[-16]"
              >
                Deseo:
              </Animated.Text>

              <View className="flex-row w-full gap-4 justify-center mt-6">
                <TouchableOpacity onPress={handleAdopterSelect}>
                  <Animated.View
                    entering={FadeInDown.delay(800).duration(1000).springify()}
                    className={`bg-${
                      adopterSelected ? "[#6EADE1]" : "gray-200"
                    } rounded-xl p-2 flex items-center`}
                  >
                    <Image
                      source={require("../assets/images/cat1.png")}
                      style={{ width: 100, height: 100, resizeMode: "contain" }}
                    />
                    <Text
                      className={`text-sm font-bold ${
                        adopterSelected ? "text-white" : "text-[#6EADE1]"
                      } text-center mt-2`}
                    >
                      Adoptar
                    </Text>
                  </Animated.View>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleOwnerSelect}>
                  <Animated.View
                    entering={FadeInDown.delay(800).duration(1000).springify()}
                    className={`bg-${
                      ownerSelected ? "[#6EADE1]" : "gray-200"
                    } rounded-xl p-2 flex items-center`}
                  >
                    <Image
                      source={require("../assets/images/adopt1.png")}
                      style={{ height: 100, width: 100, resizeMode: "contain" }}
                    />
                    <Text
                      className={`text-sm font-bold ${
                        ownerSelected ? "text-white" : "text-[#6EADE1]"
                      } text-center mt-2`}
                    >
                      Dar en Adopción
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {authErrors.length > 0 && (
                <Animated.View
                  entering={FadeInDown.delay(800).duration(1000).springify()}
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

              {registrationSuccess && (
                <Animated.View
                  entering={FadeInDown.delay(800).duration(1000).springify()}
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
                      color: "#00B400",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Registro Exitoso
                  </Text>
                </Animated.View>
              )}

              <Animated.View
                entering={FadeInDown.delay(800).duration(1000).springify()}
                className="w-full"
              >
                <TouchableOpacity
                  onPress={handleRegister}
                  style={{
                    width: "100%",
                    backgroundColor: "#6EADE1",
                    padding: 12,
                    borderRadius: 20,
                    marginBottom: 12,
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
                    Registrarse
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(600).duration(1000).springify()}
                className="flex-row justify-center mt-6 mb-24"
              >
                <Text className="text-gray-600">Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text className="text-blue-400 mb-4"> Ingresar</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;
