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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      funnels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      instagram_accounts: {
        Row: {
          access_token: string | null
          connected_at: string | null
          created_at: string
          display_name: string | null
          id: string
          instagram_user_id: string | null
          notes: string | null
          permissions: Json | null
          status: Database["public"]["Enums"]["account_status"]
          tags: Json | null
          token_type: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          access_token?: string | null
          connected_at?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          instagram_user_id?: string | null
          notes?: string | null
          permissions?: Json | null
          status?: Database["public"]["Enums"]["account_status"]
          tags?: Json | null
          token_type?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          access_token?: string | null
          connected_at?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          instagram_user_id?: string | null
          notes?: string | null
          permissions?: Json | null
          status?: Database["public"]["Enums"]["account_status"]
          tags?: Json | null
          token_type?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      library_folders: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loops: {
        Row: {
          account_id: string | null
          cover_url: string | null
          created_at: string
          cycles: number | null
          effects: Json | null
          folder_id: string | null
          id: string
          interval_minutes: number
          is_active: boolean
          is_infinite: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          cover_url?: string | null
          created_at?: string
          cycles?: number | null
          effects?: Json | null
          folder_id?: string | null
          id?: string
          interval_minutes?: number
          is_active?: boolean
          is_infinite?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          cover_url?: string | null
          created_at?: string
          cycles?: number | null
          effects?: Json | null
          folder_id?: string | null
          id?: string
          interval_minutes?: number
          is_active?: boolean
          is_infinite?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loops_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "instagram_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loops_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "library_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      media_items: {
        Row: {
          created_at: string
          file_name: string | null
          file_url: string | null
          folder_id: string | null
          id: string
          media_type: Database["public"]["Enums"]["media_type"]
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          folder_id?: string | null
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          folder_id?: string | null
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_items_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "library_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      queue_items: {
        Row: {
          account_id: string | null
          account_username: string | null
          caption_id: string | null
          created_at: string
          id: string
          media_id: string | null
          media_name: string | null
          mode: Database["public"]["Enums"]["queue_mode"]
          post_mode: Database["public"]["Enums"]["post_mode"]
          scheduled_for: string | null
          status: Database["public"]["Enums"]["queue_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          account_username?: string | null
          caption_id?: string | null
          created_at?: string
          id?: string
          media_id?: string | null
          media_name?: string | null
          mode?: Database["public"]["Enums"]["queue_mode"]
          post_mode?: Database["public"]["Enums"]["post_mode"]
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          account_username?: string | null
          caption_id?: string | null
          created_at?: string
          id?: string
          media_id?: string | null
          media_name?: string | null
          mode?: Database["public"]["Enums"]["queue_mode"]
          post_mode?: Database["public"]["Enums"]["post_mode"]
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "instagram_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_items_caption_id_fkey"
            columns: ["caption_id"]
            isOneToOne: false
            referencedRelation: "saved_captions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_items_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_captions: {
        Row: {
          content: string
          created_at: string
          id: string
          is_random: boolean
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_random?: boolean
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_random?: boolean
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          account_id: string | null
          created_at: string
          id: string
          media_id: string | null
          status: Database["public"]["Enums"]["story_status"]
          strategy: Database["public"]["Enums"]["story_strategy"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          id?: string
          media_id?: string | null
          status?: Database["public"]["Enums"]["story_status"]
          strategy?: Database["public"]["Enums"]["story_strategy"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          id?: string
          media_id?: string | null
          status?: Database["public"]["Enums"]["story_status"]
          strategy?: Database["public"]["Enums"]["story_strategy"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "instagram_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
        ]
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
      warmup_accounts: {
        Row: {
          account_id: string
          created_at: string
          current_status: Database["public"]["Enums"]["warmup_status"]
          daily_target: number
          id: string
          interval_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["warmup_status"]
          daily_target?: number
          id?: string
          interval_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["warmup_status"]
          daily_target?: number
          id?: string
          interval_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warmup_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "instagram_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_status: "active" | "warming" | "paused" | "quarantined"
      app_role: "admin" | "member" | "viewer"
      media_type: "video" | "image"
      post_mode: "sequential" | "burst"
      queue_mode: "now" | "scheduled"
      queue_status: "pending" | "processing" | "completed" | "paused" | "failed"
      story_status: "draft" | "queued" | "posted" | "failed"
      story_strategy: "none" | "link_bio" | "text_cta"
      warmup_status: "active" | "completed" | "paused"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      account_status: ["active", "warming", "paused", "quarantined"],
      app_role: ["admin", "member", "viewer"],
      media_type: ["video", "image"],
      post_mode: ["sequential", "burst"],
      queue_mode: ["now", "scheduled"],
      queue_status: ["pending", "processing", "completed", "paused", "failed"],
      story_status: ["draft", "queued", "posted", "failed"],
      story_strategy: ["none", "link_bio", "text_cta"],
      warmup_status: ["active", "completed", "paused"],
    },
  },
} as const
