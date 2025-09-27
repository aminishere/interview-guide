import React, { useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth";
import Button from "../common/Button";
import Input from "../common/Input";

// Serve PDF worker from public folder to avoid CORS issues
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const ResumeUploader = ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [fields, setFields] = useState({ name: "", email: "", phone: "" });
  const [missingFields, setMissingFields] = useState([]);

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF or DOCX allowed");
      return;
    }

    setFile(file);

    let extractedText = "";
    if (file.type === "application/pdf") {
      extractedText = await extractPdfText(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      extractedText = await extractDocxText(file);
    }

    setText(extractedText);

    const parsed = parseFields(extractedText);
    setFields(parsed);

    const missing = Object.keys(parsed).filter((k) => !parsed[k] || parsed[k].trim() === "");
    setMissingFields(missing);
  };

  // Extract text from PDF
  const extractPdfText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
  
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n";
      }
      return text;
    } catch (error) {
      console.error("PDF parsing error:", error);
      alert("Error parsing PDF. Please try a different file or format.");
      return "";
    }
  };
  

  // Extract text from DOCX
  const extractDocxText = async (file) => {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  };

  // Parse Name, Email, Phone
  const parseFields = (text) => {
    text = text.replace(/\s+/g, " ").replace(/⋄/g, " "); 
    // Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : "";

    // Phone
    const phoneMatch = text.match(
      /(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?){1,3}\d{3,4}/
    );
    let phone = phoneMatch ? phoneMatch[0] : "";
     phone = phone.replace(/^\+\d{1,4}\s?/, "");



    

     const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);

   
     let name = "";
   
     for (let i = 0; i < Math.min(8, lines.length); i++) {
     const words = lines[i].split(/\s+/);
   
     // Word patterns
     const isCapitalizedWord = (w) => /^[A-Z][a-zA-Z.\-']*$/.test(w);
     const isAllCapsWord = (w) => /^[A-Z]{2,}$/.test(w); // ≥2 all-caps letters
   
     const isName =
       words.length >= 2 &&
       words.length <= 4 &&
       (
         words.every(isCapitalizedWord) ||
         words.every(isAllCapsWord) ||
         words.every((w) => isAllCapsWord(w) || isCapitalizedWord(w))
       );
   
     // Skip obvious non-names
     const skipPatterns = [
       /^(resume|cv|curriculum|vitae)$/i,
       /^(phone|email|address|contact)$/i,
       /^(objective|summary|profile)$/i,
       /^(experience|education|skills|projects|achievements|leadership)$/i,
       /^\d+/, // starts with number
       /@/,    // contains email
     ];
   
     if (isName && !skipPatterns.some((p) => p.test(lines[i]))) {
       name = lines[i];
       break;
     }
   }
   
   
   
   

   

    return { name, email, phone };
  };

  const handleFieldChange = (field, value) => {
    const updatedFields = { ...fields, [field]: value };
    setFields(updatedFields);
    const missing = Object.keys(updatedFields).filter((k) => !updatedFields[k]);
    setMissingFields(missing);
  };

  const handleSubmit = () => {
    if (!fields.name || fields.name.trim() === "") {
      alert("Name is required");
      return;
    }
    onSubmit(fields);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Resume (PDF or DOCX)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
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

      {file && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Uploaded: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>

          <div>
            {["name", "email", "phone"].map((field) => (
              <div key={field} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field} {field === "name" && "*"}
                </label>
                <Input
                  value={fields[field]}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} disabled={!fields.name}>
            Confirm & Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
