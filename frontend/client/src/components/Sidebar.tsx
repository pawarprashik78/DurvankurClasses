import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  DollarSign,
  BookOpen,
  MessageSquare,
  ClipboardList,
  TrendingUp,
  ChevronLeft,
  LogOut,
  Trophy,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NotificationBell } from "@/components/NotificationBell";
import { logout } from "@/lib/api";

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout(); // clears JWT + all localStorage
  };

  const navItems = [
    { path: "/dashboard",    label: "Dashboard",     icon: LayoutDashboard, roles: ["admin", "teacher", "parent", "student"] },
    { path: "/attendance",   label: "Attendance",     icon: ClipboardCheck,  roles: ["admin", "teacher", "parent", "student"] },
    { path: "/marks",        label: "Marks",          icon: FileText,        roles: ["admin", "teacher", "parent", "student"] },
    { path: "/test-results", label: "Test Results",   icon: GraduationCap,   roles: ["parent", "student"] },
    { path: "/fees",         label: "Fees",           icon: DollarSign,      roles: ["admin", "teacher", "parent"] },
    { path: "/tests",        label: "Tests",          icon: ClipboardList,   roles: ["admin", "teacher", "student"] },
    { path: "/progress",     label: "Progress",       icon: TrendingUp,      roles: ["admin", "teacher", "parent", "student"] },
    { path: "/notes",        label: "Study Notes",    icon: BookOpen,        roles: ["admin", "teacher", "parent", "student"] },
    { path: "/achievements", label: "Achievements",   icon: Trophy,          roles: ["admin", "teacher", "parent", "student"] },
    { path: "/messages",     label: "Messages",       icon: MessageSquare,   roles: ["admin", "teacher", "parent"] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const isActive = (path: string) => location === path;

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 bg-card border-r border-border transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sm text-foreground capitalize">{role} Portal</h2>
              <p className="text-xs text-muted-foreground">Manage your activities</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-muted"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={cn(
                    "w-full transition-all duration-200",
                    collapsed ? "justify-center px-2" : "justify-start"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn("w-5 h-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          {(role === "parent" || role === "student") && !collapsed && (
            <div className="px-2 pb-2">
              <NotificationBell />
            </div>
          )}
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200 text-destructive hover:text-destructive hover:bg-destructive/10",
              collapsed ? "justify-center px-2" : "justify-start"
            )}
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className={cn("w-5 h-5", !collapsed && "mr-3")} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
