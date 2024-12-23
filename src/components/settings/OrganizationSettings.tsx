import { Upload, Sun, Moon, Loader2, AlertCircle, Trash2} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useOrganizationStore } from '../../store/organization';
import { cn } from '../../lib/utils';

export default function OrganizationSettings() {
  const {
    settings,
    isLoading,
    error,
    updateSettings,
    uploadLogo,
    removeLogo,
  } = useOrganizationStore();

  const onLogoDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        await uploadLogo(file);
      } catch (error) {
        console.error('Logo upload failed:', error);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onLogoDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
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
      <div className="max-w-4xl mx-auto space-y-8">
        {error && (
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
        )}

        {/* Logo Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Organization Logo</h2>
          <div
              {...getRootProps()}
              className={cn(
                  'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  'hover:border-primary hover:bg-primary/5'
              )}
          >
            <input {...getInputProps()} />
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

        {/* Theme Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Theme Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Mode
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
              <label
                  htmlFor="font"
                  className="block text-sm font-medium text-gray-700 mb-2"
              >
                Font Family
              </label>
              <select
                  id="font"
                  value={settings.font}
                  onChange={(e) => updateSettings({ font: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              >
                {['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat'].map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                ))}
              </select>
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
          </div>
        </div>

      </div>
  );
}
