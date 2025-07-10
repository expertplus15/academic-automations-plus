import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface CommunicationState {
  activeConversation: string | null;
  conversations: any[];
  announcements: any[];
  contacts: any[];
  isLoading: boolean;
}

interface CommunicationContextType extends CommunicationState {
  setActiveConversation: (id: string | null) => void;
  setConversations: (conversations: any[]) => void;
  setAnnouncements: (announcements: any[]) => void;
  setContacts: (contacts: any[]) => void;
  setIsLoading: (loading: boolean) => void;
  refreshData: () => void;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export function CommunicationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CommunicationState>({
    activeConversation: null,
    conversations: [],
    announcements: [],
    contacts: [],
    isLoading: false,
  });

  const setActiveConversation = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeConversation: id }));
  }, []);

  const setConversations = useCallback((conversations: any[]) => {
    setState(prev => ({ ...prev, conversations }));
  }, []);

  const setAnnouncements = useCallback((announcements: any[]) => {
    setState(prev => ({ ...prev, announcements }));
  }, []);

  const setContacts = useCallback((contacts: any[]) => {
    setState(prev => ({ ...prev, contacts }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const refreshData = useCallback(() => {
    // Logic to refresh all communication data
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => setIsLoading(false), 500);
  }, [setIsLoading]);

  const contextValue = useMemo(() => ({
    ...state,
    setActiveConversation,
    setConversations,
    setAnnouncements,
    setContacts,
    setIsLoading,
    refreshData,
  }), [state, setActiveConversation, setConversations, setAnnouncements, setContacts, setIsLoading, refreshData]);

  return (
    <CommunicationContext.Provider value={contextValue}>
      {children}
    </CommunicationContext.Provider>
  );
}

export function useCommunication() {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
}