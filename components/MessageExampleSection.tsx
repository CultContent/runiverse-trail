import React from "react";

interface MessageExample {
  userQuestion: string;
  agentResponse: string;
}

interface MessageExampleSectionProps {
  title: string;
  values: MessageExample[];
  setValues: (values: MessageExample[]) => void;
}

const MessageExampleSection: React.FC<MessageExampleSectionProps> = ({ title, values, setValues }) => {
  const addMessage = () =>
    setValues([...values, { userQuestion: "", agentResponse: "" }]);
  const updateMessage = (index: number, field: keyof MessageExample, value: string) => {
    const updatedMessages = [...values];
    updatedMessages[index][field] = value;
    setValues(updatedMessages);
  };
  const removeMessage = (index: number) => {
    const updatedMessages = values.filter((_, i) => i !== index);
    setValues(updatedMessages);
  };

  return (
    <div className="mb-6">
      <h3 className="text-md uppercase text-white font-semibold mb-2 font-ocra">{title}</h3>
      {values.map((message, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-800 rounded">
          <div className="mb-2">
            <label className="block text-gray-400 mb-1 text-sm font-ocra uppercase">User Question:</label>
            <input
              type="text"
              value={message.userQuestion}
              onChange={(e) => updateMessage(index, "userQuestion", e.target.value)}
              placeholder={`Enter User Question ${index + 1}`}
              className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-sm text-white font-ocra "
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1 font-ocra text-sm uppercase">Agent Response:</label>
            <input
              type="text"
              value={message.agentResponse}
              onChange={(e) => updateMessage(index, "agentResponse", e.target.value)}
              placeholder={`Enter Agent Response ${index + 1}`}
              className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-900 text-white font-ocra "
            />
          </div>
          <button
            type="button"
            onClick={() => removeMessage(index)}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 font-ocra text-sm uppercase"
          >
            Remove Example
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addMessage}
        className="px-6 py-2 border-yellow border text-sm text-white rounded-xl hover:bg-yellow hover:text-black uppercase font-ocra"
      >
        Add Message Example
      </button>
    </div>
  );
};

export default MessageExampleSection;
