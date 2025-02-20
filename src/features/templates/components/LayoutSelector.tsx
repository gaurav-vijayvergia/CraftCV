import { Layout } from '../types';
import { DEFAULT_LAYOUTS } from '../constants';
import { cn } from '../../../lib/utils';

interface LayoutSelectorProps {
  onSelect: (layout: Layout) => void;
}

export default function LayoutSelector({ onSelect }: LayoutSelectorProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900">Choose Layout</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a layout for your CV template
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.entries(DEFAULT_LAYOUTS) as [Layout, typeof DEFAULT_LAYOUTS[Layout]][]).map(([id, layout]) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="text-left p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <h3 className="text-lg font-medium text-gray-900">{layout.name}</h3>
            <p className="mt-2 text-sm text-gray-500">{layout.description}</p>
            <div className={cn(
              'mt-4 aspect-[210/297] bg-gray-50 rounded border',
              id === '2-column' ? 'grid grid-cols-2 gap-2' : 'flex flex-col'
            )}>
              {/* Layout preview */}
              {layout.defaultSections.map((section, i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-gray-100 h-4 rounded m-2",
                    section.column === 'full' && "col-span-full"
                  )}
                  style={{ width: `${Math.random() * 40 + 40}%` }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}