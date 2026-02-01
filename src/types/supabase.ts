// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          phone: string;
          email: string;
          items: Json;
          total: number;
          payment_method: string;
          pickup_date: string | null;
          pickup_time: string | null;
          special_instructions: string | null;
          status: string;
          branch_id: string;
          order_status: string | null;
          delivery_date: string | null;
          delivery_time: string | null;
          delivery_address: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          phone: string;
          email: string;
          items: Json;
          total: number;
          payment_method: string;
          pickup_date?: string | null;
          pickup_time?: string | null;
          special_instructions?: string | null;
          status?: string;
          branch_id: string;
          order_status?: string | null;
          delivery_date?: string | null;
          delivery_time?: string | null;
          delivery_address?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          phone?: string;
          email?: string;
          items?: Json;
          total?: number;
          payment_method?: string;
          pickup_date?: string | null;
          pickup_time?: string | null;
          special_instructions?: string | null;
          status?: string;
          branch_id?: string;
          order_status?: string | null;
          delivery_date?: string | null;
          delivery_time?: string | null;
          delivery_address?: string | null;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
