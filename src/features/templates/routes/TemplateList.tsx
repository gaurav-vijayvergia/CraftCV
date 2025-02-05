import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import TemplateCard from '../components/TemplateCard';
import { useTemplateStore } from '../../../store/template';

export default function TemplateList() {
    const navigate = useNavigate();
    const { templates, isLoading, error, fetchTemplates } = useTemplateStore();

    useEffect(() => {
        fetchTemplates().catch((error) => {
            console.error('Failed to fetch templates:', error);
        });
    }, [fetchTemplates]);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">CV Templates</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your organization's CV templates
                    </p>
                </div>
                <button
                    onClick={() => navigate('/templates/new')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>Create Template</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                ))}

                {templates.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-500">
                            No templates yet. Create your first template to get started.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
