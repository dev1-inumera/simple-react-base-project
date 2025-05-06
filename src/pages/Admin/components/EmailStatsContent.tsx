
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailActivityTable } from "@/components/dashboard/EmailActivityTable";
import { EmailPerformanceChart } from "./EmailPerformanceChart";
import type { EmailActivity } from "@/services/EmailService";

interface EmailStatsContentProps {
  chartData: any[];
  activityData: EmailActivity[];
  loading: boolean;
  activityLoading: boolean;
}

export const EmailStatsContent: React.FC<EmailStatsContentProps> = ({
  chartData,
  activityData,
  loading,
  activityLoading
}) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="activity">Activité récente</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <EmailPerformanceChart chartData={chartData} loading={loading} />
        </div>
      </TabsContent>
      <TabsContent value="activity">
        <EmailActivityTable 
          activities={activityData} 
          loading={activityLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};
