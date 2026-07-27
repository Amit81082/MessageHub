"use client";
import Link from "next/link";
import {  useState } from "react";

import { HiChevronLeft } from "react-icons/hi2";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import OnlineStatus from "./OnlineStatus";

import { User } from "@prisma/client";

import useOtherUser from "@/app/hooks/useOtherUser";

import Avatar from "@/app/components/Avatar";
import { ConversationHeaderType } from "@/app/types";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";

interface HeaderProps {
  conversation: ConversationHeaderType;
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);
  

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
        bg-white
        w-full
        flex
        border-b
        sm:px-4
        py-3
        px-4
        lg:px-6
        justify-between
        items-center
      "
      >
        <div className="flex gap-3 items-center">
          <Link
            href="/conversations"
            className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <OnlineStatus conversation={conversation} otherUser={otherUser} />
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="text-sky-500 hover:text-sky-600 transition cursor-pointer"
        />
      </div>{" "}
    </>
  );
};;

export default Header;
