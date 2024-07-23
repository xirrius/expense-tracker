import { create } from "zustand";

export interface Store {
  loggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
}

const useStore = create<Store>((set) => ({
  loggedIn: false,
  logIn: () => set({ loggedIn: true }),
  logOut: () => set({ loggedIn: false }),
}));

export default useStore
