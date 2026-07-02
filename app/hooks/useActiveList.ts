"use client";

import { create } from "zustand";

interface ActiveListStore {
  members: string[];

  set: (members: string[]) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
}

const useActiveList = create<ActiveListStore>((set) => ({
  members: [],

  set: (members) =>
    set({
      members,
    }),

  add: (id) =>
    set((state) => ({
      members: [...state.members, id],
    })),

  remove: (id) =>
    set((state) => ({
      members: state.members.filter((member) => member !== id),
    })),
}));

export default useActiveList;
