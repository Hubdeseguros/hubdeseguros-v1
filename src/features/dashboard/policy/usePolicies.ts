
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Ajuste del tipo para reflejar la tabla real
export type Policy = {
  id: string;
  number: string;
  client: string;
  type: string;
  status: "Activa" | "Vencida";
};

// Corrige el uso: usa la tabla 'polizas' en lugar de 'policies'
export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    // Selecciona los campos básicos para el tipo Policy
    const { data, error } = await supabase.from("polizas").select("id, numero_poliza, cliente_id, producto_id, estado");
    if (error) setError(error.message);
    else setPolicies(
      (data ?? []).map((row: any) => ({
        id: row.id,
        number: row.numero_poliza,
        client: row.cliente_id, // Puedes mapearlo después al nombre real si tienes la relación
        type: row.producto_id ?? "",
        status: row.estado === true || row.estado === "Activa" ? "Activa" : "Vencida",
      }))
    );
    setLoading(false);
  };

  const addPolicy = async (policy: Omit<Policy, "id">) => {
    const { error } = await supabase.from("polizas").insert({
      numero_poliza: policy.number,
      cliente_id: policy.client,
      producto_id: policy.type,
      estado: policy.status === "Activa" ? "Activa" : "Vencida",
    });
    if (error) setError(error.message);
    else await fetchPolicies();
  };

  const updatePolicy = async (id: string, policy: Omit<Policy, "id">) => {
    const { error } = await supabase.from("polizas")
      .update({
        numero_poliza: policy.number,
        cliente_id: policy.client,
        producto_id: policy.type,
        estado: policy.status === "Activa" ? "Activa" : "Vencida",
      })
      .eq("id", id);
    if (error) setError(error.message);
    else await fetchPolicies();
  };

  const deletePolicy = async (id: string) => {
    const { error } = await supabase.from("polizas").delete().eq("id", id);
    if (error) setError(error.message);
    else await fetchPolicies();
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return { policies, loading, error, addPolicy, updatePolicy, deletePolicy, fetchPolicies };
} 
