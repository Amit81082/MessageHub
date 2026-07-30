"use client";

import { useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { clsx } from "clsx";

interface DesktopItemProps {
  label: string;
  icon: IconType;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
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
    <li onClick={handleClick}>
      <div
        className={clsx(
          `
            group
            flex
            gap-x-3
            rounded-md
            p-3
            text-sm
            leading-6
            font-semibold
            cursor-pointer
            transition
          `,
          active
            ? "bg-gray-100 text-gray-500"
            : "text-gray-500 hover:text-black hover:bg-gray-100",
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />

        <span className="sr-only">{label}</span>
      </div>
    </li>
  );
};

export default DesktopItem;
