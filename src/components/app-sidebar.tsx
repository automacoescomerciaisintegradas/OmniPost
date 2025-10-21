import React from "react";
import { LayoutDashboard, Users, KeyRound, DollarSign, User, BotMessageSquare, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/app-store";
const menuItems = [
  { path: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { path: "/profiles", icon: <Users />, label: "Manage Profiles" },
  { path: "/api-keys", icon: <KeyRound />, label: "API Keys" },
  { path: "/pricing", icon: <DollarSign />, label: "Pricing" },
  { path: "/account", icon: <User />, label: "My Account" },
];
export function AppSidebar(): JSX.Element {
  const logout = useAppStore(s => s.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <NavLink to="/" className="flex items-center gap-2 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold font-display tracking-tight">OmniPost AI</span>
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink to={item.path} className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }>
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-4 text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} OmniPost AI</div>
      </SidebarFooter>
    </Sidebar>
  );
}