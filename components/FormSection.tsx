import React from "react";

interface FormSectionProps {
  title: string;
  values: string[];
  setValues: (values: string[]) => void;
}

const FormSection: React.FC<FormSectionProps> = ({ title, values, setValues }) => {
  const addValue = () => setValues([...values, ""]);
  const updateValue = (index: number, newValue: string) => {
    const updatedValues = [...values];
    updatedValues[index] = newValue;
    setValues(updatedValues);
  };
  const removeValue = (index: number) => {
    const updatedValues = values.filter((_, i) => i !== index);
    setValues(updatedValues);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg text-white font-semibold mb-2">{title}</h3>
      {values.map((value, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            value={value}
            onChange={(e) => updateValue(index, e.target.value)}
            placeholder={`Enter ${title.slice(0, -1)} ${index + 1}`}
            className="flex-1 p-2 border border-gray-600 rounded bg-gray-800 text-white mr-2"
          />
          <button
            type="button"
            onClick={() => removeValue(index)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addValue}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
      >
        Add {title.slice(0, -1)}
      </button>
    </div>
  );
};

export default FormSection;
