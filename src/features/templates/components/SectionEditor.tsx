import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTemplateStore } from '../../../store/template';
import SortableSection from './SortableSection';
import { AVAILABLE_SECTIONS } from '../constants';
import { Section, SectionType } from '../types';
import { cn } from '../../../lib/utils';

interface SectionEditorProps {
  onSave: (name: string) => void;
}

export default function SectionEditor({ onSave }: SectionEditorProps) {
  const { sections, addSection, updateSections, selectedLayout, canAddSection } = useTemplateStore();
  const [templateName, setTemplateName] = useState('');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      
      const newSections = [...sections];
      const [removed] = newSections.splice(oldIndex, 1);
      newSections.splice(newIndex, 0, removed);
      
      updateSections(newSections);
    }
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    onSave(templateName);
  };

  const leftColumnSections = sections.filter(s => s.column === 'left');
  const rightColumnSections = sections.filter(s => s.column === 'right');
  const fullWidthSections = sections.filter(s => s.column === 'full');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900">Design Template</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add and arrange sections for your CV template
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Available Sections Panel */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Available Sections</h3>
            <div className="space-y-2">
              {AVAILABLE_SECTIONS.map((section) => {
                const isAvailable = canAddSection(section.type as SectionType);
                const column = selectedLayout === '2-column' ? section.allowedColumns[0] : 'full';
                
                return (
                  <button
                    key={section.type}
                    onClick={() => isAvailable && addSection(section.type as SectionType, column)}
                    disabled={!isAvailable}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded transition-colors",
                      isAvailable 
                        ? "hover:bg-gray-50 text-gray-700" 
                        : "opacity-50 cursor-not-allowed text-gray-400"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4 text-primary" />
                      <span className="text-sm">{section.title}</span>
                    </div>
                    {!isAvailable && (
                      <span className="text-xs text-gray-400">Max limit reached</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Template Editor */}
        <div className="col-span-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4">
              <label htmlFor="templateName" className="block text-sm font-medium text-gray-700">
                Template Name
              </label>
              <input
                type="text"
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Enter template name"
              />
            </div>

            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
              <div className={cn(
                'min-h-[600px] border rounded-lg p-4',
                selectedLayout === '2-column' ? 'grid grid-cols-10 gap-4' : 'space-y-2'
              )}>
                {selectedLayout === '2-column' ? (
                  <>
                    {/* Full Width Sections (Header) */}
                    {fullWidthSections.length > 0 && (
                      <div className="col-span-10 space-y-2">
                        <SortableContext items={fullWidthSections} strategy={verticalListSortingStrategy}>
                          {fullWidthSections.map((section) => (
                            <SortableSection key={section.id} section={section} />
                          ))}
                        </SortableContext>
                      </div>
                    )}

                    {/* Left Column (30%) */}
                    <div className="col-span-3 space-y-2">
                      <SortableContext items={leftColumnSections} strategy={verticalListSortingStrategy}>
                        {leftColumnSections.map((section) => (
                          <SortableSection key={section.id} section={section} />
                        ))}
                      </SortableContext>
                    </div>

                    {/* Right Column (70%) */}
                    <div className="col-span-7 space-y-2">
                      <SortableContext items={rightColumnSections} strategy={verticalListSortingStrategy}>
                        {rightColumnSections.map((section) => (
                          <SortableSection key={section.id} section={section} />
                        ))}
                      </SortableContext>
                    </div>
                  </>
                ) : (
                  <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {sections.map((section) => (
                        <SortableSection key={section.id} section={section} />
                      ))}
                    </div>
                  </SortableContext>
                )}

                {sections.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm text-gray-500">
                      Add sections from the left panel
                    </p>
                  </div>
                )}
              </div>
            </DndContext>

            {sections.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Save Template
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}