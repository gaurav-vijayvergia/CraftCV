import { layouts, useTemplateStore } from '../../../store/template';
import { cn } from '../../../lib/utils';
import { Check } from 'lucide-react';

export default function LayoutSelector() {
    const { selectedLayout, setLayout } = useTemplateStore();

    return (
        <div className="grid grid-cols-2 gap-4 p-6">
            {layouts.map((layout) => (
                <button
                    key={layout.id}
                    onClick={() => setLayout(layout.id)}
                    className={cn(
                        'relative group rounded-lg overflow-hidden border-2 transition-all',
                        selectedLayout === layout.id
                            ? 'border-primary ring-2 ring-primary ring-opacity-50'
                            : 'border-gray-200 hover:border-primary/60'
                    )}
                >
                    <img
                        src={layout.preview}
                        alt={layout.name}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-50" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-white">{layout.name}</h3>
                            <p className="text-sm text-gray-200">{layout.description}</p>
                        </div>
                        {selectedLayout === layout.id && (
                            <div className="self-end">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <Check className="w-5 h-5" />
                </span>
                            </div>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
