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
import Slider from "@react-native-community/slider";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";
import { useUser } from "@/hooks/useUser";
import { EntrantType, useEntrant } from "@/hooks/useEntrant";

const Home = () => {
  const { handleLogout } = useUser();
  const { setValues } = useEntrant();

  const [scanned, setScanned] = useState(false);
  const [type, setType] = useState<string>("entry");
  const [zoom, setZoom] = useState(0);
  const [color, setColor] = useState<"white" | "black">("white");

  const changeType = useCallback((value: string) => {
    setType(value);
  }, []);

  const changeZoom = useCallback((value: number) => {
    setZoom(value);
  }, []);

  const changeColor = useCallback(
    (value: "white" | "black") => setColor(value),
    []
  );

  const { mutate: handleUserEntry, isPending } = useMutation({
    mutationKey: [`user-${type}`],
    mutationFn: async (id: string) => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        throw new Error("Authenication failed. Please login again!");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/user-${type}`,
        { id, token }
      );

      return data as { user: EntrantType; isSuccess: boolean };
    },
    onSuccess: (data) => {
      setValues(data.user, data.isSuccess, type);
      router.push("/result");
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

  const onBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      setScanned(true);
      handleUserEntry(result.data);
    },
    [scanned]
  );
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

      <View style={tw`items-center gap-y-4 mb-5 w-full -mt-6`}>
        <View style={tw`border border-white rounded-lg w-[70%]`}>
          <Picker
            onValueChange={changeType}
            selectedValue={type}
            dropdownIconColor={"#fff"}
            dropdownIconRippleColor={"#000"}
            onFocus={() => changeColor("black")}
            onBlur={() => changeColor("white")}
          >
            <Picker.Item
              label="Entry"
              value={"entry"}
              style={tw`text-${color}`}
            />
            <Picker.Item
              label="Exit"
              value={"exit"}
              style={tw`text-${color}`}
            />
          </Picker>
        </View>
        <Text style={tw`text-white font-semibold text-lg`}>
          {scanned ? "Not scanning" : "Scanning..."}
        </Text>
      </View>

      <CameraView
        style={tw`h-[60%] justify-center items-center`}
        zoom={zoom}
        facing="back"
        onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
      >
        <View style={tw`w-68 h-68 items-center justify-center`}>
          <View
            style={tw`border-l-4 border-t-4 border-white w-12 h-12 absolute top-0 left-0`}
          ></View>
          <View
            style={tw`border-r-4 border-t-4 border-white w-12 h-12 absolute top-0 right-0`}
          ></View>
          <View
            style={tw`border-r-4 border-b-4 border-white w-12 h-12 absolute bottom-0 right-0`}
          ></View>
          <View
            style={tw`border-l-4 border-b-4 border-white w-12 h-12 absolute bottom-0 left-0`}
          ></View>
        </View>
        <View style={tw`absolute bottom-3 w-full items-center`}>
          <Slider
            style={tw`w-[80%]`}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#2563eb"
            maximumTrackTintColor="#ffffff"
            value={zoom}
            onValueChange={changeZoom}
          />
        </View>
      </CameraView>

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

export default Home;
