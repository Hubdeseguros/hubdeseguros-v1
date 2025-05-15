import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Policy = {
  id: string;
  number: string;
  client: string;
  type: string;
  status: "Activa" | "Vencida";
};

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("policies").select("*");
    if (error) setError(error.message);
    else setPolicies(data || []);
    setLoading(false);
  };

  const addPolicy = async (policy: Omit<Policy, "id">) => {
    const { error } = await supabase.from("policies").insert(policy);
    if (error) setError(error.message);
    else await fetchPolicies();
  };

  const updatePolicy = async (id: string, policy: Omit<Policy, "id">) => {
    const { error } = await supabase.from("policies").update(policy).eq("id", id);
    if (error) setError(error.message);
    else await fetchPolicies();
  };

  const deletePolicy = async (id: string) => {
    const { error } = await supabase.from("policies").delete().eq("id", id);
    if (error) setError(error.message);
    else await fetchPolicies();
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return { policies, loading, error, addPolicy, updatePolicy, deletePolicy, fetchPolicies };
} 