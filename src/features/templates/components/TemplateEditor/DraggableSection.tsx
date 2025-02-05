import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Section } from '../../types';
import { cn } from '../../../../lib/utils';

interface DraggableSectionProps {
  section: Section;
  onRemove: (id: string) => void;
}

export default function DraggableSection({ section, onRemove }: DraggableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: section.id,
    data: section,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const isFullWidth = section.type === 'header' || section.type === 'footer';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center justify-between p-3 bg-white border rounded-lg group transition-all',
        isDragging ? 'opacity-50 shadow-lg' : 'hover:border-primary',
        isFullWidth && 'col-span-full'
      )}
      {...attributes}
    >
      <div className="flex items-center space-x-3">
        <button
          className="cursor-grab text-gray-400 hover:text-gray-600"
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-gray-900">{section.title}</span>
      </div>
      <button
        onClick={() => onRemove(section.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}