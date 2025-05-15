import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];

export async function getNotifications(user_id: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id)
    .order("date", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function markAsRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);
  if (error) throw error;
}

export async function markAllAsRead(user_id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user_id)
    .eq("read", false);
  if (error) throw error;
}

export async function addNotification(notification: NotificationInsert) {
  const { error } = await supabase
    .from("notifications")
    .insert([notification]);
  if (error) throw error;
}

export async function notifyPagoRealizado(user_id: string) {
  await addNotification({
    user_id,
    title: "Pago realizado",
    description: "Tu pago fue registrado exitosamente.",
    type: "success",
    read: false,
    date: new Date().toISOString(),
  });
} 