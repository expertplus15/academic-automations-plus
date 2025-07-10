import React from 'react';
import { MessageSquare, Users, Bell, Megaphone } from 'lucide-react';

export function CommunicationBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-communication via-communication/90 to-communication/80 p-8 text-white shadow-2xl">
      {/* Éléments décoratifs animés */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="group flex items-center gap-3 bg-white/15 hover:bg-white/20 rounded-xl p-4 transition-all duration-300 backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium">Messages</p>
              <p className="text-lg font-bold">Instantané</p>
            </div>
          </div>
          <div className="group flex items-center gap-3 bg-white/15 hover:bg-white/20 rounded-xl p-4 transition-all duration-300 backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium">Notifications</p>
              <p className="text-lg font-bold">Temps réel</p>
            </div>
          </div>
          <div className="group flex items-center gap-3 bg-white/15 hover:bg-white/20 rounded-xl p-4 transition-all duration-300 backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium">Répertoire</p>
              <p className="text-lg font-bold">Unifié</p>
            </div>
          </div>
          <div className="group flex items-center gap-3 bg-white/15 hover:bg-white/20 rounded-xl p-4 transition-all duration-300 backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium">Annonces</p>
              <p className="text-lg font-bold">Ciblées</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}