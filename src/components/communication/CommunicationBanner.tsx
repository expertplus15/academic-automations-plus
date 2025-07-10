import React from 'react';
import { MessageSquare, Users, Bell, Megaphone } from 'lucide-react';

export function CommunicationBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-white">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Module Communication</h1>
            <p className="text-white/80">Centre de communication unifié - Messages, notifications et annonces</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            <MessageSquare className="w-5 h-5 text-white" />
            <div>
              <p className="text-sm text-white/70">Messages</p>
              <p className="text-lg font-semibold">Instantané</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            <Bell className="w-5 h-5 text-white" />
            <div>
              <p className="text-sm text-white/70">Notifications</p>
              <p className="text-lg font-semibold">Temps réel</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            <Users className="w-5 h-5 text-white" />
            <div>
              <p className="text-sm text-white/70">Répertoire</p>
              <p className="text-lg font-semibold">Unifié</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            <Megaphone className="w-5 h-5 text-white" />
            <div>
              <p className="text-sm text-white/70">Annonces</p>
              <p className="text-lg font-semibold">Ciblées</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}