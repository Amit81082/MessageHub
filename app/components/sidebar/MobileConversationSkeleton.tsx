"use client";

import useConversationOpening from "@/app/hooks/useConversationOpening";

export default function MobileConversationSkeleton() {
  const { isOpening } = useConversationOpening();

  if (!isOpening) return null;

  return (
    <div className="fixed inset-0 z-999 bg-white lg:hidden">
      {/* Header */}
      <div className="h-16 border-b flex items-center px-4">
        <div className="h-10 w-10 rounded-full bg-neutral-200 animate-pulse" />
        <div className="ml-3 space-y-2">
          <div className="h-4 w-32 rounded bg-neutral-200 animate-pulse" />
          <div className="h-3 w-20 rounded bg-neutral-200 animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 ? "justify-end" : "justify-start"}`}
          >
            <div className="h-10 w-40 rounded-2xl bg-neutral-200 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="absolute bottom-0 w-full border-t bg-white p-4">
        <div className="h-12 rounded-full bg-neutral-200 animate-pulse" />
      </div>
    </div>
  );
}
