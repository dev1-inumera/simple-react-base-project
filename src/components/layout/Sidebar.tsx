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
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  FolderOpen,
  FileText,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AppSidebar: React.FC = () => {
  const { auth, hasRole, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
        title: "Devis",
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
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <h1 className={cn("text-2xl font-bold text-primary", isCollapsed && "hidden")}>i-numa</h1>
          <SidebarTrigger className="hover:bg-accent/5 transition-colors duration-200" />
        </div>
        {auth.user && (
          <div className={cn("mt-4 text-sm smooth-transition", isCollapsed && "hidden")}>
            <p className="font-medium">{auth.user.firstName} {auth.user.lastName}</p>
            <p className="text-xs text-muted-foreground capitalize">{auth.user.role}</p>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    className={cn(
                      "sidebar-item",
                      isActive(item.path) && "active"
                    )}
                  >
                    <Link to={item.path} className="group">
                      <item.icon className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                      )} />
                      <span className="transition-colors">{item.title}</span>
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
            <SidebarMenuButton 
              asChild 
              tooltip="Paramètres"
              isActive={isActive("/settings")}
              className={cn(
                "sidebar-item",
                isActive("/settings") && "active"
              )}
            >
              <Link to="/settings" className="group">
                <Settings className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="transition-colors">Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              tooltip="Déconnexion"
              className="sidebar-item group"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="transition-colors">Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
