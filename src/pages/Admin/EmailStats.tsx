
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmailService, EmailStats, EmailActivity } from "@/services/EmailService";
import { EmailStatsCard, EmailChartCard } from "@/components/dashboard/EmailStatsCard";
import { EmailActivityTable } from "@/components/dashboard/EmailActivityTable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns";
import { fr } from 'date-fns/locale';
import { Mail, Calendar as CalendarIcon, BarChart2, PieChart, RefreshCw } from "lucide-react";

const EmailStats: React.FC = () => {
  const { toast } = useToast();
  const [statsData, setStatsData] = useState<EmailStats[]>([]);
  const [activityData, setActivityData] = useState<EmailActivity[]>([]);
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
  const [activityLoading, setActivityLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [aggregation, setAggregation] = useState<"day" | "week" | "month">("day");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Function to load the statistics
  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Format dates for API
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
      
      // Get email stats
      const statsData = await EmailService.getStats({
        startDate,
        endDate,
        aggregatedBy: aggregation
      });
      
      setStatsData(statsData);
      
      // Calculate summary stats
      const summary = EmailService.calculateSummaryStats(statsData);
      setSummaryStats(summary);
      
      // Format data for charts
      const formattedData = EmailService.formatStatsForCharts(statsData);
      setChartData(formattedData);
      
    } catch (error: any) {
      console.error("Failed to load stats:", error);
      toast({
        title: "Erreur de chargement des statistiques",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to load email activity
  const loadActivity = async () => {
    try {
      setActivityLoading(true);
      
      const { messages } = await EmailService.getEmailActivity({
        limit: 20
      });
      
      setActivityData(messages);
      
    } catch (error: any) {
      console.error("Failed to load email activity:", error);
      toast({
        title: "Erreur de chargement de l'activité des emails",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActivityLoading(false);
    }
  };
  
  // Helper functions to handle preset date ranges
  const handleTimeRangeChange = (range: string) => {
    const now = new Date();
    let from = now;
    
    switch (range) {
      case "7d":
        from = subDays(now, 7);
        setAggregation("day");
        break;
      case "30d":
        from = subDays(now, 30);
        setAggregation("day");
        break;
      case "90d":
        from = subDays(now, 90);
        setAggregation("week");
        break;
      case "6m":
        from = subMonths(now, 6);
        setAggregation("week");
        break;
      case "1y":
        from = subMonths(now, 12);
        setAggregation("month");
        break;
      default:
        from = subDays(now, 30);
    }
    
    setTimeRange(range);
    setDateRange({
      from,
      to: now
    });
  };
  
  // Effect to load data when component mounts or filters change
  useEffect(() => {
    loadStats();
    loadActivity();
  }, [dateRange, aggregation]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Statistiques des Emails</h1>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">3 derniers mois</SelectItem>
              <SelectItem value="6m">6 derniers mois</SelectItem>
              <SelectItem value="1y">Dernière année</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(dateRange.from, "P", { locale: fr })} - {format(dateRange.to, "P", { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange(range);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            size="icon"
            variant="outline"
            onClick={() => { loadStats(); loadActivity(); }}
            title="Rafraîchir les données"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          icon={<MousePointerClick className="h-4 w-4" />}
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
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <EmailChartCard title="Performance des emails" loading={loading}>
              <ChartContainer className="h-80" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      height={70}
                    />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar name="Livrés" dataKey="delivered" fill="#10b981" />
                    <Bar name="Ouvertures" dataKey="opens" fill="#3b82f6" />
                    <Bar name="Clics" dataKey="clicks" fill="#8b5cf6" />
                    <Bar name="Rebonds" dataKey="bounces" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </EmailChartCard>
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <EmailActivityTable 
            activities={activityData} 
            loading={activityLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailStats;
