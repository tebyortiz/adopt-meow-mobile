import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Region } from "react-native-maps";
import ClusterMapView from "react-native-map-clustering";
import * as Location from "expo-location";
import { NavigationProp } from "@react-navigation/native";
import { useAuth } from "../context/authContext";
import { useCats } from "../context/CatContext";
import { CatData } from "../models/CatData";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Location {
  latitude: number;
  longitude: number;
}

const initialRegion: Region = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

function AdopterMainScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const { logout, user, getUserById } = useAuth();
  const { getCats, cats } = useCats();
  const [myLocation, setMyLocation] = useState<Location | null>(null);
  const [region, setRegion] = useState<Region>(initialRegion);
  const [filteredCats, setFilteredCats] = useState<CatData[]>([]);
  const [numNovedades, setNumNovedades] = useState<number>(0);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setMyLocation({ latitude, longitude });

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setRegion(newRegion);
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          await getCats();
          const notAdoptedCats = cats.filter(
            (cat: CatData) =>
              !cat.adopted && !(cat.adopterId && cat.adopterId.includes(userId))
          );
          const novedadesCats = cats.filter(
            (cat: CatData) => cat.adopterId && cat.adopterId.includes(userId)
          );
          setFilteredCats(notAdoptedCats);
          setNumNovedades(novedadesCats.length);
        }
      } catch (error) {
        console.error("Error fetching cats:", error);
      }
    };

    fetchCats();
  }, [cats]);

  const handleCatPress = async (cat: CatData) => {
    try {
      const owner = await getUserById(cat.ownerId);
      if (owner) {
        navigation.navigate("Adopter-Cat-Details", { cat, owner });
      }
    } catch (error) {
      console.error("Error fetching owner details:", error);
    }
  };

  const renderCustomMarker = (cat: CatData) => {
    if (!cat.adopted) {
      return (
        <Marker
          key={cat._id}
          coordinate={{ latitude: cat.lat, longitude: cat.lng }}
          onPress={() => handleCatPress(cat)}
        >
          <View
            className="items-center justify-center border-[#6EADE1] border-4 rounded-full"
            style={{ width: 70, height: 70, backgroundColor: "white" }}
          >
            <Image
              source={{ uri: cat.image }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
          </View>
        </Marker>
      );
    } else {
      return null;
    }
  };

  const handleLogout = async () => {
    logout();
    navigation.navigate("Login");
  };

  const handleNovedadesPress = () => {
    navigation.navigate("Adopter-Applications-Status");
  };

  return (
    <View className="flex-1 bg-white space-y-6 pt-14">
      <StatusBar style="dark" />

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
      <Animated.View
        className="flex-row justify-center items-center bg-gray-100 rounded-xl p-2 mb-8"
        style={{ alignSelf: "center" }}
        entering={FadeInUp.delay(400).duration(1000).springify()}
      >
        <Ionicons
          name="search-circle"
          size={24}
          color="#2B26AD"
          style={{ marginRight: 8 }}
        />
        <Text className="text-[#2B26AD] font-bold tracking-wider text-2xl">
          Gatitos Cercanos
        </Text>
      </Animated.View>

      <Animated.View
        className="self-center rounded-3xl border-[#6EADE1] border-4 overflow-hidden"
        entering={FadeInUp.delay(600).duration(1000).springify()}
        style={{
          width: wp(90),
          height: hp(55),
        }}
      >
        {region.latitude !== 0 && region.longitude !== 0 && (
          <ClusterMapView
            style={{ width: "100%", height: "100%" }}
            region={region}
            onRegionChangeComplete={setRegion}
            ref={mapRef}
            provider="google"
            zoomControlEnabled={true}
          >
            {myLocation && (
              <Marker
                coordinate={{
                  latitude: myLocation.latitude,
                  longitude: myLocation.longitude,
                }}
                pinColor="#FF0000"
                tracksViewChanges={false}
              />
            )}
            {filteredCats.map((cat) => renderCustomMarker(cat))}
          </ClusterMapView>
        )}
      </Animated.View>

      <Animated.View
        className="justify-end items-center mt-12"
        entering={FadeInUp.delay(800).duration(1000).springify()}
      >
        <View className="relative w-11/12 bg-[#6EADE1] rounded-3xl p-4 items-center justify-center h-24 ">
          <TouchableOpacity onPress={handleNovedadesPress}>
            <Text className="text-white text-4xl font-bold tracking-wider">
              Novedades
            </Text>
            <View className="absolute top-[-42] right-[-118] bg-[#2B26AD] rounded-full h-12 w-12 items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {numNovedades}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

export default AdopterMainScreen;
