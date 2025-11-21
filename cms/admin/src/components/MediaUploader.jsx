import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MediaUploader({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post('/api/cms/admin/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      if (response.data.success) {
        const newFiles = response.data.data;
        setUploadedFiles(prev => [...prev, ...newFiles]);
        toast.success(`${newFiles.length} file(s) uploaded successfully!`);
        
        if (onUploadComplete) {
          onUploadComplete(newFiles);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
              <p className="text-slate-300">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-slate-400" />
              <div>
                <p className="text-slate-200 font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  or click to browse (max 10MB)
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Supported: Images (PNG, JPG, GIF, WebP, SVG), PDF
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden bg-slate-800 border border-slate-700"
            >
              {file.mime_type?.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.original_name}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-slate-900">
                  <ImageIcon className="h-12 w-12 text-slate-600" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  title="Remove"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              
              <div className="p-2 bg-slate-900/80 backdrop-blur-sm">
                <p className="text-xs text-slate-300 truncate" title={file.original_name}>
                  {file.original_name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.file_size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
