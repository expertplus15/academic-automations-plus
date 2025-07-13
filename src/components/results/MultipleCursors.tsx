import React, { useState, useEffect } from 'react';
import { CRDTService, CursorPosition } from '@/services/CRDTService';

interface MultipleCursorsProps {
  containerRef: React.RefObject<HTMLElement>;
}

interface CursorIndicator {
  cursor: CursorPosition;
  element: HTMLElement | null;
  x: number;
  y: number;
}

export function MultipleCursors({ containerRef }: MultipleCursorsProps) {
  const [cursors, setCursors] = useState<CursorIndicator[]>([]);

  useEffect(() => {
    const handleCursorUpdate = (event: CustomEvent) => {
      const cursor = event.detail as CursorPosition;
      updateCursorPosition(cursor);
    };

    const handlePresenceSync = (event: CustomEvent) => {
      // Update cursors when users join/leave
      const presences = event.detail;
      updateCursorsFromPresences(presences);
    };

    window.addEventListener('cursor-update', handleCursorUpdate as EventListener);
    window.addEventListener('presence-sync', handlePresenceSync as EventListener);

    return () => {
      window.removeEventListener('cursor-update', handleCursorUpdate as EventListener);
      window.removeEventListener('presence-sync', handlePresenceSync as EventListener);
    };
  }, []);

  const updateCursorPosition = (cursor: CursorPosition) => {
    if (!containerRef.current) return;

    // Find the cell element
    const cellElement = containerRef.current.querySelector(`[data-cell-id="${cursor.cellId}"]`) as HTMLElement;
    
    if (!cellElement) return;

    const rect = cellElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const indicator: CursorIndicator = {
      cursor,
      element: cellElement,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2
    };

    setCursors(prev => {
      const filtered = prev.filter(c => c.cursor.userId !== cursor.userId);
      return [...filtered, indicator];
    });

    // Remove cursor after 30 seconds of inactivity
    setTimeout(() => {
      setCursors(prev => prev.filter(c => 
        c.cursor.userId !== cursor.userId || 
        c.cursor.timestamp > Date.now() - 30000
      ));
    }, 30000);
  };

  const updateCursorsFromPresences = (presences: any) => {
    const activeUserIds = Object.keys(presences);
    setCursors(prev => prev.filter(c => activeUserIds.includes(c.cursor.userId)));
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {cursors.map((indicator) => (
        <div
          key={indicator.cursor.userId}
          className="absolute transition-all duration-200 ease-out"
          style={{
            left: indicator.x,
            top: indicator.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Cursor pointer */}
          <div
            className="relative"
            style={{ color: indicator.cursor.color }}
          >
            {/* Cursor arrow */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="absolute"
              style={{
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))`,
              }}
            >
              <path
                d="M2 2 L8 14 L11 10 L15 13 L2 2 Z"
                fill={indicator.cursor.color}
                stroke="white"
                strokeWidth="1"
              />
            </svg>

            {/* User label */}
            <div
              className="absolute top-5 left-2 px-2 py-1 rounded text-xs text-white font-medium whitespace-nowrap"
              style={{
                backgroundColor: indicator.cursor.color,
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))`,
              }}
            >
              {indicator.cursor.userName}
            </div>

            {/* Pulse animation for active cursor */}
            <div
              className="absolute w-4 h-4 rounded-full animate-ping opacity-30"
              style={{
                backgroundColor: indicator.cursor.color,
                left: '2px',
                top: '2px',
              }}
            />
          </div>

          {/* Cell highlight */}
          {indicator.element && (
            <div
              className="absolute border-2 rounded opacity-30 pointer-events-none animate-pulse"
              style={{
                borderColor: indicator.cursor.color,
                left: -(indicator.x - (indicator.element.getBoundingClientRect().left - (containerRef.current?.getBoundingClientRect().left || 0))),
                top: -(indicator.y - (indicator.element.getBoundingClientRect().top - (containerRef.current?.getBoundingClientRect().top || 0))),
                width: indicator.element.offsetWidth,
                height: indicator.element.offsetHeight,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}