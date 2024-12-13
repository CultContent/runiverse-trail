import React, {useState} from "react";

interface MessageExample {
  userQuestion: string;
  agentResponse: string;
}

interface MessageExampleSectionProps {
  title: string;
  values: MessageExample[];
  setValues: (values: MessageExample[]) => void;
}

export const MessageExampleSection: React.FC<MessageExampleSectionProps> = ({
  title,
  values,
  setValues,
}) => {
  const [newExample, setNewExample] = useState<MessageExample>({
    userQuestion: '',
    agentResponse: '',
  });

  const handleAdd = () => {
    if (newExample.userQuestion.trim() && newExample.agentResponse.trim()) {
      setValues([...values, { ...newExample }]);
      setNewExample({ userQuestion: '', agentResponse: '' });
    }
  };

  const handleDelete = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          value={newExample.userQuestion}
          onChange={(e) =>
            setNewExample({ ...newExample, userQuestion: e.target.value })
          }
          className="w-full p-2 rounded text-black"
          placeholder="User question..."
        />
        <textarea
          value={newExample.agentResponse}
          onChange={(e) =>
            setNewExample({ ...newExample, agentResponse: e.target.value })
          }
          className="w-full p-2 rounded text-black"
          placeholder="Agent response..."
          rows={3}
        />
        <button
          onClick={handleAdd}
          className="w-full px-4 py-2 bg-yellow text-black rounded hover:bg-yellow-600"
        >
          Add Example
        </button>
      </div>
      <div className="space-y-4">
        {values.map((example, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded space-y-2">
            <div className="flex justify-between">
              <strong>User:</strong>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
            <p>{example.userQuestion}</p>
            <strong>Agent:</strong>
            <p>{example.agentResponse}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageExampleSection;
