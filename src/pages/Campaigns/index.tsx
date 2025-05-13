
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCampaigns, createCampaign } from '@/services/CampaignService';
import { useAuth } from '@/lib/auth';
import { Campaign, UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, Search, Filter, Calendar, Users, Phone, BarChart2,
  CheckCircle2, Clock, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CreateCampaignDialog from './components/CreateCampaignDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CampaignsPage: React.FC = () => {
  const { auth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState("");
  const [tabValue, setTabValue] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const isAdminOrResponsable = auth.user?.role === UserRole.ADMIN || 
                              auth.user?.role === UserRole.RESPONSABLE_PLATEAU;

  const { data: campaigns = [], isLoading, refetch } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns
  });

  const handleCreateCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      if (!auth.user) return;
      
      const newCampaign = await createCampaign({
        ...campaignData,
        createdBy: auth.user.id
      });
      
      await refetch();
      setShowCreateDialog(false);
      
      toast({
        title: "Campagne créée",
        description: `La campagne ${newCampaign.name} a été créée avec succès.`,
      });
      
      // Navigate to the new campaign
      navigate(`/campaigns/${newCampaign.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la campagne.",
        variant: "destructive"
      });
    }
  };

  const filteredCampaigns = campaigns
    .filter(campaign => 
      campaign.name.toLowerCase().includes(filter.toLowerCase()) ||
      (campaign.description && campaign.description.toLowerCase().includes(filter.toLowerCase()))
    )
    .filter(campaign => {
      if (tabValue === "all") return true;
      return campaign.status === tabValue;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'preparation':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En préparation</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Terminée</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Suspendue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparation':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'active':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <BarChart2 className="h-5 w-5 text-purple-500" />;
      case 'suspended':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campagnes</h1>
          <p className="text-muted-foreground">Gérez vos campagnes marketing et leurs leads</p>
        </div>
        
        {isAdminOrResponsable && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle campagne
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des campagnes..."
            className="pl-8"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-1">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={tabValue} onValueChange={setTabValue}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="preparation">En préparation</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
          <TabsTrigger value="suspended">Suspendues</TabsTrigger>
        </TabsList>
        
        <TabsContent value={tabValue} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-slate-100"></CardHeader>
                  <CardContent className="h-32 bg-slate-50"></CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Aucune campagne trouvée</h3>
                <p className="text-muted-foreground text-center max-w-md mt-1">
                  Nous n'avons trouvé aucune campagne correspondant à vos critères de recherche.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map(campaign => (
                <Card 
                  key={campaign.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                >
                  <CardHeader className="bg-slate-50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-1">
                        {campaign.description || "Aucune description"}
                      </CardDescription>
                    </div>
                    {getStatusIcon(campaign.status)}
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {campaign.startDate ? format(new Date(campaign.startDate), 'PP', { locale: fr }) : "Non définie"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.leadsCount || 0} leads</span>
                      </div>
                    </div>

                    <div className="line-clamp-2 text-sm text-muted-foreground">
                      {campaign.objectives || "Aucun objectif défini pour cette campagne."}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t bg-muted/20 gap-2 justify-between">
                    {getStatusBadge(campaign.status)}
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Phone className="h-3.5 w-3.5 mr-1" />
                      Détails
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {showCreateDialog && (
        <CreateCampaignDialog 
          open={showCreateDialog} 
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateCampaign}
        />
      )}
    </div>
  );
};

export default CampaignsPage;
