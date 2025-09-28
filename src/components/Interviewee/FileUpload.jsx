import React from "react";

const FileUpload = ({ onFileChange, file }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Resume (PDF or DOCX)
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={onFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors font-medium"
        >
          Browse Files
        </label>
        <span className="text-sm text-gray-500">
          {file ? file.name : "No file selected"}
        </span>
      </div>
    </div>
  );
};

export default FileUpload;