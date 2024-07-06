import {
  Text,
  Image,
  ActivityIndicator,
  Alert,
  BackHandler,
  Linking,
} from "react-native";
import { useEffect } from "react";
import { router, useRootNavigationState } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import tw from "twrnc";

import SafeView from "@/components/SafeView";
import { useUser } from "@/hooks/useUser";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const { isLoggedIn } = useUser();
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (rootNavigationState?.key) {
      if (isLoggedIn) {
        if (permission?.granted) {
          router.replace("/entry");
        } else if (permission?.canAskAgain) {
          requestPermission();
        } else {
          Alert.alert(
            "Error",
            "This app needs the camera permission to operate",
            [
              {
                text: "Cancel",
                onPress: BackHandler.exitApp,
              },
              {
                text: "Open Settings",
                onPress: Linking.openSettings,
              },
            ]
          );
        }
      } else {
      }
    }
  }, [rootNavigationState?.key, permission?.granted]);
  return (
    <SafeView style={tw`justify-center items-center gap-y-7`}>
      <Image
        source={require("../assets/images/logo.webp")}
        style={tw`w-32 h-32 rounded-full`}
      />
      <Text style={tw`text-white text-2xl font-medium`}>
        Event Management Head App
      </Text>

      <ActivityIndicator size={45} color={"violet"} />
    </SafeView>
  );
}
