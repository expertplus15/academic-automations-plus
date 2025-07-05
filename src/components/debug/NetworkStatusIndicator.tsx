import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Wifi, WifiOff, RefreshCw, Signal } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function NetworkStatusIndicator() {
  const networkStatus = useNetworkStatus();
  const [showDetails, setShowDetails] = useState(false);

  if (!networkStatus.isOnline) {
    return (
      <Popover open={showDetails} onOpenChange={setShowDetails}>
        <PopoverTrigger asChild>
          <Badge variant="destructive" className="cursor-pointer flex items-center gap-1">
            <WifiOff className="w-3 h-3" />
            Hors ligne
            {networkStatus.retryCount > 0 && ` (${networkStatus.retryCount})`}
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="font-medium">Connexion perdue</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.
            </p>
            
            {networkStatus.retryCount > 0 && (
              <div className="text-sm">
                <p>Tentatives de reconnexion: {networkStatus.retryCount}</p>
              </div>
            )}
            
            <Button 
              onClick={networkStatus.retryConnection}
              disabled={networkStatus.isRetrying}
              size="sm"
              className="w-full"
            >
              {networkStatus.isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Reconnexion...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </>
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Connexion lente
  if (networkStatus.isSlowConnection) {
    return (
      <Popover open={showDetails} onOpenChange={setShowDetails}>
        <PopoverTrigger asChild>
          <Badge variant="secondary" className="cursor-pointer flex items-center gap-1">
            <Signal className="w-3 h-3" />
            Connexion lente
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">Connexion lente détectée</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>Type de connexion: {networkStatus.effectiveType}</p>
              {networkStatus.downlink && (
                <p>Bande passante: {networkStatus.downlink} Mbps</p>
              )}
              {networkStatus.rtt && (
                <p>Latence: {networkStatus.rtt} ms</p>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Les performances peuvent être ralenties. Considérez utiliser une connexion plus rapide.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Connexion normale - indicateur discret
  return (
    <Badge variant="outline" className="flex items-center gap-1 cursor-default">
      <Wifi className="w-3 h-3 text-green-500" />
      En ligne
    </Badge>
  );
}