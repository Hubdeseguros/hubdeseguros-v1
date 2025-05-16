
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Policy = {
  id: string;
  number: string;
  client: string;
  type: string;
  status: "Activa" | "Vencida";
};

function mapPolicyRow(row: any): Policy {
  // Mapear de valores de la base al frontend
  return {
    id: row.id,
    number: row.numero_poliza,
    client: row.cliente_id, // Aquí se podría buscar el nombre del cliente si está en otra tabla
    type: row.producto_id ?? "",
    status: row.estado === "VIGENTE" ? "Activa" : "Vencida",
  };
}

function policyToDb(policy: Omit<Policy, "id">) {
  return {
    numero_poliza: policy.number,
    cliente_id: policy.client,
    producto_id: policy.type,
    estado: policy.status === "Activa" ? "VIGENTE" : "VENCIDA",
  };
}

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("polizas")
      .select("id, numero_poliza, cliente_id, producto_id, estado");
    if (error) {
      setError(error.message);
    } else {
      setPolicies((data ?? []).map(mapPolicyRow));
    }
    setLoading(false);
  };

  const addPolicy = async (policy: Omit<Policy, "id">) => {
    const dbPayload = policyToDb(policy);
    const { error } = await supabase.from("polizas").insert(dbPayload);
    if (error) setError(error.message);
    else await fetchPolicies();
  };

  const updatePolicy = async (id: string, policy: Omit<Policy, "id">) => {
    const dbPayload = policyToDb(policy);
    const { error } = await supabase.from("polizas").update(dbPayload).eq("id", id);
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
