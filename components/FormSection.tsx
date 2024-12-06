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
    <div className="mb-6 font-ocra">
      <h3 className="text-md uppercase text-white font-semibold mb-2 font-ocra">{title}</h3>
      {values.map((value, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            value={value}
            onChange={(e) => updateValue(index, e.target.value)}
            placeholder={`Enter ${title.slice(0, -1)} ${index + 1}`}
            className="flex-1 p-2 mb-2 border border-gray-600 rounded bg-gray-800 text-white mr-2 text-sm placeholder:uppercase"
          />
          <button
            type="button"
            onClick={() => removeValue(index)}
            className="px-4 py-2 bg-red-600 mb-2 text-white text-sm rounded hover:bg-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addValue}
        className="px-6 py-2 border-yellow border text-sm text-white rounded-xl hover:bg-yellow hover:text-black uppercase"
      >
        Add {title.slice(0, -1)}
      </button>
    </div>
  );
};

export default FormSection;
