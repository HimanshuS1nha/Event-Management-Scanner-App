import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

type UserType = {
  email: string;
};

type UseUserType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

export const useUser = create<UseUserType>((set) => ({
  user: SecureStore.getItem("user")
    ? JSON.parse(SecureStore.getItem("user") as string)
    : null,
  setUser: (user) => {
    set({ user });
  },
}));
