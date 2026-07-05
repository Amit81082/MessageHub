"use client";

import { useRef, useState, useEffect } from "react";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";
import axios from "axios";
import {find} from "lodash";
import { pusherClient } from "@/app/libs/pusherClient";


interface BodyProps {
  messages: FullMessageType[];
  setMessages: React.Dispatch<React.SetStateAction<FullMessageType[]>>;
}

const Body: React.FC<BodyProps> = ({ messages, setMessages }) => {
  const { conversationId } = useConversation();
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        // Already received
        if (find(current, { id: message.id })) {
          return current;
        }

        // Find matching temporary message
        const tempIndex = current.findIndex(
          (m) => m.pending && m.clientId === message.clientId,
        );

        if (tempIndex !== -1) {
          const updated = [...current];
          updated[tempIndex] = message;
          return updated;
        }

        return [...current, message];
      });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);



  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <MessageBox
          key={message.id}
          data={message}
          isLast={message.id === messages[messages.length - 1]?.id}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default Body;
