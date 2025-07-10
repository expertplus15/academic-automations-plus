import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const CommunicationSkeleton = () => (
  <div className="space-y-6 p-6 animate-fade-in">
    {/* Banner skeleton */}
    <div className="animate-pulse">
      <div className="h-48 bg-gradient-to-br from-muted/50 to-muted rounded-3xl"></div>
    </div>
    
    {/* Stats cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-muted rounded-xl"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    
    {/* Module cards skeleton */}
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-6 bg-muted rounded w-48 mb-2"></div>
        <div className="h-4 bg-muted rounded w-32"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-md">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-muted rounded w-24"></div>
                    <div className="h-4 bg-muted rounded w-40"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-28"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export const MessageListSkeleton = () => (
  <div className="p-4 space-y-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const ChatWindowSkeleton = () => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b">
      <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
    </div>
    <div className="flex-1 p-4 space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-xs p-3 rounded-lg ${i % 2 === 0 ? 'bg-muted' : 'bg-primary/10'}`}>
            <div className="h-4 bg-muted rounded animate-pulse w-full mb-2" />
            <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AnnouncementsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="border rounded-lg p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-16" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </div>
        <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
      </div>
    ))}
  </div>
);