// create userLayout

import React from "react";
import getUsers from "../actions/getUsers";
import UserList from "./UserList";
import Sidebar from "../components/sidebar/Sidebar";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={Users} />
        {children}
      </div>
    </Sidebar>
  );
}
