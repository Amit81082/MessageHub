"use client";

import axios from "axios";
import clsx from "clsx";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { format } from "date-fns";

import { FullMessageType } from "@/app/types";
import Avatar from "@/app/components/Avatar";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session.data?.user?.email === data.sender.email;

  const seenList = useMemo(() => {
    const seenUsers = data.seen.filter(
      (user) => user.email !== session.data?.user?.email,
    );

    return seenUsers.map((user) => user.name).join(", ");
  }, [data.seen, session.data?.user?.email]);

  return (
    <div className={clsx("flex gap-3 p-4", isOwn && "justify-end")}>
      <div className={clsx(isOwn && "order-2")}>
        <Avatar user={data.sender} />
      </div>

      <div className={clsx("flex flex-col gap-2", isOwn && "items-end")}>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">{data.sender.name}</div>

          <div className="text-xs text-gray-400 font-light">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>

        <div
          className={clsx(
            "overflow-hidden rounded-lg text-sm w-fit max-w-[80%] sm:max-w-md wrap-break-word",
            isOwn ? "bg-sky-500 text-white" : "bg-gray-100 text-black",
            data.image ? "rounded-md p-0" : "px-3 py-2 rounded-full",
          )}
        >
          <ImageModal
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            src={data?.image}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              src={data.image}
              alt="Image"
              width={288}
              height={288}
              className="
                object-cover
                cursor-pointer
                hover:scale-110
                transition
              "
            />
          ) : (
            <div className="break-all whitespace-pre-wrap">
              {data.body}
            </div>
          )}
        </div>

        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
                text-xs
                text-gray-500
              "
          >
            Seen by {seenList}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
