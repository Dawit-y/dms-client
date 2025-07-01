import React, { useEffect, useMemo } from 'react';
import { Dashboard } from '@uppy/react';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

const FileUploader = ({ onUploadSuccess }) => {
  const uppy = useMemo(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxFileSize: 10000000, // 10MB
        maxNumberOfFiles: 10,
        allowedFileTypes: [
          '.pdf',
          '.doc',
          '.docx',
          '.txt',
          '.jpg',
          '.jpeg',
          '.png',
        ],
      },
      autoProceed: false,
    });

    uppyInstance.use(XHRUpload, {
      endpoint: '/api/upload', // Replace with your actual endpoint
      formData: true,
      fieldName: 'file',
    });

    return uppyInstance;
  }, []);

  useEffect(() => {
    const handleUploadSuccess = (file, response) => {
      if (onUploadSuccess) {
        onUploadSuccess(file, response);
      }
    };

    uppy.on('upload-success', handleUploadSuccess);

    return () => {
      uppy.off('upload-success', handleUploadSuccess);
      uppy.cancelAll();
    };
  }, [uppy, onUploadSuccess]);

  return (
    <div className="file-uploader">
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        height={200}
        showProgressDetails
        hideUploadButton
        width={'100%'}
      />
    </div>
  );
};

export default FileUploader;
