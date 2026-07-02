import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { FullConversationType } from "../types";


const useOtherUser = (conversation: FullConversationType) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const users = conversation.users.filter(
      (user) => user.email !== currentUserEmail,
    );

    return users[0] as User;
  }, [session.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
