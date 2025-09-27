import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Input from "../common/Input";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeUploader = ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [fields, setFields] = useState({ name: "", email: "", phone: "" });
  const [missingFields, setMissingFields] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type & size (max 5MB)
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF or DOCX allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large (max 5MB)");
      return;
    }

    setFile(file);

    let extractedText = "";
    if (file.type === "application/pdf") {
      extractedText = await extractPdfText(file);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      extractedText = await extractDocxText(file);
    }

    setText(extractedText);
    const parsed = parseFields(extractedText);
    setFields(parsed);

    const missing = Object.keys(parsed).filter((k) => !parsed[k]);
    setMissingFields(missing);
  };

  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text;
  };

  const extractDocxText = async (file) => {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  };

  const parseFields = (text) => {
    // Simple regex heuristics
    const email = (text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/) || [])[0] || "";
    const phone = (text.match(/(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/) || [])[0] || "";
    const lines = text.split("\n").map(l => l.trim()).filter(l => l);
    const name = lines.length ? lines[0] : ""; // simple heuristic; can call AI if empty

    return { name, email, phone };
  };

  const handleFieldChange = (field, value) => {
    setFields({ ...fields, [field]: value });
    setMissingFields(Object.keys(fields).filter(k => !fields[k] && k !== field));
  };

  const handleSubmit = () => {
    if (missingFields.length > 0) {
      alert(`Please fill missing fields: ${missingFields.join(", ")}`);
      return;
    }
    onSubmit(fields);
  };

  return (
    <div>
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      {file && (
        <div>
          <h3>Extracted Fields:</h3>
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <label>{field}</label>
              <Input
                value={fields[field]}
                onChange={(e) => handleFieldChange(field, e.target.value)}
              />
            </div>
          ))}
          <Button onClick={handleSubmit}>Confirm & Start Interview</Button>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
