import getConversations from "@/app/actions/getConversations";
import getUsers from "@/app/actions/getUsers";
import ConversationList from "./components/ConversationList";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, users] = await Promise.all([
    getConversations(),
    getUsers(),
  ]);
  return (
    <div className="h-full">
      <ConversationList users={users} initialItems={conversations} />
      {children}
    </div>
  );
}
