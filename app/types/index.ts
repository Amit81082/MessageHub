import { Conversation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
  pending?: boolean;
  clientId?: string;
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
