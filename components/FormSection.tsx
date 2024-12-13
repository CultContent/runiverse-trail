import React, {useState} from "react";

interface FormSectionProps {
  title: string;
  values: string[];
  setValues: (values: string[]) => void;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, values, setValues }) => {
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newValue.trim()) {
      setValues([...values, newValue.trim()]);
      setNewValue('');
    }
  };

  const handleDelete = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1 p-2 rounded text-black"
          placeholder={`Add new ${title.toLowerCase()} item...`}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-yellow text-black rounded hover:bg-yellow-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {values.map((value, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded">
            <span>{value}</span>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormSection;
