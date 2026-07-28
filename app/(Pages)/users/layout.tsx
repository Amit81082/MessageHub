// create userLayout

import React from "react";
import getUsers from "@/app/actions/getUsers";
import Sidebar from "@/app/components/sidebar/Sidebar";
import getConversationLookup from "@/app/actions/getConversationLookup";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [users, conversations] = await Promise.all([
    getUsers(),
    getConversationLookup(),
  ]);
  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} conversations={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
