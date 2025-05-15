import { useState } from "react";
import * as notifService from "@/lib/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState(notifService.getNotifications());

  const refresh = () => setNotifications(notifService.getNotifications());
  const markAsRead = (id: string) => {
    notifService.markAsRead(id);
    refresh();
  };
  const markAllAsRead = () => {
    notifService.markAllAsRead();
    refresh();
  };

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead,
    markAllAsRead,
    refresh,
  };
} 