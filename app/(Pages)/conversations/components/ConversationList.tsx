"use client";

import { useState, useMemo, useEffect } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";

import useConversation from "@/app/hooks/useConversation";
import clsx from "clsx";

import { FullConversationType } from "@/app/types";
import { User } from "@prisma/client";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import useConversationStore from "@/app/hooks/useConversationStore";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[]
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems, users
}) => {
  const { conversationId, isOpen } = useConversation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    conversations,
    setConversations,
  } = useConversationStore();

  useEffect(() => {
    if (conversations.length === 0) {
      setConversations(initialItems);
    }
  }, [conversations.length, initialItems, setConversations]);


  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
          isOpen ? "hidden" : "block w-full left-0",
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {conversations.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
