"use client";

import { create } from "zustand";

interface ConversationOpeningStore {
  isOpening: boolean;
  setOpening: (value: boolean) => void;
}

const useConversationOpening = create<ConversationOpeningStore>((set) => ({
  isOpening: false,

  setOpening: (value) =>
    set({
      isOpening: value,
    }),
}));

export default useConversationOpening;
