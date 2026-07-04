import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";

import EmptyState from "@/app/components/EmptyState";
import ClientConversation from "./components/ClientConversation";
import getCurrentUser from "@/app/actions/getCurrentUser";


interface IParams {
  conversationId: string;
}

const ConversationIdPage = async ({ params }: { params: IParams }) => {
  const [conversation, currentUser, messages] = await Promise.all([
    getConversationById(params?.conversationId),
    getCurrentUser(),
    getMessages(params?.conversationId),
  ]);


  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <ClientConversation
        conversation={conversation}
        messages={messages}
        currentUser={currentUser!}
      />
    </div>
  );
};

export default ConversationIdPage;
