
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { PendingQuotes } from "./components/PendingQuotes";
import { RecentActivityList } from "./components/RecentActivity";
import { DashboardHeader } from "./components/DashboardHeader";
import RecentFolders from "./components/RecentFolders";
import { useFoldersSubscription } from "@/hooks/useFoldersSubscription";
import { CampaignEmailStats } from "@/components/dashboard/CampaignEmailStats";

const ClientDashboard = () => {
  const { auth } = useAuth();
  const [pendingQuotes] = useState([]);
  const { folders, loading } = useFoldersSubscription(auth.user?.id || '');
  const [campaigns, setCampaigns] = useState<{id: string, name: string}[]>([
    // Ces valeurs peuvent être remplacées par des données réelles de votre système
    { id: "welcome-campaign", name: "Campagne de bienvenue" },
    { id: "newsletter", name: "Newsletter mensuelle" },
  ]);
  const [activeCampaign, setActiveCampaign] = useState<string | null>(
    campaigns.length > 0 ? campaigns[0].id : null
  );

  if (!auth.user) return null;

  return (
    <div className="space-y-4 p-8">
      <DashboardHeader 
        foldersCount={folders.length}
        pendingQuotesCount={pendingQuotes.length}
        loading={loading}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="campaigns">
          <Card className="p-4">
            {campaigns.length > 0 ? (
              <Tabs 
                value={activeCampaign || ""}
                onValueChange={setActiveCampaign}
                className="space-y-6"
              >
                <TabsList className="mb-4">
                  {campaigns.map(campaign => (
                    <TabsTrigger key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {campaigns.map(campaign => (
                  <TabsContent key={campaign.id} value={campaign.id}>
                    <h2 className="text-lg font-semibold mb-4">{campaign.name}</h2>
                    <CampaignEmailStats 
                      campaignId={campaign.id}
                      showTitle={false}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune campagne disponible</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;
