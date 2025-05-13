
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lead, UserRole } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface AssignLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onAssign: (agentId: string) => void;
}

interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

const AssignLeadDialog: React.FC<AssignLeadDialogProps> = ({ 
  open, 
  onOpenChange,
  lead,
  onAssign
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  
  // Fetch agents
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role')
        .in('role', ['agent', 'admin'])
        .order('first_name', { ascending: true });
        
      if (error) throw error;
      
      // Map snake_case to camelCase
      return data.map((agent: any) => ({
        id: agent.id,
        firstName: agent.first_name,
        lastName: agent.last_name,
        email: agent.email,
        role: agent.role
      })) as Agent[];
    }
  });
  
  const filteredAgents = agents.filter(agent => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      agent.firstName.toLowerCase().includes(searchLower) ||
      agent.lastName.toLowerCase().includes(searchLower) ||
      agent.email.toLowerCase().includes(searchLower)
    );
  });
  
  const handleSubmit = () => {
    if (selectedAgentId) {
      onAssign(selectedAgentId);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assigner un agent au lead</DialogTitle>
          <DialogDescription>
            Sélectionnez un agent pour le lead {lead.firstName} {lead.lastName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un agent..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  <div className="space-y-1 flex-1">
                    <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                    <div className="h-3 w-2/3 bg-slate-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              Aucun agent trouvé.
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto pr-2">
              <RadioGroup value={selectedAgentId} onValueChange={setSelectedAgentId}>
                {filteredAgents.map(agent => (
                  <div 
                    key={agent.id} 
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                      selectedAgentId === agent.id ? 'bg-muted' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedAgentId(agent.id)}
                  >
                    <RadioGroupItem value={agent.id} id={agent.id} />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {agent.firstName[0]}{agent.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-1">
                      <Label htmlFor={agent.id} className="font-medium block cursor-pointer">
                        {agent.firstName} {agent.lastName}
                      </Label>
                      <span className="text-xs text-muted-foreground block">
                        {agent.email} • {agent.role === 'agent' ? 'Agent' : 'Admin'}
                      </span>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={!selectedAgentId}
          >
            Assigner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignLeadDialog;
