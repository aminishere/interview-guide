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
    
    <Button 
      onClick={onSubmit} 
      disabled={disabled}
    >
      Submit
    </Button>
  </div>
);

export default ResumeForm;