import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Location from "expo-location";
import Collapsible from "react-native-collapsible";
import { useNavigation } from "@react-navigation/native";
import { useCats } from "../context/CatContext";
import { CatData } from "../models/CatData";
import MapView, { Marker, Region } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeInUp } from "react-native-reanimated";

interface Location {
  latitude: number;
  longitude: number;
}

function OwnerNewReportScreen() {
  const navigation = useNavigation();
  const { createCat } = useCats();
  const [myLocation, setMyLocation] = useState<Location | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });
  const mapRef = useRef<MapView | null>(null);
  const [image, setImage] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"male" | "female">("male");
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [vaccine, setVaccine] = useState<string>("");
  const [care, setCare] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [castrated, setCastrated] = useState<"yes" | "no" | "">("");
  const [collapsibleOpen, setCollapsibleOpen] = useState<boolean>(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) {
          setOwnerId(id);
        }
      } catch (error) {
        console.error("Error al obtener el userId:", error);
      }
    };

    fetchOwnerId();
  }, []);

  const handleSelectType = (type: "male" | "female") => {
    setSelectedType(type);
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleAgeChange = (value: string) => {
    const newAge = value.replace(/[^0-9]/g, "");
    if (newAge === "" || (parseInt(newAge) >= 1 && parseInt(newAge) <= 15)) {
      setAge(newAge);
    }
  };

  const handleWeightChange = (itemValue: string) => {
    setSelectedWeight(itemValue);
  };

  const handleVaccineChange = (value: string) => {
    setVaccine(value);
  };

  const handleCareChange = (value: string) => {
    setCare(value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleCastratedSelect = (value: "yes" | "no") => {
    setCastrated(value);
  };

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return null;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      return { latitude, longitude };
    } catch (err) {
      console.warn(err);
      return null;
    }
  };

  const handleCollapsibleToggle = async () => {
    const location = await _getLocation();
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      setMyLocation(location);
      setCollapsibleOpen((prevOpen) => !prevOpen);
    } else {
      Alert.alert("Error", "No se pudo obtener la ubicación actual.");
    }
  };

  const handleMapTouch = () => {};

  const handleSubmit = async () => {
    if (!ownerId) {
      console.error("No se pudo obtener el userId");
      return;
    }
    if (
      !image ||
      !name ||
      !age ||
      !selectedWeight ||
      !vaccine ||
      !care ||
      !description ||
      !castrated
    ) {
      Alert.alert("Faltan Datos", "Por favor complete todos los campos");
      return;
    }

    const newCat: CatData = {
      image,
      name,
      age: parseInt(age),
      weight: selectedWeight,
      vaccinations: vaccine,
      specialCare: care,
      description,
      castrated: castrated || "no",
      sex: selectedType,
      ownerId: ownerId,
      lat: region.latitude,
      lng: region.longitude,
    };
    //console.log("Datos del formulario:", newCat);

    try {
      await createCat(newCat);
      Alert.alert("¡Éxito!", "El nuevo reporte se ha creado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al crear el reporte:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al crear el reporte. Inténtalo nuevamente."
      );
    }
  };

  return (
    <View className="flex-1 bg-white space-y-6 pt-14">
      <StatusBar style="dark" />
      <View className="mx-4 flex-row justify-between items-center mb-[-8] ">
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

        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleSubmit}>
            <FontAwesome6 name="shield-cat" size={36} color="#2B26AD" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleCollapsibleToggle}>
        <Animated.View
          className="bg-[#6EADE1] rounded-3xl w-[90%] self-center p-4 mt-12"
          entering={FadeInUp.delay(200).duration(1000).springify()}
        >
          <View className="flex-row justify-between items-center z-1">
            <Text className="text-white font-semi-bold text-xl">
              {collapsibleOpen ? "Cerrar mapa" : "Abrir mapa"}
            </Text>
            {collapsibleOpen ? (
              <Ionicons name="chevron-up" size={24} color="#2B26AD" />
            ) : (
              <Ionicons name="chevron-down" size={24} color="#2B26AD" />
            )}
          </View>
          <Collapsible collapsed={!collapsibleOpen}>
            <TouchableOpacity onPress={handleMapTouch} activeOpacity={1}>
              <View>
                <View className="flex-row items-center justify-between mt-4">
                  <Text className="text-white font-bold text-l">
                    Ubicación actual:
                  </Text>
                </View>
                <View
                  className="rounded-xl overflow-hidden mt-4"
                  style={{ width: "100%", height: 300 }}
                >
                  <MapView
                    style={{ width: "100%", height: "100%" }}
                    region={region}
                    onRegionChangeComplete={setRegion}
                    ref={mapRef}
                    provider="google"
                  >
                    <Marker
                      coordinate={
                        myLocation
                          ? {
                              latitude: myLocation.latitude,
                              longitude: myLocation.longitude,
                            }
                          : {
                              latitude: 0,
                              longitude: 0,
                            }
                      }
                    />
                  </MapView>
                </View>
              </View>
            </TouchableOpacity>
          </Collapsible>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={{ alignItems: "center", marginTop: 40, zIndex: 1 }}
        entering={FadeInUp.delay(400).duration(1000).springify()}
      >
        <TouchableOpacity>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 75,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
              marginBottom: -40,
              borderColor: "#6EADE1",
              borderWidth: 4,
              overflow: "hidden",
            }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 150, height: 150, borderRadius: 75 }}
              />
            ) : (
              <Text className="text-[#2B26AD] font-semi-bold text-xl">
                Foto Gatito
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        className="self-center rounded-3xl bg-gray-100 p-5"
        entering={FadeInUp.delay(600).duration(1000).springify()}
        style={{
          width: wp(90),
          maxWidth: 600,
        }}
      >
        <TextInput
          value={image}
          onChangeText={setImage}
          placeholder="Ingrese la URL de la imagen"
          className="bg-white text-center rounded-xl px-4 py-1 mt-8 mb-4"
        />

        <View className="self-center rounded-3xl bg-gray-100 flex-row justify-center gap-4">
          <TouchableOpacity
            onPress={() => handleSelectType("male")}
            style={{
              backgroundColor: selectedType === "male" ? "#4195D9" : "white",
              borderRadius: 10,
              padding: 4,
            }}
            className="rounded-lg p-2 w-20 items-center"
          >
            <Text className="text-[#2B26AD] font-semi-bold text-xl">Macho</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelectType("female")}
            style={{
              backgroundColor: selectedType === "female" ? "#FDB4CB" : "white",
              borderRadius: 10,
              padding: 4,
            }}
            className="rounded-lg p-2 w-20 items-center"
          >
            <Text className="text-[#2B26AD] font-semi-bold text-xl">
              Hembra
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-4">
          <Text className="text-[#2B26AD] font-semibold text-xl">Nombre:</Text>
          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder="Ingrese el nombre"
            maxLength={10}
            className="bg-white rounded-xl px-4 py-1 ml-2 flex-grow"
          />
        </View>

        <View className="flex-row items-center mt-4">
          <Text className="text-[#2B26AD] font-semibold text-xl">
            Edad Aprox.:
          </Text>
          <TextInput
            value={age}
            onChangeText={handleAgeChange}
            placeholder="Ingrese la edad"
            keyboardType="numeric"
            className="bg-white rounded-xl px-4 py-1 ml-2 flex-grow"
          />
        </View>

        <View className="flex-row items-center mt-4">
          <Text className="text-[#2B26AD] font-semibold text-xl mr-2">
            Peso Aprox.:
          </Text>
          <Picker
            selectedValue={selectedWeight}
            style={{
              height: 20,
              width: 210,
              backgroundColor: "white",
              borderRadius: 20,
            }}
            onValueChange={(itemValue: string) => handleWeightChange(itemValue)}
          >
            <Picker.Item label="Seleccione el peso" value="" />
            <Picker.Item
              label="Peso pequeño: Menor a 3 kg"
              value="Menor a 3 kg"
            />
            <Picker.Item
              label="Peso Mediano: de 3 kg a 5 kg"
              value="3 kg a 5 kg"
            />
            <Picker.Item
              label="Peso Grande: Mayor a 5 kg"
              value="Mayor a 5 kg"
            />
          </Picker>
        </View>

        <View className="flex-row items-center mt-4">
          <Text className="text-[#2B26AD] font-semibold text-xl">Vacunas:</Text>
          <TextInput
            value={vaccine}
            onChangeText={handleVaccineChange}
            placeholder="Ingrese las vacunas"
            className="bg-white rounded-xl px-4 py-1 ml-2"
            multiline={true}
            style={{ flex: 1, maxWidth: "90%" }}
          />
        </View>

        <View className="flex-row items-center mt-4">
          <View>
            <Text className="text-[#2B26AD] font-semibold text-xl">
              Cuidados
            </Text>
            <Text className="text-[#2B26AD] font-semibold text-xl">
              Especiales:
            </Text>
          </View>
          <TextInput
            value={care}
            onChangeText={handleCareChange}
            placeholder="Ingrese los cuidados"
            className="bg-white rounded-xl px-4 py-1 ml-2"
            multiline={true}
            style={{ flex: 1, maxWidth: "90%" }}
          />
        </View>

        <View className="flex-row items-center mt-4">
          <Text className="text-[#2B26AD] font-semibold text-xl">
            Descripción:
          </Text>
          <TextInput
            value={description}
            onChangeText={handleDescriptionChange}
            placeholder="Describa el gatito"
            className="bg-white rounded-xl px-4 py-1 ml-2"
            multiline={true}
            style={{ flex: 1, maxWidth: "90%" }}
          />
        </View>

        <View className="flex-row items-center mt-4 gap-2">
          <Text className="text-[#2B26AD] font-semibold text-xl">
            Esterilizado/a?
          </Text>
          <TouchableOpacity
            onPress={() => handleCastratedSelect("yes")}
            style={{
              backgroundColor: castrated === "yes" ? "#D0E6A5" : "white",
              borderRadius: 10,
              padding: 2,
              width: 30,
              alignItems: "center",
            }}
            className="rounded-lg p-2 w-24 items-center"
          >
            <Text className="text-[#2B26AD] font-semi-bold text-xl">Sí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCastratedSelect("no")}
            style={{
              backgroundColor: castrated === "no" ? "#F67A7A" : "white",
              borderRadius: 10,
              padding: 2,
              width: 30,
              alignItems: "center",
            }}
            className="rounded-lg p-2 w-24 items-center"
          >
            <Text className="text-[#2B26AD] font-semi-bold text-xl">No</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

export default OwnerNewReportScreen;
