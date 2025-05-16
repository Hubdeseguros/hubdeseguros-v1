import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';

export function NotificationBadge() {
  const { unreadCount } = useNotifications();

  return (
    <Badge variant="secondary" className="ml-2">
      {unreadCount}
    </Badge>
  );
}
