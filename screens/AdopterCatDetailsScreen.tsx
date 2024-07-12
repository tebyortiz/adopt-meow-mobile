import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useCats } from "../context/CatContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInUp } from "react-native-reanimated";
import { RootStackParamList } from "../models/RootStackParamList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Adopter-Cat-Details">;

function AdopterCatDetailsScreen({ route, navigation }: Props) {
  const { cat, owner } = route.params;
  const { applyAdoption } = useCats();
  const [modalVisible, setModalVisible] = useState(false);

  const getSexColor = (sex: string) => {
    return sex === "male" ? "#6EADE1" : "#FDB4CB";
  };

  const getCastratedColor = (castrated: string) => {
    return castrated === "yes" ? "#D0E6A5" : "#F67A7A";
  };

  const handleAdopt = async () => {
    const adopterId = await AsyncStorage.getItem("userId");
    const catId = cat._id;

    //console.log("ID del adoptante:", adopterId);
    //console.log("ID del gatito:", catId);

    if (catId && adopterId) {
      await applyAdoption(catId, adopterId);
      setModalVisible(true);
    } else {
      console.error("El ID del gatito o del adoptante no está definido");
    }
  };

  const handleGoBack = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white space-y-6 pt-14">
      <StatusBar style="dark" />
      <View className="mx-4 flex-row justify-between items-center mb-[-8]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ marginLeft: wp(-2) }}>
              <Ionicons name="chevron-back" size={24} color="#2B26AD" />
            </View>
          </TouchableOpacity>
          <Text className="text-[#2B26AD] font-semi-bold tracking-wider text-3xl">
            Datos del Gatito
          </Text>
        </View>
      </View>

      <Animated.View
        style={{ alignItems: "center", marginTop: 50, zIndex: 1 }}
        entering={FadeInUp.delay(200).duration(1000).springify()}
      >
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            marginBottom: -80,
            borderColor: "#6EADE1",
            borderWidth: 4,
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: cat.image }}
            style={{ width: 150, height: 150, borderRadius: 75 }}
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).duration(1000).springify()}
        className="self-center rounded-3xl bg-gray-100 p-5 mt-12"
        style={{
          width: wp(90),
          maxWidth: 600,
        }}
      >
        <View className="flex-row justify-center items-center mb-2 mt-12 space-x-1">
          <Text className="text-[#2B26AD] font-semibold text-xl bg-white py-1 p-2 rounded-full">
            Nombre: {cat.name}
          </Text>
          <Text
            className="text-[#2B26AD] font-semibold text-xl py-1 p-2 rounded-full"
            style={{ backgroundColor: getSexColor(cat.sex) }}
          >
            {cat.sex === "male" ? "Macho" : "Hembra"}
          </Text>
        </View>

        <View className="flex-row justify-center items-center mb-2 space-x-1">
          <Text className="text-[#2B26AD] font-semibold text-xl bg-white px-3 py-1 p-2 rounded-full">
            Peso:{cat.weight}
          </Text>
          <Text className="text-[#2B26AD] font-semibold text-xl bg-white px-3 py-1 p-2 rounded-full">
            Castrado/a?
          </Text>
          <Text
            className="text-[#2B26AD] font-semibold text-xl px-3 py-1 rounded-full"
            style={{ backgroundColor: getCastratedColor(cat.castrated) }}
          >
            {cat.castrated === "yes" ? "Sí" : "No"}
          </Text>
        </View>

        <View className="flex-row justify-center items-center mb-2">
          <Text className="text-[#2B26AD] text-center font-semi-bold text-l bg-white px-3 py-1 p-2 rounded-xl">
            {cat.description}
          </Text>
        </View>

        <View className="bg-white p-2 items-center rounded-xl mb-2">
          <Text className="text-[#2B26AD] font-semibold text-xl">
            Cuidados Especiales:
          </Text>
          <Text className="text-[#2B26AD] text-center text-l mt-1">
            {cat.specialCare}
          </Text>
        </View>

        <View className="bg-[#FFEB99] p-2 rounded-xl mb-4">
          <View className="flex-row">
            <View className="flex-1 items-center bg-white rounded-xl">
              <Text className="text-[#2B26AD] font-bold text-xl">Vacunas</Text>
              <Image
                source={require("../assets/images/vaccine.png")}
                style={{ width: 50, height: 50, marginTop: 1, marginBottom: 5 }}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-[#2B26AD] font-semibold text-xl border-b border-[#2B26AD] mb-1">
                {cat.vaccinations}
              </Text>
            </View>
          </View>
        </View>

        <Animated.View
          className="flex-row items-center mb-0"
          entering={FadeInUp.delay(600).duration(1000).springify()}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              marginRight: 10,
              borderColor: "#6EADE1",
              borderWidth: 4,
            }}
          >
            <Image
              source={{ uri: owner.image }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          </View>
          <View className="bg-white py-1 px-3 rounded-xl">
            <Text className="text-[#2B26AD] text-center font-semibold text-xl">
              Oferente:
            </Text>
            <Text className="text-[#2B26AD] text-center font-semibold text-xl">
              {owner.username}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(1000).duration(1000).springify()}
          className="absolute bottom-[-60] right-[20] items-center"
        >
          <TouchableOpacity onPress={handleAdopt}>
            <Image
              source={require("../assets/images/heart.png")}
              style={{ width: 100, height: 100, borderRadius: 30 }}
            />
          </TouchableOpacity>
          <Text className="text-[#2B26AD] font-bold text-2xl ">ADOPTAR</Text>
        </Animated.View>
      </Animated.View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          />
          <View
            style={{
              width: "90%",
              height: "70%",
              backgroundColor: "#F1F1F4",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "#6EADE1",
                  borderWidth: 4,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: cat.image }}
                  style={{ width: 150, height: 150, borderRadius: 75 }}
                />
              </View>

              <Text className="text-[#2B26AD] font-semi-bold tracking-wider text-3xl mt-4 text-center">
                Solicitud de Adopción enviada.
              </Text>

              <Text className="text-[#2B26AD] font-semi-bold tracking-wider text-xl mt-4 mb-4">
                Oferente:
              </Text>
            </View>

            <View className="w-full items-center">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#6EADE1",
                  borderRadius: 20,
                  padding: 10,
                  width: "80%",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: owner.image }}
                  className="h-20 w-20 rounded-full"
                  style={{ borderColor: "white", borderWidth: 4 }}
                />
                <Text className="text-white font-bold tracking-wider text-3xl ml-4">
                  {owner.username}
                </Text>
              </View>
            </View>

            <Text className="text-[#2B26AD] text-center font-semi-bold tracking-wider text-l mt-4 ">
              Tu solicitud será revisada y puede ser confirmada o rechazada.
            </Text>

            <View className="mt-8 bg-[#2B26AD] px-6 py-2 rounded-full">
              <TouchableOpacity onPress={handleGoBack}>
                <Text className="text-white text-xl">Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default AdopterCatDetailsScreen;
