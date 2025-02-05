import { Plus, Check } from 'lucide-react';
import { useTemplateStore } from '../../store/templateStore';
import { availableSections } from '../../constants';
import { cn } from '../../../../lib/utils';

export default function EditorSidebar() {
  const { addSection, canAddSection, sections } = useTemplateStore();

  return (
    <div className="col-span-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Available Sections</h3>
        <div className="space-y-2">
          {availableSections.map((section) => {
            const isAdded = sections.some(s => s.type === section.type);
            const canAdd = canAddSection(section.type);
            
            return (
              <button
                key={section.id}
                onClick={() => addSection(section)}
                disabled={!canAdd}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded transition-colors",
                  isAdded 
                    ? "bg-gray-50 text-gray-400" 
                    : canAdd
                    ? "hover:bg-gray-50 text-gray-700"
                    : "opacity-50 cursor-not-allowed text-gray-400",
                )}
              >
                <div className="flex items-center space-x-2">
                  {isAdded ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-sm">{section.title}</span>
                </div>
                {isAdded && (
                  <span className="text-xs text-gray-400">Added</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}