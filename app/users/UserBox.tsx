"use client";

import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Avatar from "../components/Avatar";
import clsx from "clsx";
import LoadingModal from "../components/LoadingModal";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/conversations", {
        userId: data?.id,
      });

      router.push(`/conversations/${response?.data?.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [data.id, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className={clsx(
          `flex items-center space-x-3 relative bg-white gap-3 w-full p-3 rounded-lg transition cursor-pointer hover:bg-neutral-100`,
          isLoading && "opacity-50",
        )}
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <span className=" truncate text-sm font-medium text-gray-900">
                {data.name}
              </span>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default UserBox;
