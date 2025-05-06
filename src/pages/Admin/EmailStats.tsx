
import React from "react";
import { EmailStatsHeader } from "./components/EmailStatsHeader";
import { EmailStatsSummary } from "./components/EmailStatsSummary";
import { EmailStatsContent } from "./components/EmailStatsContent";
import { useEmailStats } from "./components/useEmailStats";

const EmailStats: React.FC = () => {
  const {
    summaryStats,
    chartData,
    activityData,
    loading,
    activityLoading,
    timeRange,
    dateRange,
    handleTimeRangeChange,
    setDateRange,
    loadStats,
    loadActivity
  } = useEmailStats();

  const handleRefresh = () => {
    loadStats();
    loadActivity();
  };

  return (
    <div className="space-y-6">
      <EmailStatsHeader
        timeRange={timeRange}
        dateRange={dateRange}
        onTimeRangeChange={handleTimeRangeChange}
        onDateRangeChange={setDateRange}
        onRefresh={handleRefresh}
      />

      <EmailStatsSummary
        summaryStats={summaryStats}
        loading={loading}
      />
      
      <EmailStatsContent
        chartData={chartData}
        activityData={activityData}
        loading={loading}
        activityLoading={activityLoading}
      />
    </div>
  );
};

export default EmailStats;
