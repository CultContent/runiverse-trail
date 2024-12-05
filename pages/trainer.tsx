'use client';
import React, { useState } from "react";
import FormSection from "../components/FormSection";
import MessageExampleSection from "../components/MessageExampleSection";
import { downloadJson } from "../utils/downloadJson";

interface MessageExample {
  user: string;
  content: {
    text: string;
  };
}

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [activeNarrativeTab, setActiveNarrativeTab] = useState("Bio");
  const [activeStyleTab, setActiveStyleTab] = useState("All");

  // General Information
  const [name, setName] = useState("");
  const [clients, setClients] = useState<string[]>([]);
  const [modelProvider, setModelProvider] = useState("openai");

  // Narratives
  const [bio, setBio] = useState<string[]>([]);
  const [lore, setLore] = useState<string[]>([]);
  const [knowledge, setKnowledge] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [adjectives, setAdjectives] = useState<string[]>([]);

  // Message Examples
  const [messageExamples, setMessageExamples] = useState<
    { userQuestion: string; agentResponse: string }[]
  >([]);

  // Post Examples
  const [postExamples, setPostExamples] = useState<string[]>([]);

  // Style
  const [styleAll, setStyleAll] = useState<string[]>([]);
  const [styleChat, setStyleChat] = useState<string[]>([]);
  const [stylePost, setStylePost] = useState<string[]>([]);

  // JSON Import
  const handleJsonImport = (json: string) => {
    try {
      const parsed = JSON.parse(json);

      // Populate state with parsed JSON
      setName(parsed.name || "");
      setClients(parsed.clients || []);
      setModelProvider(parsed.modelProvider || "openai");
      setBio(parsed.bio || []);
      setLore(parsed.lore || []);
      setKnowledge(parsed.knowledge || []);
      setTopics(parsed.topics || []);
      setAdjectives(parsed.adjectives || []);
      setMessageExamples(
        (parsed.messageExamples || []).map((example: MessageExample[]) => ({
          userQuestion: example[0]?.content?.text || "",
          agentResponse: example[1]?.content?.text || "",
        }))
      );
      setPostExamples(parsed.postExamples || []);
      setStyleAll(parsed.style?.all || []);
      setStyleChat(parsed.style?.chat || []);
      setStylePost(parsed.style?.post || []);
    } catch {
      alert("Invalid JSON format. Please check your input.");
    }
  };

  const generateJson = () => {
    const jsonData = {
      name,
      clients,
      modelProvider,
      settings: {
        secrets: {},
        voice: {
          model: "en_US-male-medium",
        },
      },
      bio,
      lore,
      knowledge,
      topics,
      adjectives,
      messageExamples: messageExamples.map(({ userQuestion, agentResponse }) => [
        { user: "{{user1}}", content: { text: userQuestion } },
        { user: "agent", content: { text: agentResponse } },
      ]),
      postExamples,
      style: {
        all: styleAll,
        chat: styleChat,
        post: stylePost,
      },
    };
    downloadJson(jsonData, `${name || "file"}.json`);
  };

  const getJsonPreview = () => {
    return JSON.stringify(
      {
        name,
        clients,
        modelProvider,
        settings: {
          secrets: {},
          voice: {
            model: "en_US-male-medium",
          },
        },
        bio,
        lore,
        knowledge,
        topics,
        adjectives,
        messageExamples: messageExamples.map(({ userQuestion, agentResponse }) => [
          { user: "{{user1}}", content: { text: userQuestion } },
          { user: "agent", content: { text: agentResponse } },
        ]),
        postExamples,
        style: {
          all: styleAll,
          chat: styleChat,
          post: stylePost,
        },
      },
      null,
      2
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white bg-black font-sans">
      {/* Header */}
      <h1 className="text-center text-2xl sm:text-3xl font-bold mb-6 text-white">
        Create JSON File
      </h1>

      {/* Top-level Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-around mb-4 border-b border-text-secondary">
        {["General", "Narratives", "Message Examples", "Post Examples", "Style", "Full JSON", "Import JSON"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base ${
              activeTab === tab
                ? "bg-card-bg text-yellow-500"
                : "text-text-secondary hover:text-yellow-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-card-bg p-4 sm:p-6 rounded-lg shadow-lg">
        {activeTab === "General" && (
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              General Information
            </h2>
            <div className="mb-4">
              <label className="block text-text-secondary mb-2">
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded bg-background border border-text-secondary text-white mt-1"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-text-secondary mb-2">Clients:</label>
              <select
                multiple
                value={clients}
                onChange={(e) =>
                  setClients(Array.from(e.target.selectedOptions, (option) => option.value))
                }
                className="w-full p-2 rounded bg-background border border-text-secondary text-white"
              >
                <option value="telegram">Telegram</option>
                <option value="discord">Discord</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-text-secondary mb-2">Model Provider:</label>
              <select
                value={modelProvider}
                onChange={(e) => setModelProvider(e.target.value)}
                className="w-full p-2 rounded bg-background border border-text-secondary text-white"
              >
                <option value="openai">OpenAI</option>
                <option value="llama">Llama</option>
                <option value="ollama">Ollama</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>
          </section>
        )}

        {activeTab === "Narratives" && (
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Narratives</h2>

            {/* Narrative Subtabs */}
            <div className="flex flex-wrap justify-center sm:justify-around mb-4 border-b border-text-secondary">
              {["Bio", "Lore", "Knowledge", "Topics", "Adjectives"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveNarrativeTab(subTab)}
                  className={`px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-t ${
                    activeNarrativeTab === subTab
                      ? "bg-card-bg text-white"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  {subTab}
                </button>
              ))}
            </div>

            {/* Narrative Forms */}
            {activeNarrativeTab === "Bio" && (
              <FormSection title="Bio" values={bio} setValues={setBio} />
            )}
            {activeNarrativeTab === "Lore" && (
              <FormSection title="Lore" values={lore} setValues={setLore} />
            )}
            {activeNarrativeTab === "Knowledge" && (
              <FormSection title="Knowledge" values={knowledge} setValues={setKnowledge} />
            )}
            {activeNarrativeTab === "Topics" && (
              <FormSection title="Topics" values={topics} setValues={setTopics} />
            )}
            {activeNarrativeTab === "Adjectives" && (
              <FormSection title="Adjectives" values={adjectives} setValues={setAdjectives} />
            )}
          </section>
        )}

        {activeTab === "Message Examples" && (
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Message Examples
            </h2>
            <MessageExampleSection
              title="Message Examples"
              values={messageExamples}
              setValues={setMessageExamples}
            />
          </section>
        )}

        {activeTab === "Post Examples" && (
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Post Examples
            </h2>
            <FormSection title="Post Examples" values={postExamples} setValues={setPostExamples} />
          </section>
        )}

        {activeTab === "Style" && (
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Style</h2>

            <div className="flex flex-wrap justify-center sm:justify-around mb-4 border-b border-text-secondary">
              {["All", "Chat", "Post"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveStyleTab(subTab)}
                  className={`px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-t ${
                    activeStyleTab === subTab
                      ? "bg-card-bg text-white"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  {subTab}
                </button>
              ))}
            </div>

            {activeStyleTab === "All" && (
              <FormSection title="Style (All)" values={styleAll} setValues={setStyleAll} />
            )}
            {activeStyleTab === "Chat" && (
              <FormSection title="Style (Chat)" values={styleChat} setValues={setStyleChat} />
            )}
            {activeStyleTab === "Post" && (
              <FormSection title="Style (Post)" values={stylePost} setValues={setStylePost} />
            )}
          </section>
        )}

        {activeTab === "Full JSON" && (
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Full JSON</h2>
            <pre className="bg-background p-4 rounded text-white text-sm overflow-auto max-h-96 border border-text-secondary">
              {getJsonPreview()}
            </pre>
          </section>
        )}

        {activeTab === "Import JSON" && (
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Import JSON</h2>
            <textarea
              className="w-full p-4 rounded bg-background border border-text-secondary text-white mb-4"
              rows={10}
              placeholder="Paste your JSON here..."
              onBlur={(e) => handleJsonImport(e.target.value)}
            ></textarea>
          </section>
        )}

        {/* Generate Button */}
        <button
          onClick={generateJson}
          className="w-full mt-4 bg-button-bg hover:bg-button-hover-bg text-white py-2 px-4 rounded transition duration-300"
        >
          Generate JSON
        </button>
      </div>
    </div>
  );
};

export default Home;
