
import { supabase } from "@/integrations/supabase/client";
import { Campaign, Lead, LeadAssignment, LeadNote, LeadTask } from "@/types";
import { mapCampaign, mapCampaigns, mapLead, mapLeads } from "@/utils/dataMapper";

export const fetchCampaigns = async () => {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*, leads:leads(id)");

    if (error) throw error;

    return data.map((campaign: any) => ({
      ...mapCampaign(campaign),
      leadsCount: campaign.leads ? campaign.leads.length : 0
    }));
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

export const fetchCampaignById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return mapCampaign(data);
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error);
    throw error;
  }
};

export const createCampaign = async (campaign: Partial<Campaign>) => {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .insert([
        {
          name: campaign.name,
          description: campaign.description,
          start_date: campaign.startDate,
          end_date: campaign.endDate,
          objectives: campaign.objectives,
          status: campaign.status || "preparation",
          created_by: campaign.createdBy
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return mapCampaign(data);
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

export const updateCampaign = async (id: string, campaign: Partial<Campaign>) => {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .update({
        name: campaign.name,
        description: campaign.description,
        start_date: campaign.startDate,
        end_date: campaign.endDate,
        objectives: campaign.objectives,
        status: campaign.status
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return mapCampaign(data);
  } catch (error) {
    console.error(`Error updating campaign ${id}:`, error);
    throw error;
  }
};

export const fetchCampaignLeads = async (campaignId: string) => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        lead_assignments:lead_assignments(
          *,
          agent:agent_id(id, first_name, last_name, email, role)
        )
      `)
      .eq("campaign_id", campaignId);

    if (error) throw error;

    return data.map((lead: any) => ({
      ...mapLead(lead),
      assignedTo: lead.lead_assignments?.length > 0 
        ? {
            id: lead.lead_assignments[0].agent.id,
            firstName: lead.lead_assignments[0].agent.first_name,
            lastName: lead.lead_assignments[0].agent.last_name,
            email: lead.lead_assignments[0].agent.email,
            role: lead.lead_assignments[0].agent.role
          } 
        : undefined
    }));
  } catch (error) {
    console.error(`Error fetching leads for campaign ${campaignId}:`, error);
    throw error;
  }
};

export const createLead = async (lead: Partial<Lead>) => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          campaign_id: lead.campaignId,
          first_name: lead.firstName,
          last_name: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          position: lead.position,
          status: lead.status || "new"
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return mapLead(data);
  } catch (error) {
    console.error("Error creating lead:", error);
    throw error;
  }
};

export const updateLead = async (id: string, lead: Partial<Lead>) => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .update({
        first_name: lead.firstName,
        last_name: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        position: lead.position,
        status: lead.status
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return mapLead(data);
  } catch (error) {
    console.error(`Error updating lead ${id}:`, error);
    throw error;
  }
};

export const assignLead = async (leadId: string, agentId: string, createdBy: string) => {
  try {
    const { data, error } = await supabase
      .from("lead_assignments")
      .insert([
        {
          lead_id: leadId,
          agent_id: agentId,
          created_by: createdBy,
          status: "active"
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(`Error assigning lead ${leadId} to agent ${agentId}:`, error);
    throw error;
  }
};

export const createLeadTask = async (task: Partial<LeadTask>) => {
  try {
    const { data, error } = await supabase
      .from("lead_tasks")
      .insert([
        {
          lead_id: task.leadId,
          agent_id: task.agentId,
          title: task.title,
          description: task.description,
          status: task.status || "pending",
          due_date: task.dueDate
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error creating lead task:", error);
    throw error;
  }
};

export const createLeadNote = async (note: Partial<LeadNote>) => {
  try {
    const { data, error } = await supabase
      .from("lead_notes")
      .insert([
        {
          lead_id: note.leadId,
          agent_id: note.agentId,
          content: note.content
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error creating lead note:", error);
    throw error;
  }
};

export const fetchLeadTasks = async (leadId: string) => {
  try {
    const { data, error } = await supabase
      .from("lead_tasks")
      .select("*")
      .eq("lead_id", leadId)
      .order("due_date", { ascending: true });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(`Error fetching tasks for lead ${leadId}:`, error);
    throw error;
  }
};

export const fetchLeadNotes = async (leadId: string) => {
  try {
    const { data, error } = await supabase
      .from("lead_notes")
      .select(`
        *,
        agent:agent_id(id, first_name, last_name, email)
      `)
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((note: any) => ({
      id: note.id,
      leadId: note.lead_id,
      agentId: note.agent_id,
      content: note.content,
      createdAt: note.created_at,
      agent: note.agent ? {
        id: note.agent.id,
        firstName: note.agent.first_name,
        lastName: note.agent.last_name,
        email: note.agent.email
      } : undefined
    }));
  } catch (error) {
    console.error(`Error fetching notes for lead ${leadId}:`, error);
    throw error;
  }
};

export const fetchAgentLeads = async (agentId: string) => {
  try {
    const { data, error } = await supabase
      .from("lead_assignments")
      .select(`
        *,
        lead:lead_id(
          *,
          campaign:campaign_id(name)
        )
      `)
      .eq("agent_id", agentId)
      .eq("status", "active");

    if (error) throw error;

    return data.map((assignment: any) => ({
      ...mapLead(assignment.lead),
      campaignName: assignment.lead.campaign?.name
    }));
  } catch (error) {
    console.error(`Error fetching leads for agent ${agentId}:`, error);
    throw error;
  }
};
