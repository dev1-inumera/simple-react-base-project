import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, UserRole } from "@/types";
import { format } from "date-fns";
import { FolderOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface FolderCardProps {
  folder: Folder;
  onSelect: (folder: Folder) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, onSelect }) => {
  const { auth, hasRole } = useAuth();
  const isAdmin = hasRole(UserRole.ADMIN);
  const isAgent = hasRole(UserRole.AGENT) && !isAdmin;
  
  const [clientName, setClientName] = useState<string>("");
  const [agentName, setAgentName] = useState<string>("");
  
  const formattedDate = folder.createdAt ? format(new Date(folder.createdAt), 'dd/MM/yyyy') : '';

  useEffect(() => {
    if ((isAdmin || isAgent) && folder.clientId) {
      fetchUserName(folder.clientId, "client");
    }
    
    if (isAdmin && folder.agentId) {
      fetchUserName(folder.agentId, "agent");
    }
  }, [folder, isAdmin, isAgent]);
  
  const fetchUserName = async (userId: string, userType: "client" | "agent") => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      
      const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
      if (userType === "client") {
        setClientName(fullName || "Client");
      } else {
        setAgentName(fullName || "Agent");
      }
    } catch (error) {
      console.error(`Error fetching ${userType} name:`, error);
      if (userType === "client") {
        setClientName("Client");
      } else {
        setAgentName("Agent");
      }
    }
  };
  
  return (
    <Card 
      className="elevated-card cursor-pointer interactive-element"
      onClick={() => onSelect(folder)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="glass-panel p-2 rounded-full mr-3">
              <FolderOpen className="text-primary h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{folder.name}</h3>
              <p className="text-sm text-muted-foreground">Créé le {formattedDate}</p>
              
              {/* Show client name for admin and agents */}
              {(isAdmin || isAgent) && clientName && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Client:</span> {clientName}
                </p>
              )}
              
              {/* Show agent name for admin */}
              {isAdmin && agentName && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Agent:</span> {agentName}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderCard;
