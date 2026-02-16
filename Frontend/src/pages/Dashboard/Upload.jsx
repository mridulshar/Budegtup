import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, X, CheckCircle, File } from 'lucide-react';
import './Upload.css';

export default function UploadDoc() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const newFiles = files.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2), // MB
      type: file.type,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload process
    newFiles.forEach(fileObj => {
      setTimeout(() => {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === fileObj.id ? { ...f, status: 'completed' } : f
          )
        );
      }, 2000);
    });
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image size={20} />;
    if (fileType === 'application/pdf') return <FileText size={20} />;
    if (fileType.includes('spreadsheet') || fileType.includes('csv')) return <FileText size={20} />;
    return <File size={20} />;
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-container">
      {/* Header */}
      <div className="upload-header">
        <h1>Upload Documents</h1>
        <p>Import receipts, CSVs, or PDF statements to automatically track expenses</p>
      </div>

      {/* Upload Area */}
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept=".jpg,.jpeg,.png,.pdf,.csv,.xlsx,.xls"
          className="file-input"
        />

        <div className="upload-content">
          <Upload size={48} />
          <h3>Drag & Drop files here</h3>
          <p>or click to browse</p>
          <small>Supports JPG, PNG, PDF, CSV, Excel (Max 10MB each)</small>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files-section">
          <div className="section-header">
            <h2>Uploaded Files</h2>
            <button className="clear-btn" onClick={() => setUploadedFiles([])}>
              Clear All
            </button>
          </div>
          <div className="files-table">
            {uploadedFiles.map(file => (
              <div key={file.id} className="file-row">
                <div className="file-info">
                  <div className="file-icon">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="file-details">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{file.size} MB</p>
                  </div>
                </div>
                <div className="file-actions">
                  {file.status === 'uploading' && (
                    <span className="status-badge uploading">Uploading...</span>
                  )}
                  {file.status === 'completed' && (
                    <span className="status-badge completed">
                      <CheckCircle size={16} />
                      Completed
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                    className="remove-btn"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Info */}
      <div className="info-section">
        <h3>How it works:</h3>
        <ul>
          <li>📄 PDF statements: Automatically extract transaction data</li>
          <li>📊 CSV files: Import your bank exports</li>
          <li>📷 Receipt images: OCR to read amounts and dates</li>
          <li>⚡ Automatic categorization based on transaction patterns</li>
        </ul>
      </div>
    </div>
  );
}