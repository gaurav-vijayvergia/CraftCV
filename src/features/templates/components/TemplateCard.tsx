import { Check, FileText, Trash2 } from 'lucide-react';
import { useTemplateStore } from '../store/templateStore';
import { Template } from '../types';
import { cn } from '../../../lib/utils';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const { setDefaultTemplate, removeTemplate } = useTemplateStore();

  return (
    <div className="relative group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Created {new Date(template.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {template.isDefault && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Default
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className={cn(
            'aspect-[210/297] bg-gray-50 rounded border',
            template.layout === '2-column' ? 'grid grid-cols-2 gap-2' : 'flex flex-col'
          )}>
            {/* Template preview */}
            {template.sections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-100 h-4 rounded m-2"
                style={{ width: `${Math.random() * 40 + 40}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!template.isDefault && (
          <button
            onClick={() => setDefaultTemplate(template.id)}
            className="p-1 text-gray-400 hover:text-primary transition-colors"
            title="Set as default"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => removeTemplate(template.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete template"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}