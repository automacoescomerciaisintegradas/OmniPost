import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Link } from "react-router-dom";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className={"flex flex-col min-h-screen" + (className ? ` ${className}` : "")}>
        <div className="absolute left-2 top-2 z-20">
          <SidebarTrigger />
        </div>
        <main className="flex-grow">
          {container ? (
            <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12" + (contentClassName ? ` ${contentClassName}` : "")}>{children}</div>
          ) : (
            children
          )}
        </main>
        <footer className="border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <h3 className="font-semibold">OmniPost AI</h3>
                <p className="text-sm text-muted-foreground">Your API solution for all social media platforms.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Links</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                  <li><Link to="/profiles" className="hover:text-foreground">Manage Profiles</Link></li>
                  <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                  <li><Link to="/api-keys" className="hover:text-foreground">API Keys</Link></li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Support</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><Link to="/help" className="hover:text-foreground">Help</Link></li>
                  <li><Link to="/docs" className="hover:text-foreground">Documentation</Link></li>
                  <li><a href="mailto:support@omnipost.ai" className="hover:text-foreground">Contact Us</a></li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Account</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><Link to="/account" className="hover:text-foreground">My Profile</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} OmniPost AI - All rights reserved.</p>
              <p className="mt-1">Built with ❤️ at Cloudflare</p>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}