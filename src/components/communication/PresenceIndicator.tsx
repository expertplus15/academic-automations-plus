import React from 'react';
import { Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePresence } from '@/hooks/communication/usePresence';

interface PresenceIndicatorProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

export function PresenceIndicator({ 
  userId, 
  size = 'md', 
  showStatus = false, 
  className = '' 
}: PresenceIndicatorProps) {
  const { getUserStatus } = usePresence();
  const status = getUserStatus(userId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-500';
      case 'AWAY':
        return 'bg-yellow-500';
      case 'BUSY':
        return 'bg-red-500';
      case 'OFFLINE':
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'En ligne';
      case 'AWAY':
        return 'Absent';
      case 'BUSY':
        return 'Occupé';
      case 'OFFLINE':
      default:
        return 'Hors ligne';
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'lg':
        return 'w-4 h-4';
      case 'md':
      default:
        return 'w-3 h-3';
    }
  };

  if (showStatus) {
    return (
      <Badge variant="outline" className={`gap-1 ${className}`}>
        <Circle className={`${getSizeClass(size)} ${getStatusColor(status)} rounded-full`} fill="currentColor" />
        {getStatusText(status)}
      </Badge>
    );
  }

  return (
    <Circle 
      className={`${getSizeClass(size)} ${getStatusColor(status)} rounded-full border-2 border-white ${className}`} 
      fill="currentColor" 
    />
  );
}

interface OnlineUsersListProps {
  className?: string;
  maxDisplay?: number;
}

export function OnlineUsersList({ className = '', maxDisplay = 10 }: OnlineUsersListProps) {
  const { getOnlineUsers } = usePresence();
  const onlineUsers = getOnlineUsers();

  if (onlineUsers.length === 0) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        Aucun utilisateur en ligne
      </div>
    );
  }

  const displayUsers = onlineUsers.slice(0, maxDisplay);
  const remainingCount = onlineUsers.length - maxDisplay;

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-muted-foreground">
        Utilisateurs en ligne ({onlineUsers.length})
      </h4>
      <div className="space-y-1">
        {displayUsers.map((user) => (
          <div key={user.user_id} className="flex items-center gap-2 text-sm">
            <PresenceIndicator userId={user.user_id} size="sm" />
            <span>{user.user?.full_name || 'Utilisateur'}</span>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="text-xs text-muted-foreground">
            +{remainingCount} autres utilisateurs
          </div>
        )}
      </div>
    </div>
  );
}