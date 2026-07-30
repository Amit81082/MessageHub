"use client";

import { useRouter } from "next/navigation";
import { IconType } from "react-icons";
import clsx from "clsx";

interface MobileItemProps {
  href: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const router = useRouter();
   const handleClick = () => {
     if (onClick) {
       return onClick();
     }

     if (href) {
       router.push(href);
     }
   };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
          group
          flex
          gap-x-3
          text-sm
          leading-6
          font-semibold
          w-full
          justify-center
          p-4
          text-gray-500
          hover:text-black
          hover:bg-gray-100
        `,
        active && "bg-gray-100 text-black",
      )}
    >
      <Icon className="h-6 w-6" />
    </div>
  );
};

export default MobileItem;
