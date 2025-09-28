import React from "react";
import Button from "../common/Button";
import FieldInput from "./FieldInput";

const FIELDS = ["name", "email", "phone"];

const ResumeForm = ({ fields, onFieldChange, onSubmit, disabled }) => (
  <div>
    {FIELDS.map((field) => (
      <FieldInput
        key={field}
        field={field}
        value={fields[field]}
        onChange={(e) => onFieldChange(field, e.target.value)}
        placeholder={`Enter ${field}`}
      />
    ))}
    
    <button 
      onClick={onSubmit} 
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#9ca3af' : '#2563eb',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '80px'
      }}
    >
      Submit
    </button>
  </div>
);

export default ResumeForm;