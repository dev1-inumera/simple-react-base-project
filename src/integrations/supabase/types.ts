export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          objectives: string | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          objectives?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          objectives?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_sequences: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          title: string
          updated_at: string
          user_id: string
          week_number: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          week_number: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          week_number?: number
        }
        Relationships: []
      }
      folders: {
        Row: {
          agent_id: string
          client_id: string
          created_at: string | null
          id: string
          name: string
          quote_id: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          client_id: string
          created_at?: string | null
          id?: string
          name: string
          quote_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          client_id?: string
          created_at?: string | null
          id?: string
          name?: string
          quote_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_assignments: {
        Row: {
          agent_id: string
          assigned_at: string | null
          created_by: string
          id: string
          lead_id: string
          status: string
        }
        Insert: {
          agent_id: string
          assigned_at?: string | null
          created_by: string
          id?: string
          lead_id: string
          status?: string
        }
        Update: {
          agent_id?: string
          assigned_at?: string | null
          created_by?: string
          id?: string
          lead_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          agent_id: string
          content: string
          created_at: string | null
          id: string
          lead_id: string
        }
        Insert: {
          agent_id: string
          content: string
          created_at?: string | null
          id?: string
          lead_id: string
        }
        Update: {
          agent_id?: string
          content?: string
          created_at?: string | null
          id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tasks: {
        Row: {
          agent_id: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          campaign_id: string
          company: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          position: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          position?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          company?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          position?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offer_extras: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          offer_id: string
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          offer_id: string
          unit_price?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          offer_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "offer_extras_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_features: {
        Row: {
          created_at: string | null
          feature: string
          id: string
          offer_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature: string
          id?: string
          offer_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature?: string
          id?: string
          offer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_features_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_plate_items: {
        Row: {
          created_at: string | null
          id: string
          offer_id: string
          offer_plate_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          offer_id: string
          offer_plate_id: string
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          offer_id?: string
          offer_plate_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "offer_plate_items_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_plate_items_offer_plate_id_fkey"
            columns: ["offer_plate_id"]
            isOneToOne: false
            referencedRelation: "offer_plates"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_plates: {
        Row: {
          agent_id: string
          client_id: string | null
          created_at: string | null
          folder_id: string | null
          id: string
          name: string
          sent_at: string | null
          sent_method: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          client_id?: string | null
          created_at?: string | null
          folder_id?: string | null
          id?: string
          name: string
          sent_at?: string | null
          sent_method?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          client_id?: string | null
          created_at?: string | null
          folder_id?: string | null
          id?: string
          name?: string
          sent_at?: string | null
          sent_method?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_plates_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price_monthly: number
          setup_fee: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price_monthly?: number
          setup_fee?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price_monthly?: number
          setup_fee?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_info: {
        Row: {
          bank_name: string
          bic: string
          created_at: string
          iban: string
          id: string
          quote_id: string
          updated_at: string
        }
        Insert: {
          bank_name: string
          bic: string
          created_at?: string
          iban: string
          id?: string
          quote_id: string
          updated_at?: string
        }
        Update: {
          bank_name?: string
          bic?: string
          created_at?: string
          iban?: string
          id?: string
          quote_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_info_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_notifications: {
        Row: {
          amount: number
          client_name: string
          created_at: string
          description: string
          fee: number
          id: string
          merchant_payment_reference: string
          notification_token: string
          payment_method: string
          payment_reference: string
          payment_status: string
          processed: boolean | null
          quote_id: string | null
        }
        Insert: {
          amount: number
          client_name: string
          created_at?: string
          description: string
          fee: number
          id?: string
          merchant_payment_reference: string
          notification_token: string
          payment_method: string
          payment_reference: string
          payment_status: string
          processed?: boolean | null
          quote_id?: string | null
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string
          description?: string
          fee?: number
          id?: string
          merchant_payment_reference?: string
          notification_token?: string
          payment_method?: string
          payment_reference?: string
          payment_status?: string
          processed?: boolean | null
          quote_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_notifications_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          birth_date: string | null
          business_sector: string | null
          company_name: string | null
          company_role: string | null
          created_at: string | null
          email: string | null
          email_notifications: boolean | null
          first_name: string | null
          id: string
          language: string | null
          last_name: string | null
          manager_name: string | null
          phone: string | null
          profile_image: string | null
          role: Database["public"]["Enums"]["user_role"]
          theme: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          business_sector?: string | null
          company_name?: string | null
          company_role?: string | null
          created_at?: string | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          language?: string | null
          last_name?: string | null
          manager_name?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          business_sector?: string | null
          company_name?: string | null
          company_role?: string | null
          created_at?: string | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          manager_name?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          agent_id: string
          client_id: string | null
          created_at: string | null
          id: string
          offer_plate_id: string
          payment_status: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          offer_plate_id: string
          payment_status?: string
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          offer_plate_id?: string
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_offer_plate_id_fkey"
            columns: ["offer_plate_id"]
            isOneToOne: false
            referencedRelation: "offer_plates"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          agent_id: string | null
          campaign_id: string | null
          created_at: string | null
          data: Json | null
          generated_at: string | null
          id: string
          name: string
          parameters: Json | null
          type: string
        }
        Insert: {
          agent_id?: string | null
          campaign_id?: string | null
          created_at?: string | null
          data?: Json | null
          generated_at?: string | null
          id?: string
          name: string
          parameters?: Json | null
          type: string
        }
        Update: {
          agent_id?: string | null
          campaign_id?: string | null
          created_at?: string | null
          data?: Json | null
          generated_at?: string | null
          id?: string
          name?: string
          parameters?: Json | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          address: string | null
          business_sector: string | null
          client_id: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          business_sector?: string | null
          client_id: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          business_sector?: string | null
          client_id?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "surveys_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "client" | "agent" | "admin" | "responsable_plateau"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["client", "agent", "admin", "responsable_plateau"],
    },
  },
} as const
