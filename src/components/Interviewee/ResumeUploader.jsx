import React, { useState } from "react";
import FileUpload from "./FileUpload";
import ResumeForm from "./ResumeForm";
import { extractPdfText, extractDocxText, parseFields } from "../../utils/resumeParser";

const ResumeUploader = ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState({ name: "", email: "", phone: "" });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF or DOCX allowed");
      return;
    }

    setFile(file);

    const extractedText = file.type === "application/pdf" 
      ? await extractPdfText(file) 
      : await extractDocxText(file);

    setFields(parseFields(extractedText));
  };


  const handleFieldChange = (field, value) => {
    setFields(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!fields.name?.trim()) {
      alert("Name is required");
      return;
    }
    onSubmit(fields);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <FileUpload onFileChange={handleFileChange} file={file} />

      {file && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Uploaded: {file.name}</p>
          <ResumeForm
            fields={fields}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            disabled={!fields.name}
          />
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
