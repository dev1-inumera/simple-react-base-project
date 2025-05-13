
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCampaignById, 
  fetchCampaignLeads, 
  updateCampaign,
  createLead,
  assignLead
} from '@/services/CampaignService';
import { useAuth } from '@/lib/auth';
import { Campaign, Lead, UserRole } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Users, 
  Target, 
  ArrowLeft, 
  Edit, 
  PlusCircle,
  Download,
  UserPlus,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import CreateLeadDialog from './components/CreateLeadDialog';
import AssignLeadDialog from './components/AssignLeadDialog';
import EditCampaignDialog from './components/EditCampaignDialog';
import { supabase } from '@/integrations/supabase/client';

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateLeadDialogOpen, setIsCreateLeadDialogOpen] = useState(false);
  const [isAssignLeadDialogOpen, setIsAssignLeadDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdminOrResponsable = auth.user?.role === UserRole.ADMIN || 
                                auth.user?.role === UserRole.RESPONSABLE_PLATEAU;
  
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => fetchCampaignById(id!),
    enabled: !!id
  });
  
  const { data: leads = [], isLoading: isLeadsLoading } = useQuery({
    queryKey: ['campaign-leads', id],
    queryFn: () => fetchCampaignLeads(id!),
    enabled: !!id
  });
  
  const updateCampaignMutation = useMutation({
    mutationFn: (updatedCampaign: Partial<Campaign>) => 
      updateCampaign(id!, updatedCampaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      toast({
        title: "Campagne mise à jour",
        description: "Les informations de la campagne ont été mises à jour avec succès."
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating campaign:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la campagne.",
        variant: "destructive"
      });
    }
  });
  
  const createLeadMutation = useMutation({
    mutationFn: (newLead: Partial<Lead>) => 
      createLead({ ...newLead, campaignId: id! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-leads', id] });
      toast({
        title: "Lead créé",
        description: "Le lead a été créé avec succès."
      });
      setIsCreateLeadDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error creating lead:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du lead.",
        variant: "destructive"
      });
    }
  });
  
  const assignLeadMutation = useMutation({
    mutationFn: (data: { leadId: string, agentId: string }) => 
      assignLead(data.leadId, data.agentId, auth.user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-leads', id] });
      toast({
        title: "Lead assigné",
        description: "Le lead a été assigné avec succès."
      });
      setIsAssignLeadDialogOpen(false);
      setSelectedLead(null);
    },
    onError: (error) => {
      console.error("Error assigning lead:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'assignation du lead.",
        variant: "destructive"
      });
    }
  });
  
  // Set up realtime subscription for leads
  React.useEffect(() => {
    if (!id) return;
    
    const leadsChannel = supabase
      .channel('leads-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads',
        filter: `campaign_id=eq.${id}`
      }, () => {
        // Refresh leads data
        queryClient.invalidateQueries({ queryKey: ['campaign-leads', id] });
      })
      .subscribe();
      
    // Also listen for assignment changes
    const assignmentsChannel = supabase
      .channel('lead-assignments-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lead_assignments'
      }, () => {
        // Refresh leads data to update assignments
        queryClient.invalidateQueries({ queryKey: ['campaign-leads', id] });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(assignmentsChannel);
    };
  }, [id, queryClient]);
  
  if (isLoading || !campaign) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-100 rounded-lg"></div>
      </div>
    );
  }
  
  const handleEditCampaign = (updatedCampaign: Partial<Campaign>) => {
    updateCampaignMutation.mutate(updatedCampaign);
  };
  
  const handleCreateLead = (leadData: Partial<Lead>) => {
    createLeadMutation.mutate(leadData);
  };
  
  const handleAssignLead = (agentId: string) => {
    if (!selectedLead) return;
    assignLeadMutation.mutate({ leadId: selectedLead.id, agentId });
  };
  
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
  
  const getLeadStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Nouveau</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Contacté</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Qualifié</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Converti</Badge>;
      case 'lost':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Perdu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.firstName.toLowerCase().includes(searchLower) ||
      lead.lastName.toLowerCase().includes(searchLower) ||
      (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
      (lead.company && lead.company.toLowerCase().includes(searchLower))
    );
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/campaigns')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Campagnes
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{campaign.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        {isAdminOrResponsable && (
          <Button 
            onClick={() => setIsEditDialogOpen(true)}
            variant="outline"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{campaign.name}</CardTitle>
                <CardDescription>{campaign.description || "Aucune description"}</CardDescription>
              </div>
              {getStatusBadge(campaign.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" /> Date de début
                </span>
                <span className="font-medium">
                  {campaign.startDate 
                    ? format(new Date(campaign.startDate), "PP", { locale: fr }) 
                    : "Non définie"}
                </span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" /> Date de fin
                </span>
                <span className="font-medium">
                  {campaign.endDate 
                    ? format(new Date(campaign.endDate), "PP", { locale: fr }) 
                    : "Non définie"}
                </span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" /> Leads
                </span>
                <span className="font-medium">{leads.length}</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Target className="h-4 w-4 mr-1" /> Objectifs
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {campaign.objectives || "Aucun objectif défini pour cette campagne."}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-2xl font-bold">{leads.length}</p>
                  <p className="text-xs text-muted-foreground">Leads totaux</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-2xl font-bold">
                    {leads.filter(lead => lead.assignedTo).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Leads assignés</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Par statut</h4>
                <div className="space-y-2">
                  {['new', 'contacted', 'qualified', 'converted', 'lost'].map(status => {
                    const count = leads.filter(lead => lead.status === status).length;
                    const percentage = leads.length > 0 
                      ? Math.round((count / leads.length) * 100) 
                      : 0;
                    
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize">{status}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              status === 'new' ? 'bg-blue-500' : 
                              status === 'contacted' ? 'bg-amber-500' :
                              status === 'qualified' ? 'bg-green-500' :
                              status === 'converted' ? 'bg-purple-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Leads</h2>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          {isAdminOrResponsable && (
            <Button onClick={() => setIsCreateLeadDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un lead
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des leads..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="assigned">Assignés</TabsTrigger>
          <TabsTrigger value="unassigned">Non assignés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            {isLeadsLoading ? (
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-slate-100 rounded"></div>
                  <div className="h-10 bg-slate-100 rounded"></div>
                  <div className="h-10 bg-slate-100 rounded"></div>
                </div>
              </CardContent>
            ) : filteredLeads.length === 0 ? (
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Aucun lead trouvé</p>
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Nom</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Téléphone</th>
                      <th className="text-left py-3 px-4 font-medium">Entreprise</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Agent</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/leads/${lead.id}`)}
                      >
                        <td className="py-3 px-4">
                          {lead.firstName} {lead.lastName}
                        </td>
                        <td className="py-3 px-4">{lead.email || "—"}</td>
                        <td className="py-3 px-4">{lead.phone || "—"}</td>
                        <td className="py-3 px-4">{lead.company || "—"}</td>
                        <td className="py-3 px-4">
                          {getLeadStatusBadge(lead.status)}
                        </td>
                        <td className="py-3 px-4">
                          {lead.assignedTo ? (
                            <span>
                              {lead.assignedTo.firstName} {lead.assignedTo.lastName}
                            </span>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-500">
                              Non assigné
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/leads/${lead.id}`);
                              }}>
                                Voir les détails
                              </DropdownMenuItem>
                              {isAdminOrResponsable && (
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLead(lead);
                                    setIsAssignLeadDialogOpen(true);
                                  }}
                                >
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Assigner à un agent
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="assigned" className="mt-4">
          <Card>
            {isLeadsLoading ? (
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-slate-100 rounded"></div>
                </div>
              </CardContent>
            ) : filteredLeads.filter(lead => lead.assignedTo).length === 0 ? (
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Aucun lead assigné trouvé</p>
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Nom</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Agent</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads
                      .filter(lead => lead.assignedTo)
                      .map((lead) => (
                        <tr 
                          key={lead.id} 
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => navigate(`/leads/${lead.id}`)}
                        >
                          <td className="py-3 px-4">
                            {lead.firstName} {lead.lastName}
                          </td>
                          <td className="py-3 px-4">{lead.email || "—"}</td>
                          <td className="py-3 px-4">
                            {getLeadStatusBadge(lead.status)}
                          </td>
                          <td className="py-3 px-4">
                            {lead.assignedTo && (
                              <span>
                                {lead.assignedTo.firstName} {lead.assignedTo.lastName}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/leads/${lead.id}`);
                            }}>
                              Voir
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="unassigned" className="mt-4">
          <Card>
            {isLeadsLoading ? (
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-slate-100 rounded"></div>
                </div>
              </CardContent>
            ) : filteredLeads.filter(lead => !lead.assignedTo).length === 0 ? (
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Tous les leads sont assignés</p>
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Nom</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads
                      .filter(lead => !lead.assignedTo)
                      .map((lead) => (
                        <tr 
                          key={lead.id} 
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => navigate(`/leads/${lead.id}`)}
                        >
                          <td className="py-3 px-4">
                            {lead.firstName} {lead.lastName}
                          </td>
                          <td className="py-3 px-4">{lead.email || "—"}</td>
                          <td className="py-3 px-4">
                            {getLeadStatusBadge(lead.status)}
                          </td>
                          <td className="py-3 px-4">
                            {isAdminOrResponsable && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLead(lead);
                                  setIsAssignLeadDialogOpen(true);
                                }}
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Assigner
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {isEditDialogOpen && (
        <EditCampaignDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          campaign={campaign}
          onSubmit={handleEditCampaign}
        />
      )}
      
      {isCreateLeadDialogOpen && (
        <CreateLeadDialog
          open={isCreateLeadDialogOpen}
          onOpenChange={setIsCreateLeadDialogOpen}
          onSubmit={handleCreateLead}
        />
      )}
      
      {isAssignLeadDialogOpen && selectedLead && (
        <AssignLeadDialog
          open={isAssignLeadDialogOpen}
          onOpenChange={setIsAssignLeadDialogOpen}
          lead={selectedLead}
          onAssign={handleAssignLead}
        />
      )}
    </div>
  );
};

export default CampaignDetailPage;
