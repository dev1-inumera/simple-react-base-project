
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/services/EmailService";
import { EmailStatsCard } from "@/components/dashboard/EmailStatsCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MousePointerClick as MousePointerClickIcon, RefreshCw } from "lucide-react";
import { format, subDays } from "date-fns";

interface CampaignEmailStatsProps {
  campaignId: string;
  showTitle?: boolean;
}

export const CampaignEmailStats: React.FC<CampaignEmailStatsProps> = ({
  campaignId,
  showTitle = true
}) => {
  const { toast } = useToast();
  const [statsData, setStatsData] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState<any>({
    totalSent: 0,
    totalDelivered: 0,
    totalOpens: 0,
    totalClicks: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  // Function to load the statistics
  const loadStats = async () => {
    if (!campaignId) return;
    
    try {
      setLoading(true);
      
      // Get time range in days
      const days = timeRange === "7d" ? 7 : 
                  timeRange === "14d" ? 14 : 
                  timeRange === "30d" ? 30 : 90;
      
      // Format dates for API
      const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
      const endDate = format(new Date(), 'yyyy-MM-dd');
      
      // Get campaign specific stats
      const statsData = await EmailService.getCampaignStats(campaignId, {
        startDate,
        endDate,
        aggregatedBy: "day"
      });
      
      setStatsData(statsData);
      
      // Calculate summary stats
      const summary = EmailService.calculateSummaryStats(statsData);
      setSummaryStats(summary);
      
      // Format data for charts
      const formattedData = EmailService.formatStatsForCharts(statsData);
      setChartData(formattedData);
      
    } catch (error: any) {
      console.error("Failed to load campaign stats:", error);
      toast({
        title: "Erreur de chargement des statistiques",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to load data when component mounts or campaign changes
  useEffect(() => {
    loadStats();
  }, [campaignId, timeRange]);

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Statistiques de la campagne</h2>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="14d">14 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">90 jours</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              size="icon"
              variant="outline"
              onClick={loadStats}
              title="Rafraîchir les données"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EmailStatsCard
          title="Emails Envoyés"
          description="Total des emails envoyés"
          value={summaryStats.totalSent}
          icon={<Mail className="h-4 w-4" />}
          loading={loading}
        />
        <EmailStatsCard
          title="Taux d'ouverture"
          description="Pourcentage d'emails ouverts"
          value={summaryStats.openRate.toFixed(1)}
          unit="%"
          loading={loading}
        />
        <EmailStatsCard
          title="Taux de clics"
          description="Pourcentage d'emails avec clics"
          value={summaryStats.clickRate.toFixed(1)}
          unit="%"
          icon={<MousePointerClickIcon className="h-4 w-4" />}
          loading={loading}
        />
        <EmailStatsCard
          title="Taux de rebond"
          description="Pourcentage d'emails non livrés"
          value={summaryStats.bounceRate.toFixed(1)}
          unit="%"
          loading={loading}
        />
      </div>
      
      <div className="mt-4">
        <ChartContainer className="h-64" config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end"
                tick={{ fontSize: 11 }}
                height={40}
              />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar name="Livrés" dataKey="delivered" fill="#10b981" />
              <Bar name="Ouvertures" dataKey="opens" fill="#3b82f6" />
              <Bar name="Clics" dataKey="clicks" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};
