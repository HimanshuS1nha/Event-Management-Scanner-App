import { View, Text, Pressable, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, BarcodeScanningResult } from "expo-camera";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import { useUser } from "@/hooks/useUser";

const Entry = () => {
  const isFocused = useIsFocused();
  const { handleLogout } = useUser();

  const [scanned, setScanned] = useState(false);

  const onBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      setScanned(true);
      handleUserEntry(result.data);
    },
    [scanned]
  );

  const { mutate: handleUserEntry, isPending } = useMutation({
    mutationKey: ["user-entry"],
    mutationFn: async (id: string) => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/user-entry`
      );

      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response?.data.error);
      } else if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });
  return (
    <SafeView style={tw`justify-center`}>
      <LoadingModal isVisible={isPending} />
      <View style={tw`absolute w-full items-end top-[8%] right-3`}>
        <Pressable
          onPress={() => {
            Alert.alert("Warning", "Do you want to logout?", [
              {
                text: "No",
              },
              {
                text: "Yes",
                onPress: async () => {
                  await handleLogout();
                  router.replace("/login");
                },
              },
            ]);
          }}
        >
          <MaterialCommunityIcons name="logout" size={27} color="white" />
        </Pressable>
      </View>

      <View style={tw`items-center mb-5`}>
        <Text style={tw`text-white font-semibold text-lg`}>
          {scanned ? "Not scanning" : "Scanning..."}
        </Text>
      </View>

      {isFocused && (
        <CameraView
          style={tw`h-[70%]`}
          facing="back"
          onBarcodeScanned={onBarcodeScanned}
        ></CameraView>
      )}

      <View style={tw`items-center mt-6`}>
        {scanned && (
          <Pressable
            onPress={() => setScanned(false)}
            style={tw`items-center py-3 bg-blue-600 px-6 rounded-full`}
            disabled={!scanned}
          >
            <Text style={tw`text-white text-base font-medium`}>Scan Again</Text>
          </Pressable>
        )}
      </View>
    </SafeView>
  );
};

export default Entry;
