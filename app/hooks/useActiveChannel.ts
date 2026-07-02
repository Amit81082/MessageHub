"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Members } from "pusher-js";

import { pusherClient } from "../libs/pusherClient";
import useActiveList from "./useActiveList";

const useActiveChannel = () => {
  const { status } = useSession();

  const { add, remove, set } = useActiveList();

  useEffect(() => {
    // Wait until NextAuth has finished authenticating
    if (status !== "authenticated") {
      return;
    }

    const channel = pusherClient.subscribe("presence-messenger");

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      members.each((member: any) => {
        initialMembers.push(member.id);
      });

      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: any) => {
      add(member.id);
    });

    channel.bind("pusher:member_removed", (member: any) => {
      remove(member.id);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("presence-messenger");
    };
  }, [status, add, remove, set]);
};

export default useActiveChannel;
