import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { UserRole } from "@/types";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  FolderOpen,
  FileText,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AppSidebar: React.FC = () => {
  const { auth, hasRole, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès."
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = React.useMemo(() => {
    const items = [
      {
        title: "Tableau de bord",
        path: "/dashboard",
        icon: LayoutDashboard,
        roles: [UserRole.CLIENT, UserRole.AGENT, UserRole.ADMIN],
      },
      {
        title: "Marketplace",
        path: "/marketplace",
        icon: Store,
        roles: [UserRole.CLIENT, UserRole.AGENT, UserRole.ADMIN],
      },
      {
        title: "Panier",
        path: "/cart",
        icon: ShoppingCart,
        roles: [UserRole.CLIENT, UserRole.AGENT],
      },
      {
        title: "Dossiers",
        path: "/folders",
        icon: FolderOpen,
        roles: [UserRole.CLIENT, UserRole.AGENT, UserRole.ADMIN],
      },
      {
        title: "Mon Devis",
        path: "/quotes",
        icon: FileText,
        roles: [UserRole.CLIENT, UserRole.AGENT, UserRole.ADMIN],
      },
      {
        title: "Clients",
        path: "/clients",
        icon: Users,
        roles: [UserRole.AGENT, UserRole.ADMIN],
      },
    ];

    return items.filter(item => 
      auth.user && item.roles.includes(auth.user.role)
    );
  }, [auth.user]);

  if (!auth.user) return null;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[#9b87f5]">i-numa</h1>
          <SidebarTrigger className="h-6 w-6" />
        </div>
        {auth.user && (
          <div className="mt-4 text-sm opacity-70">
            <p className="font-medium truncate">{auth.user.firstName} {auth.user.lastName}</p>
            <p className="text-xs text-muted-foreground capitalize">{auth.user.role}</p>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Paramètres">
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Déconnexion">
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
