export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string | Date;
  read: boolean;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}
