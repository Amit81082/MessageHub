"use client";

import { create } from "zustand";
import { FullConversationType } from "@/app/types";

interface ConversationStore {
  conversations: FullConversationType[];

  setConversations: (conversations: FullConversationType[]) => void;

  updateConversation: (conversation: FullConversationType) => void;

  addConversation: (conversation: FullConversationType) => void;

  removeConversation: (conversationId: string) => void;
}

const useConversationStore = create<ConversationStore>((set) => ({
  conversations: [],

  setConversations: (conversations) => set({ conversations }),

  updateConversation: (conversation) =>
    set((state) => ({
      conversations: state.conversations.map((item) => {
        if (item.id !== conversation.id) {
          return item;
        }

        return {
          ...item,
          ...conversation,
        };
      }),
    })),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  removeConversation: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.filter(
        (item) => item.id !== conversationId,
      ),
    })),
}));

export default useConversationStore;
