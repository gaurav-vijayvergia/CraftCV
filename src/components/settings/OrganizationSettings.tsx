import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Sun, Moon, Loader2, AlertCircle, X, Eye, Trash2 } from 'lucide-react';
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
  const {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    uploadLogo,
    removeLogo,
    uploadTemplate,
    removeTemplate,
  } = useOrganizationStore();

  const [previewTemplate, setPreviewTemplate] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const onLogoDrop = useCallback(
      async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
          try {
            await uploadLogo(file);
          } catch (error) {
            console.error('Logo upload failed:', error);
          }
        }
      },
      [uploadLogo]
  );

  const onTemplateDrop = useCallback(
      async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
          try {
            await uploadTemplate(file);
          } catch (error) {
            console.error('Template upload failed:', error);
          }
        }
      },
      [uploadTemplate]
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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Organisation Settings
          </h2>
        </div>

        {error && (
            <div className="px-6 pt-4">
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
        )}

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
                  <div className="space-y-2">
                    <div className="relative">
                      <img
                          src={settings.logo}
                          alt="Company Logo"
                          className="max-h-32 mx-auto"
                      />
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLogo();
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Drop a new logo to replace the current one
                    </p>
                  </div>
              ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag 'n' drop logo here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports PNG, JPG, JPEG, and SVG
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
                      'flex items-center space-x-2 px-4 py-2 rounded-md transition-colors',
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
                      'flex items-center space-x-2 px-4 py-2 rounded-md transition-colors',
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
              {settings.cvTemplate ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-4">
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewTemplate(true);
                          }}
                          className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTemplate();
                          }}
                          className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-green-600">Template uploaded</p>
                    <p className="text-xs text-gray-500">
                      Drop a new template to replace the current one
                    </p>
                  </div>
              ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag 'n' drop CV template here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports PDF and DOCX
                    </p>
                  </>
              )}
            </div>
          </div>
        </div>

        {/* Template Preview Modal */}
        {previewTemplate && settings.cvTemplate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-medium">CV Template Preview</h3>
                  <button
                      onClick={() => setPreviewTemplate(false)}
                      className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 p-4">
                  <iframe
                      src={settings.cvTemplate}
                      className="w-full h-full rounded border"
                      title="CV Template Preview"
                  />
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default OrganizationSettings;
