import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { Section } from '../../types';
import { cn } from '../../../../lib/utils';
import DroppableArea from './DroppableArea';
import DraggableSection from './DraggableSection';

interface TemplateEditorProps {
  onSave: (name: string) => void;
}

const availableSections: Section[] = [
  { id: 'header', type: 'header', title: 'Header', column: 'full' },
  { id: 'personal-info', type: 'personal-info', title: 'Personal Info', column: 'left' },
  { id: 'summary', type: 'summary', title: 'Professional Summary', column: 'right' },
  { id: 'experience', type: 'experience', title: 'Work Experience', column: 'right' },
  { id: 'education', type: 'education', title: 'Education', column: 'right' },
  { id: 'skills', type: 'skills', title: 'Skills', column: 'left' },
  { id: 'certifications', type: 'certifications', title: 'Certifications', column: 'left' },
  { id: 'footer', type: 'footer', title: 'Footer', column: 'full' },
];

export default function TemplateEditor({ onSave }: TemplateEditorProps) {
  const { sections, addSection, removeSection, updateSections, selectedLayout } = useTemplateStore();
  const [templateName, setTemplateName] = useState('');

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeSection = sections.find(s => s.id === active.id);
    if (!activeSection) return;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeSection = sections.find(s => s.id === active.id);
    if (!activeSection) return;

    const overId = String(over.id);
    let targetColumn = activeSection.column;

    // Determine target column based on droppable area
    if (overId === 'left-column') {
      targetColumn = 'left';
    } else if (overId === 'right-column') {
      targetColumn = 'right';
    }

    // Update section column if different
    if (activeSection.column !== targetColumn) {
      const updatedSections = sections.map(section => {
        if (section.id === active.id) {
          return { ...section, column: targetColumn };
        }
        return section;
      });
      updateSections(updatedSections);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeSection = sections.find(s => s.id === active.id);
    const overSection = sections.find(s => s.id === over.id);

    if (!activeSection || !overSection) return;

    // Get sections in the same column
    const columnSections = sections.filter(s => s.column === activeSection.column);
    
    // Find indices within the column
    const oldIndex = columnSections.findIndex(s => s.id === active.id);
    const newIndex = columnSections.findIndex(s => s.id === over.id);

    if (oldIndex !== newIndex) {
      // Create new array with all sections
      const newSections = [...sections];
      
      // Remove the dragged section
      const [removed] = newSections.splice(
        newSections.findIndex(s => s.id === active.id),
        1
      );

      // Find the new position in the full array
      const overIndex = newSections.findIndex(s => s.id === over.id);
      
      // Insert the section at the new position
      newSections.splice(overIndex, 0, removed);

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

  // Group sections by column for 2-column layout
  const leftSections = sections.filter(s => s.column === 'left');
  const rightSections = sections.filter(s => s.column === 'right');

  // For 1-column layout, filter out header and footer from main content
  const mainSections = sections.filter(s => s.type !== 'header' && s.type !== 'footer');
  const headerSection = sections.find(s => s.type === 'header');
  const footerSection = sections.find(s => s.type === 'footer');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900">Design Template</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add and arrange sections for your CV template
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Available Sections */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Available Sections</h3>
            <div className="space-y-2">
              {availableSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => addSection(section)}
                  className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4 text-primary" />
                  <span className="text-sm text-gray-700">{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
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

            <DndContext
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCenter}
            >
              <div className="min-h-[600px] border rounded-lg p-4">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  {headerSection && (
                    <div className="mb-4">
                      <DraggableSection
                        section={headerSection}
                        onRemove={removeSection}
                      />
                    </div>
                  )}

                  {/* Main Content Area */}
                  {selectedLayout === '2-column' ? (
                    <div className="flex-1 grid grid-cols-10 gap-4">
                      {/* Left Column */}
                      <div className="col-span-3">
                        <DroppableArea id="left-column">
                          <SortableContext items={leftSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                              {leftSections.map(section => (
                                <DraggableSection
                                  key={section.id}
                                  section={section}
                                  onRemove={removeSection}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DroppableArea>
                      </div>

                      {/* Right Column */}
                      <div className="col-span-7">
                        <DroppableArea id="right-column">
                          <SortableContext items={rightSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                              {rightSections.map(section => (
                                <DraggableSection
                                  key={section.id}
                                  section={section}
                                  onRemove={removeSection}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DroppableArea>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <DroppableArea id="single-column">
                        <SortableContext items={mainSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2">
                            {mainSections.map(section => (
                              <DraggableSection
                                key={section.id}
                                section={section}
                                onRemove={removeSection}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DroppableArea>
                    </div>
                  )}

                  {/* Footer */}
                  {footerSection && (
                    <div className="mt-4">
                      <DraggableSection
                        section={footerSection}
                        onRemove={removeSection}
                      />
                    </div>
                  )}
                </div>

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