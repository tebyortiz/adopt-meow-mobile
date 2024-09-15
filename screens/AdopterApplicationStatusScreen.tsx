import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCats } from "../context/CatContext";
import { CatData } from "../models/CatData";
import Animated, { FadeInUp } from "react-native-reanimated";

const AdopterApplicationStatusScreen = () => {
  const navigation = useNavigation();
  const { getCats, cats, deleteCat, removeAdopter } = useCats();
  const [adoptedCats, setAdoptedCats] = useState<CatData[]>([]);
  const [novedadTypes, setNovedadTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdoptedCats = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in AsyncStorage");
        }
        await getCats();
        const adoptedCats = cats.filter((cat) =>
          cat.adopterId?.includes(userId)
        );
        setAdoptedCats(adoptedCats);
        const promises = adoptedCats.map((cat) => getNovedadType(cat));
        const resolvedNovedadTypes = await Promise.all(promises);
        setNovedadTypes(resolvedNovedadTypes);
      } catch (error) {
        console.error("Error fetching adopted cats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptedCats();
  }, []);

  const getNovedadType = async (cat: CatData): Promise<string> => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return "";

      if (cat.adopted && cat.adopterId?.includes(userId)) {
        if (cat.ownerId === userId) {
          return "Aprobado";
        } else {
          return "No Aprobado";
        }
      } else if (!cat.adopted && cat.adopterId?.includes(userId)) {
        return "En Revisión";
      }

      return "";
    } catch (error) {
      console.error("Error getting user ID from AsyncStorage:", error);
      return "";
    }
  };

  const handleDeleteNotification = async (catId: string, type: string) => {
    try {
      if (type === "Aprobado") {
        await deleteCat(catId);
      } else if (type === "No Aprobado") {
        await removeAdopter(catId);
      }
      setAdoptedCats((prevCats) => prevCats.filter((cat) => cat._id !== catId));
      setNovedadTypes((prevTypes) =>
        prevTypes.filter((_, idx) => adoptedCats[idx]._id !== catId)
      );
    } catch (error) {
      console.error("Error handling delete notification:", error);
    }
  };

  return (
    <View className="flex-1 bg-white space-y-6 pt-14">
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
            Novedades
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mx-4 flex-col mt-16">
          {loading ? (
            <Text className="text-center text-lg text-gray-500">
              Cargando...
            </Text>
          ) : adoptedCats.length === 0 ? (
            <Animated.Text
              className="text-center text-lg text-gray-500"
              entering={FadeInUp.delay(200).duration(1000).springify()}
            >
              No hay novedades disponibles
            </Animated.Text>
          ) : (
            adoptedCats.map((cat, index) => (
              <Animated.View
                key={cat._id}
                className="w-full self-center mb-10"
                entering={FadeInUp.delay(200).duration(1000).springify()}
              >
                <View className="flex-row items-center justify-between h-24 bg-[#6EADE1] rounded-xl">
                  <Image
                    source={{ uri: cat.image }}
                    className="h-20 w-20 ml-[15] rounded-full"
                    style={{ borderColor: "white", borderWidth: 4 }}
                  />
                  <View className="flex-1 ml-4">
                    <Text className="text-white text-3xl font-bold tracking-wider mb-2">
                      {cat.name}
                    </Text>
                    <Text className="text-[#2B26AD] text-xl font-bold tracking-wider">
                      {novedadTypes[index] ?? ""}
                    </Text>
                  </View>
                  <View className="items-center mr-4">
                    {novedadTypes[index] === "En Revisión" ? (
                      <AntDesign name="clockcircle" size={36} color="white" />
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          cat._id &&
                          handleDeleteNotification(
                            cat._id,
                            novedadTypes[index] ?? ""
                          )
                        }
                      >
                        <Entypo
                          name="circle-with-minus"
                          size={36}
                          color="white"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AdopterApplicationStatusScreen;
