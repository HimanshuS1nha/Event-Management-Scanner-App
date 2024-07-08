import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { router, useLocalSearchParams } from "expo-router";

import SafeView from "@/components/SafeView";
import { useEntrant } from "@/hooks/useEntrant";

const Result = () => {
  const { entrant, isSuccess, setValues, type } = useEntrant();

  const image = isSuccess
    ? require("../assets/images/check.png")
    : require("../assets/images/cross.png");

  const handleBack = useCallback(() => {
    setValues(null, null, null);
    router.back();
  }, []);
  return (
    <SafeView>
      <View style={tw`flex-1 items-center justify-center gap-y-16`}>
        <View style={tw`gap-y-5 items-center`}>
          <Image source={image as any} style={tw`w-24 h-24 rounded-full`} />
          <Text
            style={tw`${
              isSuccess ? "text-green-600" : "text-rose-600"
            } font-semibold text-xl`}
          >
            {isSuccess
              ? type === "entry"
                ? "Entry successful"
                : "Exit successful"
              : type === "entry"
              ? "User has already entered"
              : "User has not entered yet"}
          </Text>
        </View>

        <View style={tw`bg-white items-center py-7 w-[70%] rounded-lg gap-y-5`}>
          <Image
            source={{ uri: entrant?.image }}
            style={tw`w-32 h-32 rounded-full`}
          />

          <View style={tw`gap-y-3 px-5 w-full`}>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-base font-medium text-gray-700`}>Name:</Text>
              <Text style={tw`text-base font-semibold`}>Random User</Text>
            </View>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-base font-medium text-gray-700`}>
                Branch:
              </Text>
              <Text style={tw`text-base font-semibold`}>CSE</Text>
            </View>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-base font-medium text-gray-700`}>Year:</Text>
              <Text style={tw`text-base font-semibold`}>3rd</Text>
            </View>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-base font-medium text-gray-700`}>
                Roll Number:
              </Text>
              <Text style={tw`text-base font-semibold`}>123456</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={tw`items-center py-3 bg-blue-600 px-6 rounded-full`}
          onPress={handleBack}
        >
          <Text style={tw`text-white text-base font-medium`}>Go Back</Text>
        </Pressable>
      </View>
    </SafeView>
  );
};

export default Result;
