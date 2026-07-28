import MessagesSkeleton from "./components/MessagesSkeleton";

export default function Loading() {
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <div className="h-20 border-b bg-white animate-pulse" />

        <MessagesSkeleton />

        <div className="border-t p-4 bg-white">
          <div className="h-12 rounded-full bg-neutral-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
