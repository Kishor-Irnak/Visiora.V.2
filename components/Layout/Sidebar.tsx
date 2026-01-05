import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Tag,
  Archive,
  Truck,
  ShoppingBag,
  Globe,
  BarChart2,
  Ticket,
  Settings,
  HelpCircle,
  Circle,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
  closeMobile: () => void;
}

const NAV_GROUPS = [
  {
    title: "",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Lifecycle", href: "/funnel", icon: BarChart2 },
      { label: "Analytics", href: "/traffic", icon: Globe },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Orders", href: "/orders", icon: ShoppingCart },
      { label: "Inventory", href: "/inventory", icon: Archive },
      { label: "Products", href: "/products", icon: Tag },
      { label: "Customers", href: "/customers", icon: Users },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Fulfillment", href: "/fulfillment", icon: Truck },
      { label: "Carts", href: "/abandoned-carts", icon: ShoppingBag },
      { label: "Discounts", href: "/discounts", icon: Ticket },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  isMobile,
  closeMobile,
}) => {
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out border-r border-sidebar-border
    ${
      isMobile
        ? isOpen
          ? "w-64 translate-x-0 shadow-xl"
          : "w-64 -translate-x-full"
        : isOpen
        ? "w-64 translate-x-0"
        : "w-[70px] translate-x-0"
    }
  `;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Brand */}
        <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5 font-semibold text-base overflow-hidden whitespace-nowrap">
            <div className="flex items-center justify-center shrink-0">
              <Circle className="h-5 w-5 fill-current text-primary" />
            </div>
            {(isOpen || isMobile) && (
              <span className="tracking-tight">Visiora</span>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-none">
          {NAV_GROUPS.map((group, index) => (
            <div key={index} className="mb-5">
              {group.title && (isOpen || isMobile) && (
                <h4 className="mb-2 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  {group.title}
                </h4>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={isMobile ? closeMobile : undefined}
                    className={({ isActive }) => `
                      flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150
                      ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      }
                      ${!isOpen && !isMobile ? "justify-center px-2" : ""}
                    `}
                    title={!isOpen && !isMobile ? item.label : undefined}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {(isOpen || isMobile) && <span>{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer - Settings & Help */}
        <div className="mt-auto border-t border-sidebar-border p-2">
          <div className="space-y-0.5">
            <NavLink
              to="/settings"
              className={({ isActive }) => `
                flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }
                ${!isOpen && !isMobile ? "justify-center px-2" : ""}
              `}
              title={!isOpen && !isMobile ? "Settings" : undefined}
            >
              <Settings className="h-[18px] w-[18px] shrink-0" />
              {(isOpen || isMobile) && <span>Settings</span>}
            </NavLink>

            <button
              onClick={() => {
                // Placeholder for help functionality
                console.log("Get Help clicked");
              }}
              className={`
                w-full flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150
                text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground
                ${!isOpen && !isMobile ? "justify-center px-2" : ""}
              `}
              title={!isOpen && !isMobile ? "Get Help" : undefined}
            >
              <HelpCircle className="h-[18px] w-[18px] shrink-0" />
              {(isOpen || isMobile) && <span>Get Help</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
