"use client";

import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusherClient";
import { useRouter } from "next/navigation";
import { find } from "lodash";

import useConversation from "@/app/hooks/useConversation";
import useConversationStore from "@/app/hooks/useConversationStore";
import { FullConversationType } from "@/app/types";

const GlobalConversationSync = () => {
  const session = useSession();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const router = useRouter();

  const { conversationId } = useConversation();

  const {
    conversations,
    addConversation,
    updateConversation,
    removeConversation,
  } = useConversationStore();

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      if (find(conversations, { id: conversation.id })) {
        return;
      }

      addConversation(conversation);
    };

    const updateHandler = (conversation: FullConversationType) => {
      updateConversation(conversation);
    };

    const removeHandler = (conversation: FullConversationType) => {
      removeConversation(conversation.id);

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);

      pusherClient.unsubscribe(pusherKey);
    };
  }, [pusherKey, conversationId, conversations, addConversation, updateConversation, removeConversation, router]);

  return null;
};

export default GlobalConversationSync;
