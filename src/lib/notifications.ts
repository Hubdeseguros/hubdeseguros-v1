
import { supabase } from "@/integrations/supabase/client";

export type Notification = {
  id: string;
  usuario_id: string;
  titulo: string;
  mensaje: string;
  leida: boolean | null;
  fecha_envio: string | null;
};

export async function getNotifications(usuario_id: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notificaciones")
    .select("*")
    .eq("usuario_id", usuario_id)
    .order("fecha_envio", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function markAsRead(id: string) {
  await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("id", id);
}

export async function markAllAsRead(usuario_id: string) {
  await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("usuario_id", usuario_id);
}

export async function addNotification(notification: Notification) {
  const { error } = await supabase
    .from("notificaciones")
    .insert(notification);
  if (error) throw error;
}

// For backwards compatibility, left notifyPagoRealizado as no-op
export async function notifyPagoRealizado(user_id: string) {
  // Stub
}
