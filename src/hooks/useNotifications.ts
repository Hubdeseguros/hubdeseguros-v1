
import { useEffect, useState, useCallback } from "react";
import * as notifService from "@/lib/notifications";
import { useAuth } from "@/hooks/useAuth"; // Usar el hook correcto

export function useNotifications() {
  const { user } = useAuth(); // Extraer user del nuevo hook
  const [notifications, setNotifications] = useState<notifService.Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await notifService.getNotifications(user.id);
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    // Opcional: suscripción en tiempo real con supabase.channel
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
