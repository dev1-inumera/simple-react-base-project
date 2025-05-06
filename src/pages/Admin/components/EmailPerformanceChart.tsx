
import React from "react";
import { EmailChartCard } from "@/components/dashboard/EmailStatsCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface EmailPerformanceChartProps {
  chartData: any[];
  loading: boolean;
}

export const EmailPerformanceChart: React.FC<EmailPerformanceChartProps> = ({ 
  chartData, 
  loading 
}) => {
  return (
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
  );
};
