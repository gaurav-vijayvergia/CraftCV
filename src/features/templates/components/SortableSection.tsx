import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { useTemplateStore } from '../../../store/template';
import { Section } from '../types';
import { cn } from '../../../lib/utils';

interface SortableSectionProps {
  section: Section;
}

export default function SortableSection({ section }: SortableSectionProps) {
  const { removeSection } = useTemplateStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center justify-between p-3 bg-white border rounded-lg group',
        isDragging ? 'opacity-50' : 'hover:border-primary',
        section.column === 'full' && 'col-span-full'
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
        onClick={() => removeSection(section.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}