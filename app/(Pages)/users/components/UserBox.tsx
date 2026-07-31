"use client";

import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import clsx from "clsx";
import { useEffect } from "react";
import Avatar from "@/app/components/Avatar";
import useConversationOpening from "@/app/hooks/useConversationOpening";

type ConversationLookup = {
  id: string;
  userIds: string[];
  isGroup: boolean;
};

interface UserBoxProps {
  data: User;
  conversations: ConversationLookup[];
}

const UserBox: React.FC<UserBoxProps> = ({ data, conversations }) => {
  const router = useRouter();
  const { setOpening } = useConversationOpening();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setOpening(true);
    const existingConversation = conversations.find(
      (conversation) =>
        !conversation.isGroup && conversation.userIds.includes(data.id),
    );

    if (existingConversation) {
      router.push(`/conversations/${existingConversation.id}`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/conversations", {
        userId: data.id,
      });

      router.push(`/conversations/${response.data.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [data.id, conversations, router]);

  return (
    <>
      <div
        onClick={handleClick}
        className={clsx(
          "flex items-center space-x-3 relative bg-white gap-3 w-full p-3 rounded-lg transition cursor-pointer hover:bg-neutral-100",
          isLoading && "opacity-50 pointer-events-none",
        )}
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="truncate text-sm font-medium text-gray-900">
                {data.name}
              </span>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default UserBox;
