
import { useEffect, useState, useCallback } from "react";
import * as notifService from "@/lib/notifications";
import { useAuth } from "@/hooks/useAuth";

// FE notification type for UI:
export type UINotification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
};

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const rawData = await notifService.getNotifications(user.id);

      // Map Supabase notificaciones to UI notifications
      setNotifications(
        (rawData ?? []).map((n) => ({
          id: n.id,
          title: n.titulo,
          description: n.mensaje || "",
          date: n.fecha_envio || "",
          read: !!n.leida,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    await notifService.markAsRead(id);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await notifService.markAllAsRead(user.id);
    fetchNotifications();
  };

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
    loading,
  };
}
