"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { User } from "@prisma/client";

import useOtherUser from "@/app/hooks/useOtherUser";

import { FullConversationType } from "@/app/types";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const router = useRouter();

  const session = useSession();

  const otherUser = useOtherUser(data);



  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [router, data.id]);

  const lastMessage = useMemo(() => {
    if (!data.messages?.length) {
      return null;
    }

    return data.messages[data.messages.length - 1];
  }, [data.messages]);

  const userEmail = session.data?.user?.email;

  const hasSeen = useMemo(() => {
    if (!lastMessage || !userEmail) {
      return false;
    }

    return lastMessage.seen.some((user: User) => user.email === userEmail);
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (!lastMessage) {
      return "Started a conversation";
    }

    if (lastMessage.image) {
      return "Sent an image";
    }

    return lastMessage.body;
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex
        w-full
        cursor-pointer
        items-center
        gap-3
        rounded-lg
        p-3
        transition
        hover:bg-neutral-100
        ${selected ? "bg-neutral-100" : "bg-white"}
      `}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}

      <div className="min-w-0 flex-1">
        <div
          className="
            mb-1
            flex
            items-center
            justify-between
          "
        >
          <p
            className="
              truncate
              font-medium
              text-gray-900
            "
          >
            {data.name || otherUser.name}
          </p>

          {lastMessage?.createdAt && (
            <span
              className="
                text-xs
                text-gray-400
              "
            >
              {format(new Date(lastMessage.createdAt), "p")}
            </span>
          )}
        </div>

        <p
          className={`
            truncate
            text-sm
            ${hasSeen ? "text-gray-500" : "font-semibold text-black"}
          `}
        >
          {lastMessageText}
        </p>
      </div>
    </div>
  );
};

export default ConversationBox;
