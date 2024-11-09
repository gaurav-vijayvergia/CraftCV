import React, { useState } from 'react';
import { FileText, Download, Eye, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CV {
  id: string;
  name: string;
  uploadDate: string;
  status: 'Processing' | 'Branded';
  previewUrl?: string;
}

const mockCVs: CV[] = [
  {
    id: '1',
    name: 'John_Doe_Resume.pdf',
    uploadDate: '2024-03-15',
    status: 'Branded',
    previewUrl: 'https://example.com/preview/john-doe-resume.pdf',
  },
  {
    id: '2',
    name: 'Jane_Smith_CV.docx',
    uploadDate: '2024-03-14',
    status: 'Processing',
    previewUrl: 'https://example.com/preview/jane-smith-cv.pdf',
  },
];

export default function CVListing() {
  const [cvs] = useState<CV[]>(mockCVs);
  const [previewCV, setPreviewCV] = useState<CV | null>(null);

  const handlePreview = (cv: CV) => {
    setPreviewCV(cv);
  };

  const handleDownload = (id: string) => {
    console.log('Download CV:', id);
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">CV Listing</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all CVs uploaded to your account
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Upload Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cvs.map((cv) => (
                    <tr key={cv.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 flex-shrink-0 text-gray-400" />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {cv.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(cv.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                            cv.status === 'Branded'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          )}
                        >
                          {cv.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handlePreview(cv)}
                          className="text-primary hover:text-primary/90 mr-4"
                        >
                          <Eye className="h-5 w-5" />
                          <span className="sr-only">Preview</span>
                        </button>
                        <button
                          onClick={() => handleDownload(cv.id)}
                          className="text-primary hover:text-primary/90"
                        >
                          <Download className="h-5 w-5" />
                          <span className="sr-only">Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">{previewCV.name}</h3>
              <button
                onClick={() => setPreviewCV(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={previewCV.previewUrl}
                className="w-full h-full rounded border"
                title={`Preview of ${previewCV.name}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}