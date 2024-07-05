import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import SafeView from "@/components/SafeView";
import Title from "@/components/Title";
import LoadingModal from "@/components/LoadingModal";
import { useUser } from "@/hooks/useUser";
import { loginValidator } from "@/validators/login-validator";

const Login = () => {
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = useCallback(
    (type: "email" | "password", value: string) => {
      if (type === "email") {
        setEmail(value);
      } else if (type === "password") {
        setPassword(value);
      }
    },
    []
  );

  const changePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, [isPasswordVisible]);

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      const parsedData = await loginValidator.parseAsync({
        email,
        password,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/login/scanner`,
        {
          ...parsedData,
        }
      );

      return data;
    },
    onSuccess: async (data) => {
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.scanner));

      setUser(data.scanner);
      router.replace("/entry");
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response?.data.error);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });
  return (
    <SafeView>
      <LoadingModal isVisible={isPending} />

      <ImageBackground
        source={require("../assets/images/login-bg.webp")}
        style={tw`flex-1 items-center justify-center gap-y-12`}
      >
        <Title>Login as Scanner</Title>

        <View style={tw`gap-y-6 w-full items-center`}>
          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Email
            </Text>
            <TextInput
              style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
              placeholder="Enter your email"
              placeholderTextColor={"#fff"}
              value={email}
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>

          <View style={tw`gap-y-3 w-[80%]`}>
            <Text style={tw`text-white ml-1.5 font-medium text-base`}>
              Password
            </Text>
            <View>
              <TextInput
                style={tw`w-full border border-white px-4 py-3 rounded-lg text-white`}
                placeholder="Enter your password"
                placeholderTextColor={"#fff"}
                value={password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry={!isPasswordVisible}
              />
              <Pressable
                style={tw`absolute right-3 top-[30%]`}
                onPress={changePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <Entypo name="eye-with-line" size={24} color="white" />
                ) : (
                  <Entypo name="eye" size={24} color="white" />
                )}
              </Pressable>
            </View>
          </View>

          <Pressable
            style={tw`bg-violet-600 w-[80%] items-center py-3 justify-center rounded-lg`}
            onPress={() => handleLogin()}
            disabled={isPending}
          >
            <Text style={tw`text-white text-base font-semibold`}>Login</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeView>
  );
};

export default Login;
