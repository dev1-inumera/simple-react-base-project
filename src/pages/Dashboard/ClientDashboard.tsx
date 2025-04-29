
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { PendingQuotes } from "./components/PendingQuotes";
import { RecentActivityList } from "./components/RecentActivity";
import { DashboardHeader } from "./components/DashboardHeader";
import { RecentFolders } from "./components/RecentFolders";
import { useFoldersSubscription } from "@/hooks/useFoldersSubscription";

const ClientDashboard = () => {
  const { auth } = useAuth();
  const [pendingQuotes] = useState([]);
  const { folders, loading } = useFoldersSubscription(auth.user?.id || '');

  if (!auth.user) return null;

  return (
    <div className="space-y-4 p-8">
      <DashboardHeader 
        foldersCount={folders.length}
        pendingQuotesCount={pendingQuotes.length}
        loading={loading}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <RecentFolders folders={folders} loading={loading} />

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Devis en attente</h2>
          <PendingQuotes 
            quotes={pendingQuotes} 
            loading={loading}
            onStatusUpdate={async () => {}}
          />
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Activité récente</h2>
        <RecentActivityList 
          activities={[]} 
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ClientDashboard;
