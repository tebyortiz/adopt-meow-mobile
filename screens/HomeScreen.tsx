import { View, Text, Image } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

function HomeScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;
    setTimeout(
      () => (ring1padding.value = withSpring(ring1padding.value + hp(5))),
      100
    );
    setTimeout(
      () => (ring2padding.value = withSpring(ring2padding.value + hp(5.5))),
      300
    );

    setTimeout(() => navigation.navigate("Login"), 3000);
  }, []);

  return (
    <View className="flex-1 justify-center items-center space-y-10 bg-blue-500">
      <StatusBar style="light" />

      <Animated.View
        className="bg-white/20 rounded-full"
        style={{ padding: ring2padding }}
      >
        <Animated.View
          className="bg-white/20 rounded-full"
          style={{ padding: ring1padding }}
        >
          <View
            style={{
              width: hp(20),
              height: hp(20),
              borderRadius: hp(10),
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/images/adopt1.png")}
              style={{
                width: "90%",
                height: "90%",
                resizeMode: "contain",
              }}
            />
          </View>
        </Animated.View>
      </Animated.View>

      <View className="flex items-center space-y-2">
        <Text
          style={{ fontSize: hp(5) }}
          className="font-bold text-white tracking-widest"
        >
          ADOPT-MEow
        </Text>

        <Text
          style={{ fontSize: hp(3) }}
          className="font-small text-white tracking-widest"
        >
          Gatitos en busca de hogar
        </Text>
      </View>
    </View>
  );
}

export default HomeScreen;
