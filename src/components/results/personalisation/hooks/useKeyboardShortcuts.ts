import { useEffect } from 'react';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function useKeyboardShortcuts() {
  const { actions } = useTemplateEditorContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for our shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            actions.saveTemplate();
            break;
          case '+':
          case '=':
            event.preventDefault();
            actions.handleZoomIn();
            break;
          case '-':
            event.preventDefault();
            actions.handleZoomOut();
            break;
          case '0':
            event.preventDefault();
            actions.handleZoomReset();
            break;
        }
      }

      // Other shortcuts
      switch (event.key) {
        case 'F11':
          event.preventDefault();
          actions.toggleFullscreen();
          break;
        case 'g':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            actions.toggleGrid();
          }
          break;
        case 'p':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            actions.togglePreviewMode();
          }
          break;
        case 'Escape':
          actions.setSelectedElement(null);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [actions]);
}
