import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { MessagesList } from '@/components/communication/MessagesList';
import { ChatWindow } from '@/components/communication/ChatWindow';

export default function Messaging() {
  return (
    <ModuleLayout>
      <div className="h-[calc(100vh-12rem)] flex">
        <div className="w-1/3 border-r border-border">
          <MessagesList />
        </div>
        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </ModuleLayout>
  );
}