import { View, Text, Pressable, Alert } from "react-native";
import React, { useCallback, useState } from "react";
import tw from "twrnc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, BarcodeScanningResult } from "expo-camera";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Picker } from "@react-native-picker/picker";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import { useUser } from "@/hooks/useUser";

const CameraComponent = () => {
  const { handleLogout } = useUser();

  const [scanned, setScanned] = useState(false);
  const [type, setType] = useState<string>("entry");

  const changeType = useCallback((value: string) => {
    setType(value);
  }, []);

  const onBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      setScanned(true);
      handleUserEntry(result.data);
    },
    [scanned]
  );

  const { mutate: handleUserEntry, isPending } = useMutation({
    mutationKey: [`user-${type}`],
    mutationFn: async (id: string) => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/user-${type}`
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

      <View style={tw`items-center gap-y-4 mb-5 w-full`}>
        <View style={tw`border border-white rounded-lg w-[70%]`}>
          <Picker
            onValueChange={changeType}
            selectedValue={type}
            dropdownIconColor={"#fff"}
            dropdownIconRippleColor={"#000"}
          >
            <Picker.Item label="Entry" value={"entry"} style={tw`text-white`} />
            <Picker.Item label="Exit" value={"exit"} style={tw`text-white`} />
          </Picker>
        </View>
        <Text style={tw`text-white font-semibold text-lg`}>
          {scanned ? "Not scanning" : "Scanning..."}
        </Text>
      </View>

      <CameraView
        style={tw`h-[60%]`}
        facing="back"
        onBarcodeScanned={onBarcodeScanned}
      ></CameraView>

      <View style={tw`items-center absolute bottom-5 w-full`}>
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

export default CameraComponent;
