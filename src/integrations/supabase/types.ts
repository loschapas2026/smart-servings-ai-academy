export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      content_progress: {
        Row: {
          completed_at: string
          content_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          content_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          content_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
        ]
      }
      contents: {
        Row: {
          body: string | null
          category: string | null
          created_at: string
          duration: string | null
          file_url: string | null
          id: string
          position: number
          published: boolean
          summary: string | null
          thumbnail_url: string | null
          title: string
          type: Database["public"]["Enums"]["content_type"]
          video_url: string | null
        }
        Insert: {
          body?: string | null
          category?: string | null
          created_at?: string
          duration?: string | null
          file_url?: string | null
          id?: string
          position?: number
          published?: boolean
          summary?: string | null
          thumbnail_url?: string | null
          title: string
          type: Database["public"]["Enums"]["content_type"]
          video_url?: string | null
        }
        Update: {
          body?: string | null
          category?: string | null
          created_at?: string
          duration?: string | null
          file_url?: string | null
          id?: string
          position?: number
          published?: boolean
          summary?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["content_type"]
          video_url?: string | null
        }
        Relationships: []
      }
      live_meetings: {
        Row: {
          announced_at: string | null
          created_at: string
          id: string
          link: string | null
          reminder_sent_at: string | null
          starts_at: string
          title: string
        }
        Insert: {
          announced_at?: string | null
          created_at?: string
          id?: string
          link?: string | null
          reminder_sent_at?: string | null
          starts_at: string
          title: string
        }
        Update: {
          announced_at?: string | null
          created_at?: string
          id?: string
          link?: string | null
          reminder_sent_at?: string | null
          starts_at?: string
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          attempts: number
          body: string
          created_at: string
          dedupe_key: string | null
          delivered_at: string | null
          error: string | null
          id: string
          read_at: string | null
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          to_phone: string
          twilio_sid: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          attempts?: number
          body: string
          created_at?: string
          dedupe_key?: string | null
          delivered_at?: string | null
          error?: string | null
          id?: string
          read_at?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          to_phone: string
          twilio_sid?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          attempts?: number
          body?: string
          created_at?: string
          dedupe_key?: string | null
          delivered_at?: string | null
          error?: string | null
          id?: string
          read_at?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          to_phone?: string
          twilio_sid?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          description: string | null
          environment: string
          id: string
          paid_at: string
          status: string
          stripe_charge_id: string | null
          stripe_invoice_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          description?: string | null
          environment?: string
          id?: string
          paid_at?: string
          status?: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          description?: string | null
          environment?: string
          id?: string
          paid_at?: string
          status?: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_session_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          restaurant_name: string | null
          whatsapp_opt_in: boolean
        }
        Insert: {
          active_session_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          restaurant_name?: string | null
          whatsapp_opt_in?: boolean
        }
        Update: {
          active_session_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          restaurant_name?: string | null
          whatsapp_opt_in?: boolean
        }
        Relationships: []
      }
      prompt_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          label: string
          position: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          label: string
          position?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          position?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          plan: string
          price_id: string | null
          status: Database["public"]["Enums"]["sub_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          plan: string
          price_id?: string | null
          status?: Database["public"]["Enums"]["sub_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          plan?: string
          price_id?: string | null
          status?: Database["public"]["Enums"]["sub_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_session: { Args: { _session: string }; Returns: undefined }
      has_active_subscription: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_current_session: { Args: { _session: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      content_type: "video" | "artigo" | "prompt" | "download"
      notification_status:
        | "pendente"
        | "enviando"
        | "enviado"
        | "entregue"
        | "lido"
        | "falhou"
      notification_type: "vencimento" | "reuniao" | "aviso" | "pagamento"
      sub_status: "ativa" | "pendente" | "cancelada" | "inadimplente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      content_type: ["video", "artigo", "prompt", "download"],
      notification_status: [
        "pendente",
        "enviando",
        "enviado",
        "entregue",
        "lido",
        "falhou",
      ],
      notification_type: ["vencimento", "reuniao", "aviso", "pagamento"],
      sub_status: ["ativa", "pendente", "cancelada", "inadimplente"],
    },
  },
} as const
