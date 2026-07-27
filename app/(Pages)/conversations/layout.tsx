import getConversations from "@/app/actions/getConversations";
import getUsers from "@/app/actions/getUsers";
import Sidebar from "@/app/components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const conversations = await getConversations();
  // const users = await getUsers();

  const [conversations, users] = await Promise.all([
    getConversations(),
    getUsers(),
  ]);

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList users={users} initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
