
import { useState, useEffect } from "react";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/services/EmailService";
import type { EmailStats, EmailActivity } from "@/services/EmailService";

export const useEmailStats = () => {
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

  return {
    statsData,
    activityData,
    summaryStats,
    chartData,
    loading,
    activityLoading,
    timeRange,
    dateRange,
    handleTimeRangeChange,
    setDateRange,
    loadStats,
    loadActivity
  };
};
