
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Users, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardStats } from "./components/DashboardStats";

interface DashboardStat {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

interface RecentActivity {
  id: string;
  type: string;
  name: string;
  date: string;
  status?: string;
}

const AgentDashboard: React.FC = () => {
  const { toast } = useToast();
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!auth.user) return;

    try {
      setLoading(true);
      
      // Fetch counts for dashboard stats
      const [
        { count: foldersCount },
        { count: quotesCount },
        { count: clientsCount },
        { data: pendingQuotesData },
        { data: recentFoldersData },
        { data: recentQuotesData }
      ] = await Promise.all([
        supabase
          .from("folders")
          .select("*", { count: "exact" })
          .eq("agent_id", auth.user.id),
        supabase
          .from("quotes")
          .select("*", { count: "exact" })
          .eq("agent_id", auth.user.id),
        supabase
          .from("folders")
          .select("client_id", { count: "exact", head: true })
          .eq("agent_id", auth.user.id),
        supabase
          .from("quotes")
          .select(`
            id,
            total_amount,
            status,
            created_at,
            client_id,
            profiles:profiles(first_name, last_name)
          `)
          .eq("agent_id", auth.user.id)
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("folders")
          .select(`
            *,
            profiles:profiles(first_name, last_name)
          `)
          .eq("agent_id", auth.user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("quotes")
          .select(`
            id,
            total_amount,
            status,
            created_at,
            client_id,
            profiles:profiles(first_name, last_name)
          `)
          .eq("agent_id", auth.user.id)
          .order("created_at", { ascending: false })
          .limit(5)
      ]);
      
      // Set dashboard stats
      setStats([
        {
          title: "Dossiers",
          value: foldersCount || 0,
          description: "Dossiers créés",
          icon: <FolderOpen className="h-8 w-8 text-blue-500" />,
        },
        {
          title: "Devis",
          value: quotesCount || 0,
          description: "Devis générés",
          icon: <FileText className="h-8 w-8 text-green-500" />,
        },
        {
          title: "Clients",
          value: clientsCount || 0,
          description: "Clients actifs",
          icon: <Users className="h-8 w-8 text-amber-500" />,
        },
      ]);
      
      // Set pending quotes with type safety
      setPendingQuotes((pendingQuotesData || []).map(quote => {
        const profiles = quote.profiles as { first_name?: string, last_name?: string } | null;
        return {
          ...quote,
          profiles: profiles || { first_name: "Client", last_name: "" }
        };
      }));
      
      // Transform recent activity, safely handling potentially missing data
      const folderActivities = (recentFoldersData || []).map(folder => {
        const profiles = folder.profiles as { first_name?: string, last_name?: string } | null;
        const firstName = profiles?.first_name || "Client";
        const lastName = profiles?.last_name || "";
        
        return {
          id: folder.id,
          type: "folder",
          name: `Dossier: ${folder.name} - ${firstName} ${lastName}`,
          date: folder.created_at,
        };
      });
      
      const quoteActivities = (recentQuotesData || []).map(quote => {
        const profiles = quote.profiles as { first_name?: string, last_name?: string } | null;
        const firstName = profiles?.first_name || "Client";
        const lastName = profiles?.last_name || "";
        
        return {
          id: quote.id,
          type: "quote",
          name: `Devis #${quote.id.substring(0, 8)} - ${firstName} ${lastName}`,
          date: quote.created_at,
          status: quote.status,
        };
      });
      
      const combinedActivities = [...folderActivities, ...quoteActivities]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
      
      setRecentActivity(combinedActivities);
    } catch (error) {
      console.error("Error loading agent dashboard data:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données du tableau de bord.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [auth.user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord agent</h1>
      
      <DashboardStats stats={stats} loading={loading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Devis à envoyer</CardTitle>
            <CardDescription>
              Devis approuvés prêts à être envoyés aux clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-2 border-b">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-36"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : pendingQuotes.length > 0 ? (
              <div className="space-y-4">
                {pendingQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <p className="font-medium">Devis #{quote.id.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {quote.profiles?.first_name || "Client"} {quote.profiles?.last_name || ""} - {Number(quote.total_amount).toFixed(2)} €
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/quotes`)}
                    >
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Aucun devis à envoyer</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>
              Vos dernières activités sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-2 border-b">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-48"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                    {activity.type === "quote" && activity.status && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : activity.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : activity.status === "sent"
                            ? "bg-purple-100 text-purple-800"
                            : activity.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {activity.status === "pending"
                          ? "En attente"
                          : activity.status === "approved"
                          ? "Approuvé"
                          : activity.status === "sent"
                          ? "Envoyé"
                          : activity.status === "accepted"
                          ? "Accepté"
                          : activity.status === "rejected"
                          ? "Rejeté"
                          : activity.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Aucune activité récente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;
