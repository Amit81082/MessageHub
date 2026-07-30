"use client";

import { useState, useCallback, memo } from "react";

import Header from "./Header";
import Body from "./Body";
import MessageForm from "./MessageForm";
import { ConversationHeaderType, FullMessageType } from "@/app/types";
import { User } from "@prisma/client";
import { useEffect } from "react";
import useConversationOpening from "@/app/hooks/useConversationOpening";

interface ClientConversationProps {
  conversation: ConversationHeaderType;
  messages: FullMessageType[];
  currentUser: User;
}

const MemoizedMessageForm = memo(MessageForm);

const ClientConversation: React.FC<ClientConversationProps> = ({
  conversation,
  messages,
  currentUser,
}) => {
  const [allMessages, setAllMessages] = useState(messages);
  const { setOpening } = useConversationOpening();

  const handleSetMessages = useCallback<typeof setAllMessages>((updater) => {
    setAllMessages(updater);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${conversation.id}`);

        const latestMessages = await response.json();

        setAllMessages(latestMessages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [conversation.id]);

  useEffect(() => {
    setOpening(false);
  }, [setOpening]);

  return (
    <div className="h-full flex flex-col">
      <Header conversation={conversation} />

      <Body messages={allMessages} setMessages={handleSetMessages} />

      <MemoizedMessageForm
        setMessages={handleSetMessages}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ClientConversation;
