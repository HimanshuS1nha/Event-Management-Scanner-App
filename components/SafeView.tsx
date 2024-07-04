import {
  SafeAreaView,
  Platform,
  StatusBar,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { memo } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const SafeView = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <>
      <SafeAreaView
        style={[
          {
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            backgroundColor: "#000",
            flex: 1,
          },
          style,
        ]}
      >
        {children}
      </SafeAreaView>
      <ExpoStatusBar style="light" />
    </>
  );
};

export default memo(SafeView);
