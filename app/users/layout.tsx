// create userLayout

import React from "react";
import getUsers from "../actions/getUsers";
import getConversationLookup from "../actions/getConversationLookup";
import UserList from "./UserList";
import Sidebar from "../components/sidebar/Sidebar";

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
