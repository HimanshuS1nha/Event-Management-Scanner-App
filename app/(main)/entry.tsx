import { View, Text, Pressable } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";

import SafeView from "@/components/SafeView";
import LoadingModal from "@/components/LoadingModal";

const Entry = () => {
  const isFocused = useIsFocused();

  const [scanned, setScanned] = useState(false);

  const handleLogout = useCallback(async () => {}, []);
  return (
    <SafeView style={tw`justify-center`}>
      <View style={tw`absolute w-full items-end top-[8%] right-3`}>
        <Pressable onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={27} color="white" />
        </Pressable>
      </View>

      <View style={tw`items-center mb-5`}>
        <Text style={tw`text-white font-semibold text-lg`}>
          {scanned ? "Not scanning" : "Scanning..."}
        </Text>
      </View>

      {isFocused && <CameraView style={tw`h-[70%]`} facing="back"></CameraView>}

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
