import { useState, useRef } from "react";
import {
  FiSidebar,
  FiMessageSquare,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import { BiConversation } from "react-icons/bi";
import { Plus, Send } from "lucide-react";

async function streamGroqResponse(userMessage, onChunk) {
  const response = await fetch("http://localhost:4000/api/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userInput: userMessage,
      context: "general", // agar context chahiye ho to pass karo
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((line) => line.trim());
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.replace("data: ", "");
        if (data === "[DONE]") return;
        try {
          const json = JSON.parse(data);
          const token = json.token;
          if (token) onChunk(token);
        } catch {}
      }
    }
  }
}

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    setInput("");

    const onChunk = (token) => {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content += token;
        return updated;
      });
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    await streamGroqResponse(input, onChunk);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white text-gray-900">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={() => setShowContext(true)}
          className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200"
        >
          <BiConversation size={18} />
          <span>Context</span>
        </button>
        <div className="flex gap-5 text-gray-500">
          <button className="hover:text-black"><FiSidebar size={18} /></button>
          <button className="hover:text-black"><FiMessageSquare size={18} /></button>
          <button className="hover:text-black"><FiMaximize2 size={18} /></button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-2xl ${
              msg.role === "user"
                ? "bg-gray-200 text-gray-900 self-end ml-auto"
                : "bg-white text-black border border-gray-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Bar (ChatGPT Style) */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="relative flex items-end max-w-4xl mx-auto w-full">
          {/* Plus Icon (Left) */}
          <button
            className="absolute left-3 bottom-2 text-gray-500 hover:text-black"
            onClick={() => alert("Upload window khul jaeygi")}
          >
            <Plus size={20} />
          </button>

          {/* Textarea */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="1"
            placeholder="Message Chatbot..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ minHeight: "40px", maxHeight: "200px" }}
          />

          {/* Send Button (Right) */}
          <button
            onClick={handleSend}
            className="absolute right-3 bottom-2 text-blue-600 hover:text-blue-800"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Context Sidebar */}
      {showContext && (
        <div className="absolute top-0 left-0 w-72 h-full bg-white border-r border-gray-200 shadow-lg p-4 flex flex-col">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold">Context</h2>
            <button
              onClick={() => setShowContext(false)}
              className="text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Yahan aap ka context show hoga (history, info, etc).
          </div>
        </div>
      )}
    </div>
  );
}
