import { useTemplateStore } from '../../../store/template';
import { cn } from '../../../lib/utils';

const availableSections = [
  { id: 'header', title: 'Header', type: 'header' },
  { id: 'personal-info', title: 'Personal Info', type: 'personal-info' },
  { id: 'summary', title: 'Professional Summary', type: 'summary' },
  { id: 'experience', title: 'Work Experience', type: 'experience' },
  { id: 'education', title: 'Education', type: 'education' },
  { id: 'skills', title: 'Skills', type: 'skills' },
  { id: 'certifications', title: 'Certifications', type: 'certifications' },
  { id: 'footer', title: 'Footer', type: 'footer' },
];

export default function TemplateSidebar() {
  const { addSection } = useTemplateStore();

  const handleDragStart = (e: React.DragEvent, section: typeof availableSections[0]) => {
    e.dataTransfer.setData('application/json', JSON.stringify(section));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
      <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Available Sections</h3>
        <div>
          {availableSections.map((section) => (
              <div
                  key={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section)}
                  className={cn(
                      'flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-grab mb-2 group',
                      'hover:border-primary hover:shadow-md transition-all'
                  )}
                  onClick={() => addSection(section.type, section.title)}
              >
                <span className="text-sm font-medium text-gray-700">{section.title}</span>
              </div>
          ))}
        </div>
      </div>
  );
}
