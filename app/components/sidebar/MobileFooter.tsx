"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import { useState } from "react";

import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";
import { User } from "@prisma/client";

interface MobileFooterProps {
  currentUser: User;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <>
      <SettingsModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        currentUser={currentUser}
      />
      <div
        className="
        fixed
        bottom-0
        z-40
        flex
        w-full
        justify-between
        border-t
        bg-white
        lg:hidden
      "
      >
        {routes.map((route) => (
          <MobileItem
            key={route.label}
            href={route.href}
            icon={route.icon}
            active={route.active}
            onClick={route.onClick}
          />
        ))}
        <div
          onClick={() => setIsOpenModal(true)}
          className=" flex items-center justify-center px-5 cursor-pointer "
        >
          <Avatar user={currentUser} />
        </div>
      </div>
    </>
  );
};

export default MobileFooter;
