"use client";

import { useMemo } from "react";
import { User } from "@prisma/client";

import useActiveList from "@/app/hooks/useActiveList";
import { ConversationHeaderType } from "@/app/types";

interface OnlineStatusProps {
  conversation: ConversationHeaderType;
  otherUser: User;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({
  conversation,
  otherUser,
}) => {
  const { members } = useActiveList();

  const isActive = members.includes(otherUser.email!);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation.isGroup, conversation.users.length, isActive]);

  return (
    <div className="text-xs font-light text-neutral-500">{statusText}</div>
  );
};

export default OnlineStatus;
