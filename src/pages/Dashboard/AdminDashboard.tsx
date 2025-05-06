
import React, { useState, useEffect } from "react";
import { Users, FileText, FolderOpen, Mail, BarChart2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardStats } from "./components/DashboardStats";
import { PendingQuotes } from "./components/PendingQuotes";
import { RecentActivityList } from "./components/RecentActivity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { EmailService } from "@/services/EmailService";

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
  const [emailStats, setEmailStats] = useState({
    totalSent: 0,
    openRate: 0,
    clickRate: 0
  });
  const [emailStatsLoading, setEmailStatsLoading] = useState(true);

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

  const loadEmailStats = async () => {
    try {
      setEmailStatsLoading(true);
      
      // Get last 30 days stats
      const stats = await EmailService.getStats({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      });
      
      // Calculate summary
      const summary = EmailService.calculateSummaryStats(stats);
      
      setEmailStats({
        totalSent: summary.totalSent,
        openRate: Number(summary.openRate.toFixed(1)),
        clickRate: Number(summary.clickRate.toFixed(1))
      });
    } catch (error) {
      console.error("Error loading email stats:", error);
      // Don't show toast here, as the error might be due to SendGrid API key not being set up yet
    } finally {
      setEmailStatsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadEmailStats();
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Statistiques des Emails</CardTitle>
            <CardDescription>Aperçu des performances emails des 30 derniers jours</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/email-stats" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Voir les statistiques détaillées</span>
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Emails Envoyés</h3>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {emailStatsLoading ? "..." : emailStats.totalSent}
              </p>
              <span className="text-xs text-muted-foreground mt-1">
                Sur les 30 derniers jours
              </span>
            </div>
            
            <div className="flex flex-col p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Taux d'ouverture</h3>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {emailStatsLoading ? "..." : `${emailStats.openRate}%`}
              </p>
              <span className="text-xs text-muted-foreground mt-1">
                Moyenne sur 30 jours
              </span>
            </div>
            
            <div className="flex flex-col p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Taux de clics</h3>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {emailStatsLoading ? "..." : `${emailStats.clickRate}%`}
              </p>
              <span className="text-xs text-muted-foreground mt-1">
                Moyenne sur 30 jours
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
