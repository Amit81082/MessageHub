"use client";

import { useRef, useState, useEffect } from "react";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";
import axios from "axios";
import {find} from "lodash";
import { pusherClient } from "@/app/libs/pusherClient";


interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const { conversationId } = useConversation();
  const [messages, setMessages] = useState(initialMessages);
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
        if (find(current, { id: message.id })) {
          return current;
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
