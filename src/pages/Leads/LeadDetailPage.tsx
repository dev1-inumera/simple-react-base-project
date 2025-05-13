import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchLeadNotes, fetchLeadTasks, createLeadNote, createLeadTask, updateLead } from '@/services/CampaignService';
import { useAuth } from '@/lib/auth';
import { Lead, LeadNote, LeadTask, UserRole } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Building, 
  Briefcase,
  Mail, 
  Phone, 
  Edit, 
  PlusCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  PenLine
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { mapLead } from '@/utils/dataMapper';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PopoverContent, Popover, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newNote, setNewNote] = useState('');
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditLeadDialogOpen, setIsEditLeadDialogOpen] = useState(false);
  
  // Fetch lead data
  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          lead_assignments:lead_assignments(
            *,
            agent:agent_id(id, first_name, last_name, email, role)
          ),
          campaign:campaign_id(id, name)
        `)
        .eq('id', id!)
        .single();
        
      if (error) throw error;
      
      const leadData = mapLead(data);
      
      // Safely handle the agent data
      const assignedToData = data.lead_assignments && 
                             data.lead_assignments.length > 0 && 
                             data.lead_assignments[0].agent ? 
        {
          id: data.lead_assignments[0].agent.id,
          firstName: data.lead_assignments[0].agent.first_name,
          lastName: data.lead_assignments[0].agent.last_name,
          email: data.lead_assignments[0].agent.email,
          role: data.lead_assignments[0].agent.role
        } : undefined;
      
      return {
        ...leadData,
        campaignId: data.campaign_id,
        campaignName: data.campaign?.name,
        assignedTo: assignedToData
      };
    },
    enabled: !!id
  });
  
  // Fetch notes
  const { data: notes = [], isLoading: isNotesLoading } = useQuery({
    queryKey: ['lead-notes', id],
    queryFn: () => fetchLeadNotes(id!),
    enabled: !!id
  });
  
  // Fetch tasks
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ['lead-tasks', id],
    queryFn: () => fetchLeadTasks(id!),
    enabled: !!id
  });
  
  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: (note: Partial<LeadNote>) => createLeadNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-notes', id] });
      setNewNote('');
      toast({
        title: "Note ajoutée",
        description: "Votre note a été ajoutée avec succès."
      });
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la note.",
        variant: "destructive"
      });
    }
  });
  
  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (task: Partial<LeadTask>) => createLeadTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-tasks', id] });
      setIsAddTaskDialogOpen(false);
      toast({
        title: "Tâche créée",
        description: "La tâche a été créée avec succès."
      });
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la tâche.",
        variant: "destructive"
      });
    }
  });
  
  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: (data: Partial<Lead>) => updateLead(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['campaign-leads', lead?.campaignId] });
      setIsEditLeadDialogOpen(false);
      toast({
        title: "Lead mis à jour",
        description: "Les informations du lead ont été mises à jour avec succès."
      });
    },
    onError: (error) => {
      console.error("Error updating lead:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du lead.",
        variant: "destructive"
      });
    }
  });
  
  // Set up real-time subscription for notes and tasks
  React.useEffect(() => {
    if (!id) return;
    
    const notesChannel = supabase
      .channel('lead-notes-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lead_notes',
        filter: `lead_id=eq.${id}`
      }, () => {
        // Refresh notes data
        queryClient.invalidateQueries({ queryKey: ['lead-notes', id] });
      })
      .subscribe();
      
    const tasksChannel = supabase
      .channel('lead-tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lead_tasks',
        filter: `lead_id=eq.${id}`
      }, () => {
        // Refresh tasks data
        queryClient.invalidateQueries({ queryKey: ['lead-tasks', id] });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(notesChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [id, queryClient]);
  
  if (isLoading || !lead) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-100 rounded-lg"></div>
      </div>
    );
  }
  
  const handleAddNote = () => {
    if (!newNote.trim() || !auth.user) return;
    
    createNoteMutation.mutate({
      leadId: id!,
      agentId: auth.user.id,
      content: newNote.trim()
    });
  };
  
  const handleAddTask = (task: Partial<LeadTask>) => {
    if (!auth.user) return;
    
    createTaskMutation.mutate({
      ...task,
      leadId: id!,
      agentId: auth.user.id
    });
  };
  
  const handleUpdateLead = (data: Partial<Lead>) => {
    updateLeadMutation.mutate(data);
  };
  
  const getStatusBadge = (status: string) => {
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
  
  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">À faire</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(`/campaigns/${lead.campaignId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {lead.campaignName || 'Campagne'}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>
              {lead.firstName} {lead.lastName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Button 
          onClick={() => setIsEditLeadDialogOpen(true)}
          variant="outline"
        >
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{lead.firstName} {lead.lastName}</CardTitle>
                {lead.position && lead.company && (
                  <CardDescription>
                    {lead.position} chez {lead.company}
                  </CardDescription>
                )}
              </div>
              {getStatusBadge(lead.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lead.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                </div>
              )}
              
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                </div>
              )}
              
              {lead.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.company}</span>
                </div>
              )}
              
              {lead.position && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.position}</span>
                </div>
              )}
            </div>
            
            {lead.assignedTo && (
              <>
                <Separator />
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Assigné à</span>
                  <span className="font-medium">
                    {lead.assignedTo.firstName} {lead.assignedTo.lastName}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Dernières actions</h4>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center text-sm">
                    <div className="h-7 w-7 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                      <PenLine className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Dernière mise à jour: {formatDistanceToNow(new Date(lead.updatedAt), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </div>
                  
                  {notes.length > 0 && (
                    <div className="flex gap-2 items-center text-sm">
                      <div className="h-7 w-7 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                        <PenLine className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Dernière note: {formatDistanceToNow(new Date(notes[0].createdAt), { addSuffix: true, locale: fr })}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {tasks.filter(task => task.status === 'completed').length > 0 && (
                    <div className="flex gap-2 items-center text-sm">
                      <div className="h-7 w-7 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {tasks.filter(task => task.status === 'completed').length} tâches terminées
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">À faire</h4>
                {tasks.filter(task => task.status === 'pending').length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Aucune tâche en attente
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks
                      .filter(task => task.status === 'pending')
                      .slice(0, 3)
                      .map(task => (
                        <div key={task.id} className="flex gap-2 items-center text-sm">
                          <div className="h-7 w-7 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                            <Clock className="h-3.5 w-3.5" />
                          </div>
                          <div className="overflow-hidden">
                            <span className="block truncate">{task.title}</span>
                            {task.dueDate && (
                              <span className="text-xs text-muted-foreground">
                                Échéance: {format(new Date(task.dueDate || task.due_date), "d MMM", { locale: fr })}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Ajoutez des notes pour suivre vos interactions avec ce lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Textarea 
                  placeholder="Ajouter une nouvelle note..." 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                    Ajouter une note
                  </Button>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {isNotesLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-24 bg-slate-100 rounded"></div>
                  <div className="h-24 bg-slate-100 rounded"></div>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune note pour ce lead
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map(note => (
                    <div key={note.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {note.agent && note.agent.firstName && note.agent.lastName
                              ? `${note.agent.firstName[0]}${note.agent.lastName[0]}`
                              : 'UA'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {note.agent
                              ? `${note.agent.firstName} ${note.agent.lastName}`
                              : 'Agent inconnu'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true, locale: fr })}
                          </div>
                        </div>
                      </div>
                      <div className="pl-10 whitespace-pre-line">
                        {note.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle>Tâches</CardTitle>
                <CardDescription>
                  Planifiez et suivez les tâches pour ce lead
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsAddTaskDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter une tâche
              </Button>
            </CardHeader>
            <CardContent>
              {isTasksLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-slate-100 rounded"></div>
                  <div className="h-16 bg-slate-100 rounded"></div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune tâche pour ce lead
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {tasks
                      .filter(task => task.status !== 'completed' && task.status !== 'cancelled')
                      .map(task => (
                        <div 
                          key={task.id} 
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors flex justify-between items-center"
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {task.status === 'pending' && <Clock className="h-5 w-5 text-amber-500" />}
                              {task.status === 'in_progress' && <Clock className="h-5 w-5 text-blue-500" />}
                            </div>
                            <div>
                              <div className="font-medium">{task.title}</div>
                              {task.description && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {task.description}
                                </div>
                              )}
                              <div className="flex gap-3 mt-2">
                                {task.dueDate && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {format(new Date(task.dueDate), "d MMMM yyyy", { locale: fr })}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  {getTaskStatusBadge(task.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  {tasks.filter(task => task.status === 'completed' || task.status === 'cancelled').length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium mb-2">Tâches terminées/annulées</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {tasks
                            .filter(task => task.status === 'completed' || task.status === 'cancelled')
                            .map(task => (
                              <div 
                                key={task.id} 
                                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors flex justify-between items-center"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="mt-1">
                                    {task.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                    {task.status === 'cancelled' && <XCircle className="h-5 w-5 text-red-500" />}
                                  </div>
                                  <div>
                                    <div className="font-medium">{task.title}</div>
                                    {task.description && (
                                      <div className="text-sm text-muted-foreground mt-1">
                                        {task.description}
                                      </div>
                                    )}
                                    <div className="flex gap-3 mt-2">
                                      {task.dueDate && (
                                        <div className="flex items-center gap-1 text-xs">
                                          <Calendar className="h-3 w-3" />
                                          <span>
                                            {format(new Date(task.dueDate), "d MMMM yyyy", { locale: fr })}
                                          </span>
                                        </div>
                                      )}
                                      <div>
                                        {getTaskStatusBadge(task.status)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onOpenChange={setIsAddTaskDialogOpen}
        onAddTask={handleAddTask}
      />
      
      <EditLeadDialog
        open={isEditLeadDialogOpen}
        onOpenChange={setIsEditLeadDialogOpen}
        lead={lead}
        onSubmit={handleUpdateLead}
      />
    </div>
  );
};

// Add Task Dialog
interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Partial<LeadTask>) => void;
}

const taskFormSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  status: z.string().default("pending")
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddTask
}) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: null,
      status: "pending"
    }
  });
  
  const handleSubmit = (values: TaskFormValues) => {
    onAddTask({
      title: values.title,
      description: values.description,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      status: values.status
    });
    form.reset();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une tâche</DialogTitle>
          <DialogDescription>
            Créez une nouvelle tâche pour ce lead.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la tâche..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description de la tâche..." 
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'échéance</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">À faire</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Créer la tâche</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Lead Dialog
interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSubmit: (lead: Partial<Lead>) => void;
}

const leadFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est obligatoire"),
  lastName: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("L'email est invalide").optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'])
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const EditLeadDialog: React.FC<EditLeadDialogProps> = ({ 
  open, 
  onOpenChange,
  lead,
  onSubmit
}) => {
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      position: lead.position || '',
      status: lead.status
    }
  });
  
  const handleSubmit = (values: LeadFormValues) => {
    onSubmit({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email || undefined,
      phone: values.phone,
      company: values.company,
      position: values.position,
      status: values.status
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Modifier le lead</DialogTitle>
          <DialogDescription>
            Modifiez les informations du lead.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
