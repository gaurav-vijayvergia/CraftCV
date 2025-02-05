import { useEffect, useState } from 'react';
import { FileText, Download, Eye, X, Loader2, Trash2, AlertCircle, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useCVStore } from '../../store/cv';
import { cn } from '../../lib/utils';
import CVProfile from './CVProfile';
import ErrorBoundary from '../ErrorBoundary';
import {generateCV} from "../../services/api.ts";

interface CV {
  id: string;
  originalFilename: string;
  fileUrl: string;
  status: 'PROCESSING' | 'CRAFTED';
  createdAt: string;
}

export default function CVListing() {
  const { cvs, isLoading, error, fetchCVs, updateStatus, deleteCV, fetchParsedData } = useCVStore();
  const [previewCV, setPreviewCV] = useState<CV | null>(null);
  const [deleteConfirmCV, setDeleteConfirmCV] = useState<CV | null>(null);
  const [profileCV, setProfileCV] = useState<CV | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    fetchCVs();
  }, [fetchCVs]);

  const handlePreview = (cv: CV) => {
    setPreviewCV(cv);
  };

  const handleViewProfile = async (cv: CV) => {
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const data = await fetchParsedData(cv.id);
      setParsedData(data);
      setProfileCV(cv);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to fetch profile data');
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleDownload = async (cv: CV) => {
    try {
      const blob = await generateCV(cv.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cv.originalFilename.split('.')[0]}_generated.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate CV:', error);
    }
  };

  const handleStatusUpdate = async (cvId: string, status: CV['status']) => {
    try {
      await updateStatus(cvId, status);
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleDelete = async (cv: CV) => {
    setDeleteConfirmCV(cv);
  };

  const confirmDelete = async () => {
    if (deleteConfirmCV) {
      try {
        await deleteCV(deleteConfirmCV.id);
        setDeleteConfirmCV(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
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
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Crafted CVs</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of uploaded CVs with Craft Status
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : cvs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No CVs</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by uploading some CVs.
                </p>
              </div>
            ) : (
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
                                {cv.originalFilename}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(cv.createdAt), 'PPP')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                cv.id,
                                cv.status === 'PROCESSING' ? 'CRAFTED' : 'PROCESSING'
                              )
                            }
                            className={cn(
                              'inline-flex rounded-full px-2 text-xs font-semibold leading-5 cursor-pointer transition-colors',
                              cv.status === 'CRAFTED'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            )}
                          >
                            {cv.status}
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleViewProfile(cv)}
                            className="text-primary hover:text-primary/90 mr-4 transition-colors"
                            title="View Profile"
                            disabled={loadingProfile}
                          >
                            <UserCircle className="h-5 w-5" />
                            <span className="sr-only">View Profile</span>
                          </button>
                          <button
                            onClick={() => handlePreview(cv)}
                            className="text-primary hover:text-primary/90 mr-4 transition-colors"
                            title="Preview"
                          >
                            <Eye className="h-5 w-5" />
                            <span className="sr-only">Preview</span>
                          </button>
                          <button
                            onClick={() => handleDownload(cv)}
                            className="text-primary hover:text-primary/90 mr-4 transition-colors"
                            title="Download"
                          >
                            <Download className="h-5 w-5" />
                            <span className="sr-only">Download</span>
                          </button>
                          <button
                            onClick={() => handleDelete(cv)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">{previewCV.originalFilename}</h3>
              <button
                onClick={() => setPreviewCV(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={previewCV.fileUrl}
                className="w-full h-full rounded border"
                title={`Preview of ${previewCV.originalFilename}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileCV && parsedData && (
        <ErrorBoundary>
          <CVProfile
            parsedData={parsedData}
            onClose={() => {
              setProfileCV(null);
              setParsedData(null);
              setProfileError(null);
            }}
          />
        </ErrorBoundary>
      )}

      {/* Profile Error Modal */}
      {profileError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">Error Loading Profile</h3>
            <p className="text-sm text-gray-600 text-center mb-4">{profileError}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setProfileError(null)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmCV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium text-gray-900">Delete CV</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{deleteConfirmCV.originalFilename}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setDeleteConfirmCV(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
