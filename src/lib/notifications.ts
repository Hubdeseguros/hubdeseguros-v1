
import { supabase } from "@/integrations/supabase/client";

export type Notification = {
  id: string;
  recipient: string;
  type: "SMS" | "EMAIL" | "PUSH" | "WEBHOOK";
  status: "PENDING" | "SENT" | "FAILED";
  content: string | null;
  created_at: string | null;
  updated_at: string | null;
  next_retry_at: string | null;
  retry_count: number | null;
  sent_at: string | null;
  transaction_id: string | null;
};

export async function getNotifications(recipient: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("payment_notifications")
    .select("*")
    .eq("recipient", recipient)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function markAsRead(id: string) {
  // Not provided in schema, so just a stub or ignore; could update a "read" Boolean if available.
}

export async function markAllAsRead(user_id: string) {
  // Not provided in schema, so just a stub or ignore.
}

export async function addNotification(notification: Partial<Notification>) {
  const { error } = await supabase
    .from("payment_notifications")
    .insert([notification]);
  if (error) throw error;
}

// For backwards compatibility, left notifyPagoRealizado as no-op
export async function notifyPagoRealizado(user_id: string) {
  // Stub
}
