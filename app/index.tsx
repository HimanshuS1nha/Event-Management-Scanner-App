import { Text, View } from "react-native";
import { useEffect } from "react";
import { router, useRootNavigationState } from "expo-router";

import { useUser } from "@/hooks/useUser";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (rootNavigationState?.key) {
      if (isLoggedIn) {
        router.replace("/entry");
      } else {
        router.replace("/login");
      }
    }
  }, [rootNavigationState?.key]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
