
import React, { useState, useEffect } from "react";
import { Users, FileText, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardStats } from "./components/DashboardStats";
import { PendingQuotes } from "./components/PendingQuotes";
import { RecentActivityList } from "./components/RecentActivity";

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

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        { count: usersCount },
        { count: quotesCount },
        { count: foldersCount },
        { data: pendingQuotesData },
        { data: recentActivityData }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("quotes").select("*", { count: "exact" }),
        supabase.from("folders").select("*", { count: "exact" }),
        supabase
          .from("quotes")
          .select(`
            id, 
            total_amount, 
            status, 
            created_at, 
            profiles:profiles(first_name, last_name)
          `)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("quotes")
          .select(`
            id, 
            total_amount, 
            status, 
            created_at, 
            profiles:profiles(first_name, last_name)
          `)
          .order("created_at", { ascending: false })
          .limit(10)
      ]);
      
      setStats([
        {
          title: "Utilisateurs",
          value: usersCount || 0,
          description: "Total des utilisateurs",
          icon: <Users className="h-8 w-8 text-blue-500" />,
        },
        {
          title: "Devis",
          value: quotesCount || 0,
          description: "Devis générés",
          icon: <FileText className="h-8 w-8 text-green-500" />,
        },
        {
          title: "Dossiers",
          value: foldersCount || 0,
          description: "Dossiers actifs",
          icon: <FolderOpen className="h-8 w-8 text-amber-500" />,
        },
      ]);
      
      // Add null checks and type safety for pendingQuotes
      setPendingQuotes((pendingQuotesData || []).map(quote => {
        const profiles = quote.profiles as { first_name?: string, last_name?: string } | null;
        return {
          ...quote,
          profiles: profiles || { first_name: "Agent", last_name: "" }
        };
      }));
      
      // Add null checks and type safety for recentActivity
      const activities = (recentActivityData || []).map(item => {
        const profiles = item.profiles as { first_name?: string, last_name?: string } | null;
        const firstName = profiles?.first_name || "Agent";
        const lastName = profiles?.last_name || "";
        
        return {
          id: item.id,
          type: "quote",
          name: `Devis #${item.id.substring(0, 8)} - ${firstName} ${lastName}`,
          date: item.created_at,
          status: item.status,
        };
      });
      
      setRecentActivity(activities);
    } catch (error) {
      console.error("Error loading admin dashboard data:", error);
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
  }, []);

  const handleQuoteStatusUpdate = async (quoteId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("quotes")
        .update({ status })
        .eq("id", quoteId);
      
      if (error) throw error;
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut du devis a été mis à jour.",
      });
      
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
      
      <DashboardStats stats={stats} loading={loading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingQuotes
          quotes={pendingQuotes}
          loading={loading}
          onStatusUpdate={handleQuoteStatusUpdate}
        />
        <RecentActivityList
          activities={recentActivity}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
