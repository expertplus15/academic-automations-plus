import { useState, useCallback } from 'react';

interface EditingState {
  elementId: string | null;
  isEditing: boolean;
}

export function useInlineEditor() {
  const [editingState, setEditingState] = useState<EditingState>({
    elementId: null,
    isEditing: false
  });

  const startEditing = useCallback((elementId: string) => {
    setEditingState({
      elementId,
      isEditing: true
    });
  }, []);

  const stopEditing = useCallback(() => {
    setEditingState({
      elementId: null,
      isEditing: false
    });
  }, []);

  const isElementEditing = useCallback((elementId: string) => {
    return editingState.isEditing && editingState.elementId === elementId;
  }, [editingState]);

  return {
    editingState,
    startEditing,
    stopEditing,
    isElementEditing
  };
}