
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function usePaymentNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime:payment_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "payment_notifications",
          filter: `recipient=eq.${user.email}`,
        },
        (payload) => {
          const notif = payload.new;
          toast({
            title: "Notificación de Pago",
            description: notif.content,
            variant: "default",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
}
