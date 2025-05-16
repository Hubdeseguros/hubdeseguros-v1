import { useNotifications } from "@/hooks/useNotifications";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount, loading } =
    useNotifications();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Centro de Notificaciones</h1>
      <div className="mb-4 flex justify-between items-center">
        <span>{unreadCount} sin leer</span>
        <Button
          onClick={markAllAsRead}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          Marcar todas como leídas
        </Button>
      </div>
      <div className="space-y-4">
        {loading && <p>Cargando...</p>}
        {!loading && notifications.length === 0 && (
          <p>No tienes notificaciones.</p>
        )}
        {notifications.map((n) => (
          <Alert
            key={n.id}
            variant="default"
            className={n.read ? "opacity-60" : ""}
          >
            <AlertTitle>{n.title}</AlertTitle>
            <AlertDescription>{n.description}</AlertDescription>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {new Date(n.date).toLocaleString()}
              </span>
              {!n.read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => markAsRead(n.id)}
                >
                  Marcar como leída
                </Button>
              )}
            </div>
          </Alert>
        ))}
      </div>
    </div>
  );
}
