import { Text, View } from "react-native";
import { useEffect } from "react";
import { router, useRootNavigationState } from "expo-router";

import { useUser } from "@/hooks/useUser";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const { user } = useUser();

  useEffect(() => {
    if (rootNavigationState?.key) {
      if (user) {
        router.replace("/entry");
      } else {
        router.replace("/login");
      }
    }
  }, [rootNavigationState?.key, user]);
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
