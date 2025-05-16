import { supabase } from "@/integrations/supabase/client";
import { Agent, AgentFormData } from "../types";

export const agentService = {
  getAll: async (): Promise<Agent[]> => {
    const { data, error } = await supabase.from("agents").select("*");
    if (error) throw error;
    // `data` may be null if there are no rows, always fallback to []
    return data ?? [];
  },
  getById: async (id: string): Promise<Agent | null> => {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },
  create: async (data: AgentFormData): Promise<Agent> => {
    // Insert a single agent, returning the new row
    const { data: created, error } = await supabase
      .from("agents")
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return created;
  },
  update: async (id: string, data: Partial<AgentFormData>): Promise<Agent> => {
    const { data: updated, error } = await supabase
      .from("agents")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("agents").delete().eq("id", id);
    if (error) throw error;
  },
};
