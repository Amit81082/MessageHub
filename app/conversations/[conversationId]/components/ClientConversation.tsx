"use client";

import { useState } from "react";

import Header from "./Header";
import Body from "./Body";
import MessageForm from "./MessageForm";
import { ConversationHeaderType, FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

interface ClientConversationProps {
  conversation: ConversationHeaderType;
  messages: FullMessageType[];
  currentUser: User;
}

const ClientConversation: React.FC<ClientConversationProps> = ({
  conversation,
  messages,
  currentUser,
}) => {
  const [allMessages, setAllMessages] = useState(messages);

  return (
    <div className="h-full flex flex-col">
      <Header conversation={conversation} />

      <Body messages={allMessages} setMessages={setAllMessages} />

      <MessageForm setMessages={setAllMessages} currentUser={currentUser} />
    </div>
  );
};

export default ClientConversation;
