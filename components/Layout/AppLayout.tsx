import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import {
  Menu,
  Bell,
  PanelLeft,
  Search,
  LogOut,
  User,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true); // Default to Dark as requested by user preference
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const getPageTitle = (path: string) => {
    const route = path.split("/")[1];
    if (!route) return "Dashboard";
    if (route === "traffic") return "Analytics";
    if (route === "funnel") return "Lifecycle";
    return route
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full overflow-x-hidden relative">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isMobile={isMobile}
        closeMobile={() => setMobileMenuOpen(false)}
      />

      <Sidebar
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        isMobile={true}
        closeMobile={() => setMobileMenuOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isMobile && sidebarOpen ? "ml-64" : !isMobile ? "ml-[70px]" : ""
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-4 flex-1">
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="-ml-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="-ml-2 text-muted-foreground hover:text-foreground"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {getPageTitle(location.pathname)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative mr-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-md border border-input bg-secondary px-9 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <div className="relative ml-2" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="h-9 w-9 rounded-full border border-border shadow-sm flex items-center justify-center bg-secondary hover:ring-2 ring-primary/30 transition-all overflow-hidden"
              >
                <div className="text-[10px] font-bold text-muted-foreground">
                  JD
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-11 w-56 bg-card border border-border shadow-xl rounded-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                  <div className="px-2 py-2 mb-1 border-b border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1 opacity-50">
                      Account
                    </p>
                    <div className="flex items-center gap-2.5 px-1">
                      <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                        JD
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate leading-none">
                          John Doe
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate mt-1">
                          john.doe@gmail.com
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors group">
                      <User className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="flex-1 text-left">View Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors group">
                      <Mail className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="flex-1 text-left">Settings</span>
                    </button>

                    <div className="my-1.5 border-t border-border" />

                    <button
                      onClick={() => window.location.reload()}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors group"
                    >
                      <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      <span className="font-medium flex-1 text-left">
                        Sign out
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-[1600px] space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
