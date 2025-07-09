import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/communication/useNotifications';
import { cn } from '@/lib/utils';

interface RealTimeNotificationBadgeProps {
  className?: string;
  showZero?: boolean;
}

export function RealTimeNotificationBadge({ 
  className, 
  showZero = false 
}: RealTimeNotificationBadgeProps) {
  const { unreadCount } = useNotifications();

  if (!showZero && unreadCount === 0) {
    return null;
  }

  return (
    <Badge 
      variant="destructive" 
      className={cn(
        "h-5 min-w-[1.25rem] text-xs flex items-center justify-center px-1",
        unreadCount > 99 && "px-1.5",
        className
      )}
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
}