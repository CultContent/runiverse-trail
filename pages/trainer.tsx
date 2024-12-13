'use client';
import React, { useState, useEffect } from "react";
import FormSection from "../components/FormSection";
import MessageExampleSection from "../components/MessageExampleSection";
import { downloadJson } from "../utils/downloadJson";
import { characterApi } from "../utils/api";

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
  const [isLoading, setIsLoading] = useState(false);
  const [savedCharacters, setSavedCharacters] = useState<string[]>([]);

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

  // Load saved characters on mount
  useEffect(() => {
    loadSavedCharacters();
  }, []);

  const loadSavedCharacters = async () => {
    try {
      const characters = await characterApi.getAllCharacters();
      setSavedCharacters(characters.map((char: any) => char.name));
    } catch (error) {
      console.error('Failed to load characters:', error);
    }
  };

  // Load a character
  const loadCharacter = async (characterName: string) => {
    setIsLoading(true);
    try {
      const character = await characterApi.getCharacter(characterName);
      
      // Populate state with character data
      setName(character.name || "");
      setClients(character.clients || []);
      setModelProvider(character.modelProvider || "openai");
      setBio(character.bio || []);
      setLore(character.lore || []);
      setKnowledge(character.knowledge || []);
      setTopics(character.topics || []);
      setAdjectives(character.adjectives || []);
      setMessageExamples(
        (character.messageExamples || []).map((example: any[]) => ({
          userQuestion: example[0]?.content?.text || "",
          agentResponse: example[1]?.content?.text || "",
        }))
      );
      setPostExamples(character.postExamples || []);
      setStyleAll(character.style?.all || []);
      setStyleChat(character.style?.chat || []);
      setStylePost(character.style?.post || []);

      setActiveTab("General"); // Reset to General tab after loading
    } catch (error) {
      console.error('Failed to load character:', error);
      alert('Failed to load character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save a character
  const saveCharacter = async () => {
    if (!name) {
      alert('Please provide a name for the character');
      return;
    }

    setIsLoading(true);
    try {
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

      await characterApi.saveCharacter(jsonData);
      await loadSavedCharacters(); // Refresh the list
      alert('Character saved successfully!');
    } catch (error) {
      console.error('Failed to save character:', error);
      alert('Failed to save character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a character
  const deleteCharacter = async (characterName: string) => {
    if (!confirm(`Are you sure you want to delete ${characterName}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await characterApi.deleteCharacter(characterName);
      await loadSavedCharacters(); // Refresh the list
      alert('Character deleted successfully!');
    } catch (error) {
      console.error('Failed to delete character:', error);
      alert('Failed to delete character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // JSON Import (keeping existing functionality)
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

  // Keep existing generateJson and getJsonPreview functions
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
    <div className="max-w-6xl min-h-screen flex flex-col  justify-center mx-auto p-4 sm:p-6 text-white bg-black font-sans">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white font-ocra">Loading...</div>
        </div>
      )}

<div className="mb-6">
        <h3 className="text-md font-semibold text-white mb-2 font-ocra uppercase">
          Saved Characters
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {savedCharacters.map((charName) => (
            <div key={charName} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
              <button
                onClick={() => loadCharacter(charName)}
                className="text-yellow-500 hover:text-yellow-400 font-ocra"
              >
                {charName}
              </button>
              <button
                onClick={() => deleteCharacter(charName)}
                className="text-red-500 hover:text-red-400 font-ocra"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <h1 className="text-center text-5xl font-bold mb-6 text-white font-atirose uppercase">
        Train Your<br/> Character
      </h1>
      
      {/* Top-level Tabs */}
      <div className="flex flex-wrap justify-center sm:justify-around gap-1 mb-4 font-ocra uppercase">
        {["General", "Narratives", "Message Examples", "Post Examples", "Style", "Full JSON", "Import JSON"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 py-1 sm:px-4 sm:py-2 text-md uppercase border rounded-xl border-yellow active:bg-yellow focus:bg-yellow focus:text-black ${
              activeTab === tab
                ? "bg-card-bg text-yellow-500"
                : "text-white hover:text-yellow-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-card-bg p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-full">
        {activeTab === "General" && (
          <section>
            <h2 className="text-md font-semibold text-white mb-4 font-ocra uppercase">
              General
            </h2>
            <div className="mb-4">
              <label className="block text-white text-sm mb-2 font-ocra uppercase">
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded text-black mt-1"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm mb-2 font-ocra uppercase">Clients:</label>
              <select
                multiple
                value={clients}
                onChange={(e) =>
                  setClients(Array.from(e.target.selectedOptions, (option) => option.value))
                }
                className="w-full p-2 rounded bg-background border border-text-secondary text-black font-ocra uppercase"
              >
                <option className="py-1" value="telegram">Telegram</option>
                <option className="py-1" value="discord">Discord</option>
                <option className="py-1" value="twitter">Twitter</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm mb-2 font-ocra uppercase">Model Provider:</label>
              <select
                value={modelProvider}
                onChange={(e) => setModelProvider(e.target.value)}
                className="w-full p-2 rounded bg-background border border-text-secondary text-black font-ocra uppercase"
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
            <h2 className="text-md font-semibold text-white mb-4 font-ocra uppercase">Narratives</h2>

            {/* Narrative Subtabs */}
            <div className="flex flex-wrap justify-center sm:justify-around mb-4 border-b font-ocra border-text-secondary">
              {["Bio", "Lore", "Knowledge", "Topics", "Adjectives"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveNarrativeTab(subTab)}
                  className={`px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-sm uppercase rounded-t hover:text-yellow focus:text-yellow ${
                    activeNarrativeTab === subTab
                      ? "bg-card-bg text-white"
                      : "text-white hover:text-white"
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
           {/*  <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 font-ocra uppercase">
              Message Examples
            </h2> */}
            <MessageExampleSection
              title="Message Examples"
              values={messageExamples}
              setValues={setMessageExamples}
            />
          </section>
        )}

        {activeTab === "Post Examples" && (
          <section>
           {/*  <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Post Examples
            </h2> */}
            <FormSection title="Post Examples" values={postExamples} setValues={setPostExamples} />
          </section>
        )}

        {activeTab === "Style" && (
          <section>
            <h2 className="text-md uppercase font-semibold text-white mb-4 font-ocra">Style</h2>

            <div className="flex flex-wrap justify-center sm:justify-around mb-4 border-b uppercase border-text-secondary">
              {["All", "Chat", "Post"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveStyleTab(subTab)}
                  className={`px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-t font-ocra uppercase ${
                    activeStyleTab === subTab
                      ? "bg-card-bg text-white"
                      : "text-white hover:text-white"
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
            <h2 className="text-md font-semibold text-white mb-4 font-ocra uppercase">Full JSON</h2>
            <pre className="bg-background p-4 rounded text-black text-sm overflow-auto max-h-96 border border-text-secondary">
              {getJsonPreview()}
            </pre>
          </section>
        )}

        {activeTab === "Import JSON" && (
          <section>
            <h2 className="text-md font-semibold text-white mb-4 font-ocra uppercase">Import JSON</h2>
            <textarea
              className="w-full p-4 rounded bg-background border border-text-secondary text-black mb-4 placeholder:uppercase placeholder:font-ocra"
              rows={10}
              placeholder="Paste your JSON here..."
              onBlur={(e) => handleJsonImport(e.target.value)}
            ></textarea>
          </section>
        )}
</div>
        {/* Generate Button */}
         <div className="flex gap-2 mt-4">
          <button
            onClick={saveCharacter}
            className="text-black bg-yellow hover:bg-button-hover-bg py-2 px-4 rounded transition duration-300 font-ocra uppercase"
            disabled={isLoading}
          >
            Save Character
          </button>
          <button
            onClick={generateJson}
            className="text-black bg-yellow hover:bg-button-hover-bg py-2 px-4 rounded transition duration-300 font-ocra uppercase"
            disabled={isLoading}
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
