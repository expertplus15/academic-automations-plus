import { useCallback } from 'react';
import { TemplateElement } from '../types';

export function useCanvasOperations() {
  const handleElementDrag = useCallback((elementId: string, delta: { x: number; y: number }) => {
    // Handle element dragging
    return { elementId, newPosition: delta };
  }, []);

  const handleElementResize = useCallback((elementId: string, newSize: { width: number; height: number }) => {
    // Handle element resizing
    return { elementId, newSize };
  }, []);

  const getSnapPosition = useCallback((position: { x: number; y: number }, gridSize = 10) => {
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    };
  }, []);

  const isColliding = useCallback((element1: TemplateElement, element2: TemplateElement) => {
    return !(
      element1.x + element1.width <= element2.x ||
      element2.x + element2.width <= element1.x ||
      element1.y + element1.height <= element2.y ||
      element2.y + element2.height <= element1.y
    );
  }, []);

  return {
    handleElementDrag,
    handleElementResize,
    getSnapPosition,
    isColliding,
  };
}