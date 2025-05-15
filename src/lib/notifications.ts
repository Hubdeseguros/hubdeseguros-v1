export type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
};

let notifications: Notification[] = [
  {
    id: "1",
    title: "Vencimiento de póliza",
    description: "Tu póliza de auto vence en 3 días.",
    date: new Date().toISOString(),
    read: false,
    type: "warning",
  },
  {
    id: "2",
    title: "Pago recibido",
    description: "Se ha registrado el pago de tu póliza de vida.",
    date: new Date().toISOString(),
    read: false,
    type: "success",
  },
];

export function getNotifications(): Notification[] {
  return notifications;
}

export function markAsRead(id: string) {
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
}

export function markAllAsRead() {
  notifications = notifications.map((n) => ({ ...n, read: true }));
}

export function addNotification(notification: Omit<Notification, "id" | "date" | "read">) {
  notifications = [
    {
      ...notification,
      id: (Math.random() * 100000).toFixed(0),
      date: new Date().toISOString(),
      read: false,
    },
    ...notifications,
  ];
} 