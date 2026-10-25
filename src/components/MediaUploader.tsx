import { useState, type DragEvent } from 'react';
import { toast } from 'react-toastify';
import { uploadFile } from '../api/posts';
import { getErrorMessage } from '../utils/format';
import { CrossIcon, UploadIcon } from './icons';
import Loader from './Loader';
import MediaView from './MediaView';

const MAX_BYTES = 10 * 1024 * 1024;

interface MediaUploaderProps {
  media: string[];
  onChange: (media: string[]) => void;
}

/** Upload box (click or drag & drop) plus a removable preview of uploaded media. */
export default function MediaUploader({ media, onChange }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!/^(image|video)\//.test(file.type)) {
      toast.error('Only image or video files are allowed.');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('File must be 10MB or smaller.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange([...media, url]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <span className="form-label">Upload Image or Video</span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex justify-center rounded-lg border-2 border-dashed px-4 pb-6 pt-5 transition-colors ${
          dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'
        }`}
      >
        <div className="text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-300" />
          <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-gray-600">
            <label htmlFor="file-upload" className="cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-700">
              Upload a file
              <input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                onChange={(e) => {
                  void handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>
            <p>or drag and drop</p>
          </div>
          <p className="text-xs text-gray-400">Images or videos up to 10MB</p>
        </div>
      </div>

      {media.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600">File Preview</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {media.map((file) => (
              <div key={file} className="relative">
                <MediaView src={file} alt="Uploaded file preview" className="h-36 w-36 rounded-2xl sm:h-60 sm:w-60" />
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => onChange(media.filter((m) => m !== file))}
                  className="icon-btn absolute right-2 top-2 bg-white/90 text-red-600 shadow hover:bg-white"
                >
                  <CrossIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Loader show={uploading} />
    </div>
  );
}
