import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SaveTemplateDialogProps {
    onSave: (name: string) => void;
    onClose: () => void;
}

export default function SaveTemplateDialog({ onSave, onClose }: SaveTemplateDialogProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Template name is required');
            return;
        }

        onSave(name.trim());
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-medium">Save Template</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Template Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            className={cn(
                                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary",
                                error ? "border-red-300" : "border-gray-300"
                            )}
                            placeholder="Enter template name"
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Save Template
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
