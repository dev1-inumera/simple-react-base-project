
import React from "react";
import { EmailStatsCard } from "@/components/dashboard/EmailStatsCard";
import { Mail, MousePointerClick as MousePointerClickIcon } from "lucide-react";

interface EmailStatsSummaryProps {
  summaryStats: {
    totalSent: number;
    totalDelivered: number;
    totalOpens: number;
    totalClicks: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  };
  loading: boolean;
}

export const EmailStatsSummary: React.FC<EmailStatsSummaryProps> = ({ 
  summaryStats, 
  loading 
}) => {
  return (
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
  );
};
