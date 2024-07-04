import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MainLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderColor: "#6b7280",
        },
      }}
      initialRouteName="entry"
    >
      <Tabs.Screen
        name="entry"
        options={{
          title: "Entry",
          tabBarIcon: ({ size, color }) => {
            return (
              <MaterialCommunityIcons
                name="location-enter"
                size={size}
                color={color}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="exit"
        options={{
          title: "Exit",
          tabBarIcon: ({ size, color }) => {
            return (
              <MaterialCommunityIcons
                name="exit-run"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
