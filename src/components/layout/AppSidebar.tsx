
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
  LogOut,
  Star
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
    <Sidebar variant="sidebar" collapsible="icon" className="bg-gradient-to-br from-[#272C57] to-[#1a1f3e] text-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <h1 className={cn("text-2xl font-bold text-[#bb0c19]", isCollapsed && "hidden")}>i-numa</h1>
          <SidebarTrigger className="text-white hover:bg-white/10 transition-colors duration-200" />
        </div>
        {auth.user && (
          <div className={cn("mt-4 text-sm smooth-transition", isCollapsed && "hidden")}>
            <p className="font-medium">{auth.user.firstName} {auth.user.lastName}</p>
            <p className="text-xs text-white/70 capitalize">{auth.user.role}</p>
          </div>
        )}

        {/* Visual accent element */}
        <div className={cn("w-24 h-1 bg-gradient-to-r from-[#bb0c19] to-[#6e5494] rounded-full my-4", isCollapsed && "hidden")} />
      </SidebarHeader>
      
      <SidebarContent className="relative overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#bb0c19]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl" />
        
        {/* Enhanced floating elements */}
        <div className="absolute top-10 right-10 text-white/10 animate-pulse z-0">
          <Star size={20} />
        </div>
        <div className="absolute bottom-10 left-10 text-white/10 animate-pulse z-0" style={{ animationDelay: '1.5s' }}>
          <Star size={14} />
        </div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 right-0 w-16 h-16 border border-white/5 rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-10 h-10 border border-white/5 rounded-full" />
        
        <SidebarGroup className="relative z-10">
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    className={cn(
                      "transition-all duration-200 hover:bg-white/10",
                      isActive(item.path) ? "bg-white/20 text-white font-medium" : "text-white/80"
                    )}
                  >
                    <Link to={item.path} className="group">
                      <item.icon className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive(item.path) ? "text-[#bb0c19]" : "text-white/80"
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

      <SidebarFooter className="p-4 relative z-10 border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip="Paramètres"
              isActive={isActive("/settings")}
              className={cn(
                "transition-all duration-200 hover:bg-white/10",
                isActive("/settings") ? "bg-white/20 text-white font-medium" : "text-white/80"
              )}
            >
              <Link to="/settings" className="group">
                <Settings className={cn(
                  "h-4 w-4 transition-transform group-hover:scale-110",
                  isActive("/settings") ? "text-[#bb0c19]" : "text-white/80"
                )} />
                <span className="transition-colors">Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              tooltip="Déconnexion"
              className="transition-all duration-200 group text-white/80 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-[#bb0c19]" />
              <span className="transition-colors">Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Stats section at the bottom - shown only in expanded state */}
      {!isCollapsed && (
        <div className="px-4 pb-4 relative z-10">
          <div className="grid grid-cols-2 gap-4 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="text-center">
              <p className="text-lg font-bold text-[#bb0c19]">24/7</p>
              <p className="text-xs text-white/70">Support</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#bb0c19]">500+</p>
              <p className="text-xs text-white/70">Projets</p>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
};
