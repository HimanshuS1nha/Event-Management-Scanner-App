import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

type UseUserType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  handleLogout: () => Promise<void>;
};

export const useUser = create<UseUserType>((set) => ({
  isLoggedIn: SecureStore.getItem("is-logged-in") ? true : false,
  setIsLoggedIn: (isLoggedIn) => {
    set({ isLoggedIn });
  },
  handleLogout: async () => {
    await SecureStore.deleteItemAsync("is-logged-in");
    set({ isLoggedIn: false });
  },
}));
