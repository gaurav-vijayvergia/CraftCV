import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Check, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCVStore } from '../../store/cv';
import { cn } from '../../lib/utils';

type UploadStep = 1 | 2;

interface UploadedFile {
  file: File;
  preview: string;
}

function UploadCV() {
  const navigate = useNavigate();
  const { uploadFiles, isLoading, error } = useCVStore();
  const [step, setStep] = useState<UploadStep>(1);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/rtf': ['.rtf'],
    },
    multiple: true,
  });

  const handleConfirm = async () => {
    try {
      await uploadFiles(files.map((f) => f.file));
      // Clean up preview URLs
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      navigate('/cv-listing');
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(files[index].preview);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center">
            <div
                className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full',
                    step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'
                )}
            >
              1
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                  className={cn(
                      'h-full bg-primary transition-all',
                      step >= 2 ? 'w-full' : 'w-0'
                  )}
              />
            </div>
            <div
                className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full',
                    step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'
                )}
            >
              2
            </div>
          </div>
        </div>

        {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
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

        {step === 1 && (
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
                    isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                )}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag 'n' drop CV files here, or click to select file(s)
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, DOCX, and RTF
              </p>
            </div>
        )}

        {files.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Uploaded Files ({files.length})
                </h3>
                {step === 1 && (
                    <button
                        onClick={() => setStep(2)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Next Step
                    </button>
                )}
              </div>
              <div className="space-y-2">
                {files.map((file, index) => (
                    <div
                        key={index}
                        className="flex items-center p-4 bg-white rounded-lg shadow-sm"
                    >
                      <File className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="flex-1 truncate">{file.file.name}</span>
                      <span className="text-sm text-gray-500 mr-4">
                  {(file.file.size / 1024).toFixed(1)} KB
                </span>
                      <button
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          title="Remove file"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                ))}
              </div>
            </div>
        )}

        {step === 2 && (
            <div className="mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">Review & Confirm</h3>
                  <button
                      onClick={handleConfirm}
                      disabled={isLoading}
                      className={cn(
                          'px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center space-x-2 transition-colors',
                          isLoading && 'opacity-50 cursor-not-allowed'
                      )}
                  >
                    {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          <span>Processing...</span>
                        </>
                    ) : (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Craft CVs</span>
                        </>
                    )}
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Files:</span>
                    <span className="font-medium">{files.length}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Size:</span>
                    <span className="font-medium">
                  {(
                      files.reduce((acc, file) => acc + file.file.size, 0) / 1024
                  ).toFixed(1)}{' '}
                      KB
                </span>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default UploadCV;
