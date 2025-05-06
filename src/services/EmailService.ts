
import { supabase } from "@/integrations/supabase/client";

export interface EmailStats {
  date: string;
  stats: {
    requests: number;
    delivered: number;
    opens: number;
    clicks: number;
    bounces: number;
    spam_reports: number;
    unsubscribes: number;
  }[];
}

export interface EmailActivity {
  id: string;
  from_email: string;
  to_email: string;
  subject: string;
  status: string;
  opens_count: number;
  clicks_count: number;
  created: string;
  last_event_time: string;
}

export interface SendgridStatsParams {
  statsType?: 'global' | 'categories' | 'browsers' | 'devices' | 'clients' | 'geo';
  startDate?: string;
  endDate?: string;
  aggregatedBy?: 'day' | 'week' | 'month';
  categories?: string[];
  campaignId?: string;
}

export interface SendgridActivityParams {
  limit?: number;
  query?: string;
  before?: string;
  after?: string;
}

export const EmailService = {
  async getStats(params: SendgridStatsParams = {}): Promise<EmailStats[]> {
    try {
      const { data, error } = await supabase.functions.invoke('sendgrid-stats', {
        body: {
          statsType: params.statsType || 'global',
          startDate: params.startDate || getDefaultStartDate(),
          endDate: params.endDate,
          aggregatedBy: params.aggregatedBy || 'day',
          categories: params.categories,
          campaignId: params.campaignId
        }
      });

      if (error) {
        console.error('Error fetching email stats:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch email stats:', error);
      throw error;
    }
  },
  
  async getCampaignStats(campaignId: string, params: Omit<SendgridStatsParams, 'campaignId'> = {}): Promise<EmailStats[]> {
    return this.getStats({
      ...params,
      statsType: 'categories',
      campaignId
    });
  },

  async getEmailActivity(params: SendgridActivityParams = {}): Promise<{messages: EmailActivity[], next_cursor: string | null}> {
    try {
      const { data, error } = await supabase.functions.invoke('sendgrid-activity', {
        body: {
          limit: params.limit || 50,
          query: params.query,
          before: params.before,
          after: params.after
        }
      });

      if (error) {
        console.error('Error fetching email activity:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch email activity:', error);
      throw error;
    }
  },
  
  // SendGrid direct email method
  async sendQuoteEmail(data: {
    to: string;
    subject: string;
    html: string;
    from?: string;
    text?: string;
  }) {
    try {
      const { data: result, error } = await supabase.functions.invoke('sendgrid-send', {
        body: {
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
          from: data.from || 'devis@i-numera.com'
        }
      });

      if (error) {
        console.error('Error sending email with SendGrid:', error);
        throw new Error(error.message);
      }

      return result;
    } catch (error) {
      console.error('Failed to send email with SendGrid:', error);
      throw error;
    }
  },
  
  // Helper to format stats data for charts
  formatStatsForCharts(data: EmailStats[]): any {
    return data.map(day => ({
      date: new Date(day.date).toLocaleDateString(),
      delivered: day.stats[0]?.delivered || 0,
      opens: day.stats[0]?.opens || 0,
      clicks: day.stats[0]?.clicks || 0,
      bounces: day.stats[0]?.bounces || 0
    }));
  },
  
  // Calculate summary stats
  calculateSummaryStats(data: EmailStats[]): any {
    const summary = {
      totalSent: 0,
      totalDelivered: 0,
      totalOpens: 0,
      totalClicks: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0
    };
    
    data.forEach(day => {
      summary.totalSent += day.stats[0]?.requests || 0;
      summary.totalDelivered += day.stats[0]?.delivered || 0;
      summary.totalOpens += day.stats[0]?.opens || 0;
      summary.totalClicks += day.stats[0]?.clicks || 0;
    });
    
    // Calculate rates
    if (summary.totalDelivered > 0) {
      summary.openRate = (summary.totalOpens / summary.totalDelivered) * 100;
      summary.clickRate = (summary.totalClicks / summary.totalDelivered) * 100;
      summary.bounceRate = ((summary.totalSent - summary.totalDelivered) / summary.totalSent) * 100;
    }
    
    return summary;
  }
};

// Helper function to get default start date (30 days ago)
function getDefaultStartDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}
