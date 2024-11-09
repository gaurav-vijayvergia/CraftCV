import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Sun, Moon } from 'lucide-react';
import { useOrganizationStore } from '../../store/organization';
import { cn } from '../../lib/utils';

const fonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Poppins',
  'Montserrat',
];

function OrganizationSettings() {
  const { settings, updateSettings } = useOrganizationStore();

  const onLogoDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateSettings({ logo: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    },
    [updateSettings]
  );

  const onTemplateDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateSettings({ cvTemplate: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    },
    [updateSettings]
  );

  const { getRootProps: getLogoProps, getInputProps: getLogoInput } = useDropzone({
    onDrop: onLogoDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
    },
    maxFiles: 1,
  });

  const {
    getRootProps: getTemplateProps,
    getInputProps: getTemplateInput,
  } = useDropzone({
    onDrop: onTemplateDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
    },
    maxFiles: 1,
  });

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Organisation Settings
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div
            {...getLogoProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              'hover:border-primary hover:bg-primary/5'
            )}
          >
            <input {...getLogoInput()} />
            {settings.logo ? (
              <img
                src={settings.logo}
                alt="Company Logo"
                className="max-h-32 mx-auto"
              />
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag 'n' drop logo here, or click to select
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="primaryColor"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Primary Color
            </label>
            <input
              type="color"
              id="primaryColor"
              value={settings.primaryColor}
              onChange={(e) => updateSettings({ primaryColor: e.target.value })}
              className="h-10 w-full rounded-md border border-gray-300 p-1"
            />
          </div>

          <div>
            <label
              htmlFor="secondaryColor"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Secondary Color
            </label>
            <input
              type="color"
              id="secondaryColor"
              value={settings.secondaryColor}
              onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
              className="h-10 w-full rounded-md border border-gray-300 p-1"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="font"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Font
          </label>
          <select
            id="font"
            value={settings.font}
            onChange={(e) => updateSettings({ font: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => updateSettings({ theme: 'light' })}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-md',
                settings.theme === 'light'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </button>
            <button
              onClick={() => updateSettings({ theme: 'dark' })}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-md',
                settings.theme === 'dark'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV Template
          </label>
          <div
            {...getTemplateProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              'hover:border-primary hover:bg-primary/5'
            )}
          >
            <input {...getTemplateInput()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag 'n' drop CV template here, or click to select
            </p>
            {settings.cvTemplate && (
              <p className="mt-2 text-sm text-green-600">Template uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationSettings;