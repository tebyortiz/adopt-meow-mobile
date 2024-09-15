import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserRegistrationData } from "../models/UserRegistrationData";
import { useCats } from "../context/CatContext";
import Animated, { FadeInUp } from "react-native-reanimated";
import { RootStackParamList } from "../models/RootStackParamList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Owner-Cat-Adopters">;

function OwnerCatAdoptersScreen({ route, navigation }: Props) {
  const { cat, adopters } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAdopter, setSelectedAdopter] =
    useState<UserRegistrationData | null>(null);
  const { updateCatOwner, confirmAdoption } = useCats();

  const handlePress = async (adopter: UserRegistrationData) => {
    if (cat._id && adopter.id) {
      try {
        await updateCatOwner(cat._id, adopter.id);
        await confirmAdoption(cat._id, adopter.id);
        setSelectedAdopter(adopter);
        setModalVisible(true);
      } catch (error) {
        console.error(
          "Error updating cat owner or confirming adoption:",
          error
        );
      }
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.navigate("Owner-Main");
  };

  return (
    <View className="flex-1 bg-white pt-14">
      <StatusBar style="dark" />
      <Image
        source={require("../assets/images/cat-print.png")}
        style={{
          position: "absolute",
          bottom: 0,
          left: 40,
          width: "100%",
          height: "50%",
          resizeMode: "cover",
          zIndex: -1,
          transform: [{ rotate: "-50deg" }],
        }}
      />

      <View className="mx-4 flex-row justify-between items-center mb-[-8] ">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ marginLeft: wp(-2) }}>
              <Ionicons name="chevron-back" size={24} color="#2B26AD" />
            </View>
          </TouchableOpacity>

          <Text className="text-[#2B26AD] font-semi-bold tracking-wider text-3xl">
            Selección del Adoptante
          </Text>
        </View>
      </View>

      <View className="flex flex-col items-center flex-1">
        <Animated.View
          className="bg-gray-100 rounded-3xl p-5 w-4/5 items-center mb-12 mt-12"
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
              borderColor: "#6EADE1",
              borderWidth: 4,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: cat.image }}
              className="w-40 h-40 rounded-full"
            />
          </View>
          <Text className="text-[#6EADE1] font-bold text-3xl mt-4 text-center">
            Adopción de {cat.name}
          </Text>
        </Animated.View>

        <Animated.View
          className="flex-row justify-center items-center bg-gray-100 rounded-xl p-2 mb-4"
          entering={FadeInUp.delay(400).duration(1000).springify()}
        >
          <MaterialCommunityIcons
            name="hand-heart"
            size={24}
            color="#2B26AD"
            style={{ marginRight: 5 }}
          />
          <Text className="text-[#2B26AD] font-bold tracking-wider text-2xl">
            Seleccionar Adoptante:
          </Text>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 w-full"
        >
          {adopters.length === 0 ? (
            <Animated.Text
              className="text-center text-lg text-gray-500"
              entering={FadeInUp.delay(600).duration(1000).springify()}
            >
              Todavía no hay interesados
            </Animated.Text>
          ) : (
            <Animated.View
              className="mx-4 flex-col mt-4"
              entering={FadeInUp.delay(600).duration(1000).springify()}
            >
              {adopters.map((adopter, index) => (
                <View key={index} className="w-full self-center mb-4">
                  <View className="flex-row items-center justify-between h-28 bg-[#6EADE1] rounded-3xl px-4">
                    <Image
                      source={{ uri: adopter.image }}
                      className="h-20 w-20 rounded-full"
                      style={{ borderColor: "white", borderWidth: 4 }}
                    />

                    <View className="flex-1 ml-4">
                      <Text className="text-white text-3xl font-bold tracking-wider">
                        {adopter.username}
                      </Text>
                    </View>

                    <TouchableOpacity onPress={() => handlePress(adopter)}>
                      <View
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 40,
                          backgroundColor: "white",
                          justifyContent: "center",
                          alignItems: "center",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          source={require("../assets/images/adopt1.png")}
                          style={{
                            width: "80%",
                            height: "80%",
                            borderRadius: 15,
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </Animated.View>
          )}
        </ScrollView>

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
                height: "60%",
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
                <Image
                  source={require("../assets/images/confeti.png")}
                  style={{
                    position: "absolute",
                    width: 250,
                    height: 250,
                    resizeMode: "cover",
                    zIndex: -1,
                  }}
                />

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
                  Nuevo hogar para {cat.name}
                </Text>
              </View>

              <Text className="text-[#2B26AD] font-semi-bold tracking-wider text-xl mt-4 mb-4">
                Adoptante:
              </Text>

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
                    source={{ uri: selectedAdopter?.image }}
                    className="h-20 w-20 rounded-full"
                    style={{ borderColor: "white", borderWidth: 4 }}
                  />
                  <Text className="text-white font-bold tracking-wider text-3xl ml-4">
                    {selectedAdopter?.username}
                  </Text>
                </View>
              </View>
              <View className="mt-8 bg-[#2B26AD] px-6 py-2 rounded-full">
                <TouchableOpacity onPress={handleModalClose}>
                  <Text className="text-white text-xl">Volver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

export default OwnerCatAdoptersScreen;
