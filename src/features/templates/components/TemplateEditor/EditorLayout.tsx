import { useTemplateStore } from '../../store/templateStore';
import DroppableArea from './DroppableArea';
import DraggableSection from './DraggableSection';
import { Section } from '../../types';
import { cn } from '../../../../lib/utils';

interface EditorLayoutProps {
  sections: Section[];
  selectedLayout: string | null;
}

export default function EditorLayout({ sections, selectedLayout }: EditorLayoutProps) {
  const { removeSection } = useTemplateStore();

  // Separate sections by type
  const headerSection = sections.find(s => s.type === 'header');
  const footerSection = sections.find(s => s.type === 'footer');
  const mainSections = sections.filter(s => s.type !== 'header' && s.type !== 'footer');

  // For 2-column layout
  const leftSections = mainSections.filter(s => s.column === 'left');
  const rightSections = mainSections.filter(s => s.column === 'right');

  return (
    <div className={cn(
      "border rounded-lg p-4 min-h-[600px]",
      "grid grid-rows-[auto,1fr,auto] gap-4"
    )}>
      {/* Header Area - Always full width */}
      <div className="w-full">
        <DroppableArea id="header" className="w-full">
          {headerSection && (
            <DraggableSection
              section={headerSection}
              onRemove={removeSection}
            />
          )}
        </DroppableArea>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {selectedLayout === '2-column' ? (
          <div className="grid grid-cols-10 gap-4 h-full">
            <DroppableArea id="left-column" className="col-span-3">
              <div className="space-y-2">
                {leftSections.map(section => (
                  <DraggableSection
                    key={section.id}
                    section={section}
                    onRemove={removeSection}
                  />
                ))}
              </div>
            </DroppableArea>

            <DroppableArea id="right-column" className="col-span-7">
              <div className="space-y-2">
                {rightSections.map(section => (
                  <DraggableSection
                    key={section.id}
                    section={section}
                    onRemove={removeSection}
                  />
                ))}
              </div>
            </DroppableArea>
          </div>
        ) : (
          <DroppableArea id="single-column">
            <div className="space-y-2">
              {mainSections.map(section => (
                <DraggableSection
                  key={section.id}
                  section={section}
                  onRemove={removeSection}
                />
              ))}
            </div>
          </DroppableArea>
        )}
      </div>

      {/* Footer Area - Always full width */}
      <div className="w-full">
        <DroppableArea id="footer" className="w-full">
          {footerSection && (
            <DraggableSection
              section={footerSection}
              onRemove={removeSection}
            />
          )}
        </DroppableArea>
      </div>

      {sections.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
            <p className="text-sm text-gray-500">
              Add sections from the left panel
            </p>
          </div>
        </div>
      )}
    </div>
  );
}