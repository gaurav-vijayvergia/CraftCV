import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../../../lib/utils';

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function DroppableArea({ id, children, className }: DroppableAreaProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef} 
      className={cn(
        'min-h-[50px] rounded border border-dashed border-transparent transition-colors',
        isOver && 'border-primary bg-primary/5',
        className
      )}
    >
      {children}
    </div>
  );
}