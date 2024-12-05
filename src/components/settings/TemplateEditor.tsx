import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { X, FileText, Plus, ArrowLeft } from 'lucide-react';
import TemplateSidebar from './TemplateEditor/TemplateSidebar';
import TemplateCanvas from './TemplateEditor/TemplateCanvas';
import LayoutSelector from './TemplateEditor/LayoutSelector';
import { useTemplateStore } from '../../store/template';
import { useOrganizationStore } from '../../store/organization';
import { cn } from '../../lib/utils';

type EditorStep = 'choice' | 'layout' | 'editor';

interface TemplateEditorProps {
  onClose: () => void;
}

export default function TemplateEditor({ onClose }: TemplateEditorProps) {
  const { settings } = useOrganizationStore();
  const {
    sections,
    updateSections,
    saveTemplate,
    isUsingUploadedTemplate,
    uploadedTemplateUrl,
    setUploadedTemplate,
    selectedLayout,
  } = useTemplateStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<EditorStep>('choice');

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);

      updateSections(arrayMove(sections, oldIndex, newIndex));
    }

    setActiveId(null);
    setIsDragging(false);
  };

  const handleSave = async () => {
    if (!selectedLayout && !isUsingUploadedTemplate) {
      alert('Please select a layout first');
      return;
    }

    try {
      setIsSaving(true);
      await saveTemplate();
      onClose();
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseUploadedTemplate = () => {
    if (settings.cvTemplate) {
      setUploadedTemplate(settings.cvTemplate);
      setCurrentStep('editor');
    }
  };

  const handleCreateNewTemplate = () => {
    setUploadedTemplate(null);
    setCurrentStep('layout');
  };

  const handleContinueToEditor = () => {
    if (!selectedLayout) {
      alert('Please select a layout first');
      return;
    }
    setCurrentStep('editor');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'choice':
        return (
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h2 className="text-lg font-medium mb-4">Choose Template Option</h2>
              <div className="grid grid-cols-2 gap-4">
                {settings.cvTemplate && (
                    <button
                        onClick={handleUseUploadedTemplate}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <FileText className="h-8 w-8 text-primary mb-2" />
                      <span className="text-sm font-medium">Use Uploaded Template</span>
                    </button>
                )}
                <button
                    onClick={handleCreateNewTemplate}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Plus className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm font-medium">Create New Template</span>
                </button>
              </div>
            </div>
        );

      case 'layout':
        return (
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                  <button
                      onClick={() => setCurrentStep('choice')}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-lg font-medium">Choose Layout</h2>
                </div>
                <button
                    onClick={handleContinueToEditor}
                    disabled={!selectedLayout}
                    className={cn(
                        "px-4 py-2 bg-primary text-white rounded-md transition-colors",
                        !selectedLayout && "opacity-50 cursor-not-allowed"
                    )}
                >
                  Continue to Editor
                </button>
              </div>
              <LayoutSelector />
            </div>
        );

      case 'editor':
        return (
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                  {!isUsingUploadedTemplate && (
                      <button
                          onClick={() => setCurrentStep('layout')}
                          className="text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                  )}
                  <h2 className="text-lg font-medium">
                    {isUsingUploadedTemplate ? 'Preview Uploaded Template' : 'CV Template Editor'}
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={cn(
                          "px-4 py-2 bg-primary text-white rounded-md transition-colors",
                          isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
                      )}
                  >
                    {isSaving ? "Saving..." : "Save Template"}
                  </button>
                  <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {isUsingUploadedTemplate ? (
                    <div className="flex-1 overflow-auto bg-gray-50 p-6">
                      <div className="max-w-[21cm] mx-auto bg-white shadow-lg min-h-[29.7cm] rounded-lg">
                        <iframe
                            src={uploadedTemplateUrl || ''}
                            className="w-full h-full min-h-[29.7cm] rounded-lg"
                            title="CV Template Preview"
                        />
                      </div>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        modifiers={[restrictToVerticalAxis]}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                      <TemplateSidebar />

                      <div className="flex-1 overflow-auto bg-gray-50 p-6">
                        <div className="max-w-[21cm] mx-auto bg-white shadow-lg min-h-[29.7cm] rounded-lg">
                          <SortableContext
                              items={sections.map((s) => s.id)}
                              strategy={verticalListSortingStrategy}
                          >
                            <TemplateCanvas sections={sections} />
                          </SortableContext>
                        </div>
                      </div>

                      <DragOverlay>
                        {activeId ? (
                            <div
                                className={cn(
                                    'bg-white rounded-lg shadow-lg p-4 border-2 border-primary w-64',
                                    isDragging && 'cursor-grabbing'
                                )}
                            >
                              {sections.find((section) => section.id === activeId)?.title}
                            </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                )}
              </div>
            </div>
        );
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {renderStep()}
      </div>
  );
}
