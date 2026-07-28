"use client";

import EmptyState from "@/app/components/EmptyState";
import useConversationOpening from "@/app/hooks/useConversationOpening";
import MessagesSkeleton from "../../conversations/[conversationId]/components/MessagesSkeleton";

const RightPanel = () => {
  const { isOpening } = useConversationOpening();

  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      {isOpening ? (
        <div className="h-full flex flex-col">
          {/* header */}
          <div className="h-16 border-b flex items-center px-4">
            <div className="h-10 w-10 rounded-full bg-neutral-200 animate-pulse" />
            <div className="ml-3 space-y-2">
              <div className="h-4 w-32 rounded bg-neutral-200 animate-pulse" />
              <div className="h-3 w-20 rounded bg-neutral-200 animate-pulse" />
            </div>
          </div>

          <MessagesSkeleton />

          <div className="border-t p-4 bg-white">
            <div className="h-12 rounded-full bg-neutral-200 animate-pulse" />
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default RightPanel;
