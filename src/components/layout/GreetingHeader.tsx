import React from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Dropdown, type DropdownItem } from "@/components/ui/Dropdown";
import { cn } from "@/lib/utils";

import { AdminProfileModal } from "@/components/modals/AdminProfileModal";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";

export type GreetingHeaderProps = {
  userName: string;
  subtitle?: string;
  className?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  avatarSrc?: string;
};

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  userName,
  subtitle = "Let’s build your healthy routine today?",
  className,
  onProfileClick,
  onLogoutClick,
  avatarSrc = "/images/avatar.png",
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  const initials = userName
    .split(" ")
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const menuItems: DropdownItem[] = [
    {
      id: "profile",
      label: "Profile",
      onSelect: () => {
        setIsProfileModalOpen(true);
        onProfileClick?.();
      },
    },
    {
      id: "logout",
      label: "Logout",
      onSelect: () => {
        onLogoutClick?.();
      },
    },
  ];

  return (
    <>
      <div
        className={cn(
          "flex w-full items-center justify-between rounded-xl bg-(--color-dark-bg) px-6 py-4 text-white",
          className
        )}
      >
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold">Hi, {userName}</p>
          {subtitle ? (
            <p className="text-sm text-[color-mix(in_oklab,white_70%,transparent)]">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <NotificationDropdown />
          <Dropdown
            align="right"
            items={menuItems}
            trigger={
              <div className="flex items-center gap-2 rounded-xl bg-[color-mix(in_oklab,var(--color-dark-bg)_85%,white)] px-3 py-2">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={userName}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--color-dark-bg)_65%,white)] text-sm font-medium">
                    {initials || userName[0]?.toUpperCase()}
                  </div>
                )}
                <p className="text-sm font-medium">{userName}</p>
              </div>
            }
          />
        </div>
      </div>
      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default GreetingHeader;
