import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth";

// Serve PDF worker from public folder to avoid CORS issues
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// Extract text from PDF
export const extractPdfText = async (file) => {
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
export const extractDocxText = async (file) => {
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
};

// Parse Name, Email, Phone from text
export const parseFields = (text) => {
  text = text.replace(/\s+/g, " ").replace(/⋄/g, " ");
  
  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "";

  // Phone
  const phoneMatch = text.match(/(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?){1,3}\d{3,4}/);
  let phone = phoneMatch ? phoneMatch[0] : "";
  phone = phone.replace(/^\+\d{1,4}\s?/, "");

  // Name parsing
  const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
  let name = "";

  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const words = lines[i].split(/\s+/);
    
    const isCapitalizedWord = (w) => /^[A-Z][a-zA-Z.\-']*$/.test(w);
    const isAllCapsWord = (w) => /^[A-Z]{2,}$/.test(w);
    
    const isName = words.length >= 2 && words.length <= 4 && (
      words.every(isCapitalizedWord) ||
      words.every(isAllCapsWord) ||
      words.every((w) => isAllCapsWord(w) || isCapitalizedWord(w))
    );
    
    const skipPatterns = [
      /^(resume|cv|curriculum|vitae)$/i,
      /^(phone|email|address|contact)$/i,
      /^(objective|summary|profile)$/i,
      /^(experience|education|skills|projects|achievements|leadership)$/i,
      /^\d+/, /@/,
    ];
    
    if (isName && !skipPatterns.some((p) => p.test(lines[i]))) {
      name = lines[i];
      break;
    }
  }

  return { name, email, phone };
};