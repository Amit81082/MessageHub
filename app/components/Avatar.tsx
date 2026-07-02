import Image from "next/image";

import { User } from "@prisma/client";
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
  user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;
  return (
    <div className="relative inline-block">
      <div
        className="
          relative
          h-9
          w-9
          overflow-hidden
          rounded-full
          bg-gray-100
        "
      >
        <Image
          fill
          src={user?.image || "/images/placeholder.jpg"}
          alt="Avatar"
          className="object-cover"
        />
      </div>

      {isActive ? (
        <span
          className="
          absolute
          bottom-0
          right-0
          block
          h-2
          w-2
          rounded-full
          bg-green-500
          ring-2
          ring-white
        "
        />
      ) : null}
    </div>
  );
};

export default Avatar;
