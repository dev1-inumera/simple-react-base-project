
import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col text-left">
        <TopBar />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="p-4 md:p-6 w-full text-left">
            {children}
          </SidebarInset>
        </div>
      </div>
      <Toaster />
      <Sonner />
    </SidebarProvider>
  );
};
