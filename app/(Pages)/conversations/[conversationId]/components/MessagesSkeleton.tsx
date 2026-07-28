const MessagesSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className={`flex ${
            index % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`
              animate-pulse
              rounded-2xl
              bg-neutral-200
              h-12
              ${index % 2 === 0 ? "w-48 rounded-bl-sm" : "w-40 rounded-br-sm"}
            `}
          />
        </div>
      ))}
    </div>
  );
};

export default MessagesSkeleton;
