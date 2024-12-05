import { FileText, Check, Trash2 } from 'lucide-react';
import { Template, useTemplateStore } from '../../store/template';

interface TemplateCardProps {
    template: Template;
    onSelect: () => void;
    onSetDefault: () => void;
    onDelete: () => void;
}

function TemplateCard({ template, onSelect, onSetDefault, onDelete }: TemplateCardProps) {
    return (
        <div className="relative group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
                onClick={onSelect}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            >
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
            </button>

            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!template.isDefault && (
                    <button
                        onClick={onSetDefault}
                        className="p-1 text-gray-400 hover:text-primary transition-colors"
                        title="Set as default"
                    >
                        <Check className="h-4 w-4" />
                    </button>
                )}
                <button
                    onClick={onDelete}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete template"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

export default function TemplateList() {
    const { templates, setDefaultTemplate, removeTemplate, selectTemplate } = useTemplateStore();

    if (templates.length === 0) {
        return (
            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new template
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
                <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => selectTemplate(template)}
                    onSetDefault={() => setDefaultTemplate(template.id)}
                    onDelete={() => removeTemplate(template.id)}
                />
            ))}
        </div>
    );
}
