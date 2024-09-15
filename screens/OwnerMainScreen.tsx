import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/authContext";
import { useCats } from "../context/CatContext";
import { CatData } from "../models/CatData";
import { UserRegistrationData } from "../models/UserRegistrationData";
import Animated, { FadeInUp } from "react-native-reanimated";

function OwnerMainScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const { logout, user, getUserById } = useAuth();
  const { getCats, cats, deleteCat } = useCats();
  const [filteredCats, setFilteredCats] = useState<CatData[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [catToDelete, setCatToDelete] = useState<CatData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCats();
        const userId = await AsyncStorage.getItem("userId");
        //console.log("User ID from AsyncStorage:", userId);
        const userCats = cats.filter((cat) => cat.ownerId === userId);
        //console.log("Filtered Cats:", userCats);
        setFilteredCats(userCats);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cats:", error);
      }
    };

    if (!filteredCats.length) {
      fetchData();
    } else {
      const refreshFilteredCats = async () => {
        try {
          const userId = await AsyncStorage.getItem("userId");
          const userCats = cats.filter((cat) => cat.ownerId === userId);
          setFilteredCats(userCats);
        } catch (error) {
          console.error("Error refreshing filtered cats:", error);
        }
      };

      refreshFilteredCats();
    }
  }, [cats, filteredCats.length]);

  const handlePressDelete = (cat: CatData) => {
    setCatToDelete(cat);
    setShowConfirmationModal(true);
  };

  const handleDeleteCat = () => {
    if (catToDelete && catToDelete._id) {
      deleteCat(catToDelete._id);
    }
    setShowConfirmationModal(false);
    setCatToDelete(null);
  };

  const handlePressCatCard = async (cat: CatData) => {
    try {
      const adopterUsers: UserRegistrationData[] = [];
      if (cat.adopterId && cat.adopterId.length > 0) {
        for (const adopterId of cat.adopterId) {
          const user = await getUserById(adopterId);
          if (user) adopterUsers.push(user);
        }
      }
      navigation.navigate("Owner-Cat-Adopters", {
        cat,
        adopters: adopterUsers,
      });
    } catch (error) {
      console.error("Error fetching adopter details:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Login");
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

      <View className="mx-4 bg-gray-100 rounded-3xl p-1 mb-16">
        {user && (
          <View className=" flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Image
                source={{ uri: user.image }}
                className="h-12 w-12 mr-2 rounded-full ml-2"
              />
              <Text className="text-[#2B26AD] font-bold tracking-wider text-xl">
                {user.username}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center"
            >
              <View className="flex-row items-center">
                <Text className="text-[#2B26AD] font-bold tracking-wider text-xl mr-2">
                  Salir
                </Text>
                <AntDesign
                  name="rightcircle"
                  size={24}
                  color="#2B26AD"
                  style={{ marginRight: 8 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={{ width: "80%", alignSelf: "center" }}
        onPress={() => navigation.navigate("Owner-New-Report")}
      >
        <Animated.View
          className="flex-row items-center justify-between h-40 bg-[#6EADE1] rounded-3xl mb-24"
          entering={FadeInUp.delay(200).duration(1000).springify()}
        >
          <Image
            source={require("../assets/images/cat-print.png")}
            className="h-24 w-24 mr-2 ml-4"
          />
          <Text className="flex-1 text-white text-center text-4xl font-bold">
            Nuevo Gatito en Adopción
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        className="flex-row justify-center items-center bg-gray-100 rounded-xl p-2 mb-8"
        style={{ alignSelf: "center" }}
        entering={FadeInUp.delay(400).duration(1000).springify()}
      >
        <AntDesign name="filetext1" size={24} color="#2B26AD" />
        <Text className="text-[#2B26AD] font-bold tracking-wider text-2xl ml-2">
          Reportes
        </Text>
      </Animated.View>

      {isLoading ? (
        <Animated.Text
          className="text-center text-lg text-gray-500 p-4"
          entering={FadeInUp.delay(600).duration(1000).springify()}
        >
          Cargando reportes...
        </Animated.Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mx-4 flex-col mt-4 gap-4">
            {filteredCats.length === 0 ? (
              <Animated.Text
                className="text-center text-lg text-gray-500 p-4"
                entering={FadeInUp.delay(600).duration(1000).springify()}
              >
                Todavía no has publicado gatitos en adopción
              </Animated.Text>
            ) : (
              filteredCats.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePressCatCard(cat)}
                  className="w-full self-center mb-6"
                >
                  <Animated.View
                    className="flex-row items-center justify-between h-28 bg-[#6EADE1] rounded-3xl"
                    entering={FadeInUp.delay(600).duration(1000).springify()}
                  >
                    <Image
                      source={{ uri: cat.image }}
                      className="h-24 w-24 ml-[15] rounded-full"
                      style={{ borderColor: "white", borderWidth: 4 }}
                    />
                    <View className="flex-1 ml-4">
                      <Text className="text-white text-3xl font-bold tracking-wider mb-2">
                        {cat.name}
                      </Text>
                      <Text className="text-white text-xl font-bold tracking-wider">
                        Interesados: {cat.adopterId?.length || 0}
                      </Text>
                    </View>

                    <View className="items-center">
                      <TouchableOpacity onPress={() => handlePressDelete(cat)}>
                        <View className="mr-4 items-center bg-white rounded-full">
                          <MaterialCommunityIcons
                            name="delete-circle"
                            size={54}
                            color="#2B26AD"
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              ))
            )}

            <Modal
              transparent={true}
              visible={showConfirmationModal}
              animationType="slide"
              onRequestClose={() => setShowConfirmationModal(false)}
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
                  onPressOut={() => setShowConfirmationModal(false)}
                />
                <View
                  style={{
                    width: "90%",
                    height: "40%",
                    backgroundColor: "white",
                    borderRadius: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                  }}
                >
                  <View className="bg-[#F1F1F4] px-6 py-3 rounded-3xl items-center mt-4">
                    <AntDesign
                      name="exclamationcircle"
                      size={54}
                      color="#2B26AD"
                    />
                    <Text className="text-gray-700 font-semi-bold tracking-wider text-2xl mt-4 text-center">
                      Desea eliminar el Reporte de {catToDelete?.name}?
                    </Text>
                    <View className="mt-8 bg-[#2B26AD] px-6 py-3 rounded-full">
                      <TouchableOpacity onPress={handleDeleteCat}>
                        <Text className="text-white font-bold">Aceptar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="mt-12 bg-[#F1F1F4] px-6 py-3 rounded-full">
                    <TouchableOpacity
                      onPress={() => setShowConfirmationModal(false)}
                    >
                      <Text className="text-[#2B26AD] font-bold">Volver</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default OwnerMainScreen;
