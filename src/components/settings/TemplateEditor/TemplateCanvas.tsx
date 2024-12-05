import { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { TemplateSection, useTemplateStore, layouts } from '../../../store/template';
import { cn } from '../../../lib/utils';

interface SectionProps {
    section: TemplateSection;
    layoutStyles: (typeof layouts)[0]['styles'];
}

function Section({ section, layoutStyles }: SectionProps) {
    const { removeSection } = useTemplateStore();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = useMemo(
        () => ({
            transform: CSS.Transform.toString(transform),
            transition,
        }),
        [transform, transition]
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group relative p-4 border rounded-lg mb-4',
                isDragging ? 'opacity-50' : 'hover:border-primary',
                section.type === 'header' && layoutStyles.header,
                `border-${layoutStyles.accent}`
            )}
            {...attributes}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <button
                        className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                        {...listeners}
                    >
                        <GripVertical className="h-5 w-5 text-gray-400" />
                    </button>
                    <span className="ml-2 text-sm font-medium text-gray-700">
            {section.title}
          </span>
                </div>
                <button
                    onClick={() => removeSection(section.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className={cn('pl-7', layoutStyles.content)}>
                {section.type === 'header' && (
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-100 rounded w-1/3" />
                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                )}
                {section.type === 'personal-info' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-4 bg-gray-100 rounded" />
                        <div className="h-4 bg-gray-100 rounded" />
                        <div className="h-4 bg-gray-100 rounded" />
                        <div className="h-4 bg-gray-100 rounded" />
                    </div>
                )}
                {/* Add more section type previews as needed */}
            </div>
        </div>
    );
}

interface TemplateCanvasProps {
    sections: TemplateSection[];
}

export default function TemplateCanvas({ sections }: TemplateCanvasProps) {
    const { selectedLayout } = useTemplateStore();
    const layout = layouts.find((l) => l.id === selectedLayout);

    if (!layout) {
        return null;
    }

    return (
        <div className={layout.styles.container}>
            {sections.map((section) => (
                <Section key={section.id} section={section} layoutStyles={layout.styles} />
            ))}
            {sections.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Drag and drop sections here to build your template</p>
                </div>
            )}
        </div>
    );
}
