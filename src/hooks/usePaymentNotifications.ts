import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser"; // Hook de usuario autenticado

export function usePaymentNotifications() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    // Suscribirse a nuevas notificaciones de pago para el usuario
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
            variant: notif.type === "EMAIL" || notif.type === "SMS" ? "success" : "info",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
} 