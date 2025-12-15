import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type SidebarItem = {
  id: string;
  label: string;
  href?: string;
  iconSrc: string;
};

export type SidebarProps = {
  activeId?: string;
  onItemSelect?: (id: string) => void;
  onLogout?: () => void;
  className?: string;
};

const mainItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", iconSrc: "/icons/home-2.svg" },
  { id: "customers", label: "Customers", href: "/customers", iconSrc: "/icons/profile-add.svg" },
  { id: "professionals", label: "Professionals", href: "/professionals", iconSrc: "/icons/task.svg" },
  { id: "categories", label: "Categories", href: "/categories", iconSrc: "/icons/note.svg" },
  { id: "appointments", label: "Appointments", href: "/appointments", iconSrc: "/icons/task.svg" },
  { id: "promotions", label: "Promotions", href: "/promotions", iconSrc: "/icons/message-edit.svg" },
  { id: "transactions", label: "Transactions", href: "/transactions", iconSrc: "/icons/money-send.svg" },
  { id: "support", label: "Support", href: "/support", iconSrc: "/icons/message-edit.svg" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeId = "appointments",
  onItemSelect,
  onLogout,
  className,
}) => {
  const renderItem = (item: SidebarItem) => {
    const isActive = item.id === activeId;
    const content = (
      <div
        className={cn(
          "flex items-center gap-3 rounded-full px-4 py-2 text-sm transition-colors",
          isActive
            ? "bg-[#13000A] text-white"
            : "text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-muted)_60%,transparent)]"
        )}
      >
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-full border", isActive ? "border-transparent" : "border-[color-mix(in_oklab,var(--color-muted)_75%,transparent)]")}>
          <Image
            src={item.iconSrc}
            alt={item.label}
            width={16}
            height={16}
            className="h-4 w-4"
          />
        </span>
        <span>{item.label}</span>
      </div>
    );

    if (item.href) {
      return (
        <Link
          key={item.id}
          href={item.href}
          onClick={() => onItemSelect?.(item.id)}
          className="block"
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onItemSelect?.(item.id)}
        className="block w-full text-left"
      >
        {content}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-60 flex-col border-r border-(--color-sidebar-border) bg-(--color-sidebar) px-4 py-6",
        className
      )}
    >
      <div className="mb-8 px-2 w-full justify-center items-center flex">
        <Image
          src="/icons/Lisa.svg"
          alt="Lisa logo"
          width={96}
          height={32}
          className="h-8 w-auto"
        />
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {mainItems.map((item) => renderItem(item))}
      </nav>
      <button
        type="button"
        onClick={onLogout}
        className="mt-6 flex items-center gap-3 px-4 py-2 text-sm text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] hover:text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--color-muted)_75%,transparent)]">
          <Image
            src="/icons/logout.svg"
            alt="Log Out"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        </span>
        <span>Log Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
