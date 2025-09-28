import React from "react";
import Input from "../common/Input";

const FieldInput = ({ field, value, onChange, placeholder }) => {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 capitalize">
        {field} {field === "name" && "*"}
      </label>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default FieldInput;