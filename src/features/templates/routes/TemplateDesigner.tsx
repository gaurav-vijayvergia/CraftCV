import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutSelector from '../components/LayoutSelector';
import TemplateEditor from '../components/TemplateEditor';
import { useTemplateStore } from '../../../store/template';
import { Layout } from '../types';

export default function TemplateDesigner() {
  const navigate = useNavigate();
  const { selectedLayout, initializeLayout, saveTemplate, resetTemplate } = useTemplateStore();

  // Reset template state when component unmounts
  useEffect(() => {
    return () => resetTemplate();
  }, [resetTemplate]);

  const handleLayoutSelect = (layout: Layout) => {
    initializeLayout(layout);
  };

  const handleSave = async (name: string) => {
    try {
      await saveTemplate(name);
      navigate('/templates');
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  return (
      <div className="p-6">
        {!selectedLayout ? (
            <LayoutSelector onSelect={handleLayoutSelect} />
        ) : (
            <TemplateEditor onSave={handleSave} />
        )}
      </div>
  );
}
