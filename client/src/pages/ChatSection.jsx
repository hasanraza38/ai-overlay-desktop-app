import { useState, useRef, useEffect } from "react";
import {
  FiSidebar,
  FiMessageSquare,
  FiX,
  FiCopy,
  FiArrowUpCircle,
  FiStopCircle,
} from "react-icons/fi";
import { BiConversation } from "react-icons/bi";
import { Plus } from "lucide-react";
import Topbar from "../components/Topbar";

// Streaming function
async function streamGroqResponse(userMessage, onChunk, onDone) {
  const response = await fetch("http://localhost:4000/api/v1/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userInput: userMessage,
      context: "general",
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
        if (data === "[DONE]") {
          onDone();
          return;
        }
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
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Parse response blocks
  const parseResponse = (content) => {
    const blocks = [];
    const lines = content.split("\n");

    let currentBlock = { type: "text", content: "" };

    lines.forEach((line) => {
      if (line.startsWith("```")) {
        if (currentBlock.type === "code") {
          blocks.push(currentBlock);
          currentBlock = { type: "text", content: "" };
        } else {
          if (currentBlock.content.trim()) blocks.push(currentBlock);
          currentBlock = { type: "code", content: "" };
        }
      } else if (/^#+\s/.test(line)) {
        if (currentBlock.content.trim()) blocks.push(currentBlock);
        blocks.push({ type: "heading", content: line.replace(/^#+\s/, "") });
        currentBlock = { type: "text", content: "" };
      } else {
        currentBlock.content += line + "\n";
      }
    });

    if (currentBlock.content.trim()) blocks.push(currentBlock);
    return blocks;
  };

  const tokenQueue = useRef([]);
  const streamingInterval = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    const onChunk = (token) => {
      tokenQueue.current.push(token);
    };

    const onDone = () => {
      const flushInterval = setInterval(() => {
        if (tokenQueue.current.length === 0) {
          clearInterval(flushInterval);
          clearInterval(streamingInterval.current);
          setIsStreaming(false);
        } else {
          const token = tokenQueue.current.shift();
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content += token;
            return updated;
          });
        }
      }, 50);
    };

    streamingInterval.current = setInterval(() => {
      if (tokenQueue.current.length > 0) {
        const token = tokenQueue.current.shift();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content += token;
          return updated;
        });
      }
    }, 40);

    await streamGroqResponse(input, onChunk, onDone);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col text-white 
                    bg-transparent backdrop-blur-xl 
                    bg-white/10 shadow-2xl border border-white/20">

      {/* Topbar */}
      <Topbar />

      {/* Top Controls */}
      <div className="flex justify-between items-center p-3 
                      bg-white/10 backdrop-blur-md 
                      border-b border-white/20">
        <button
          onClick={() => setShowContext(true)}
          className="flex items-center gap-2 px-3 py-1 
                     rounded-md bg-white/10 hover:bg-white/30 transition"
        >
          <BiConversation size={18} />
          <span>Chats</span>
        </button>
        <div className="flex gap-5 text-white/70">
          <button className="hover:text-white">
            <FiSidebar size={18} />
          </button>
          <button className="hover:text-white">
            <FiMessageSquare size={18} />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[85%] backdrop-blur-sm
                        ${msg.role === "user"
              ? "self-end bg-blue-500/20 border border-blue-400/30"
              : "self-start bg-white/10 border border-white/20"
            }`}
          >
            {msg.role === "assistant"
              ? parseResponse(msg.content).map((block, idx) => {
                if (block.type === "heading") {
                  return (
                    <h2 key={idx} className="text-lg font-semibold mt-2 mb-1">
                      {block.content}
                    </h2>
                  );
                }
                if (block.type === "code") {
                  return (
                    <div key={idx} className="relative my-2">
                      <pre className="bg-black/60 text-green-300 text-sm p-3 rounded-lg overflow-x-auto">
                        <code>{block.content.trim()}</code>
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(block.content.trim());
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="absolute top-1 right-1 text-xs 
                                   bg-white/1 px-2 py-1 rounded hover:bg-white/30"
                      >
                        {copied ? "Copied!" : <FiCopy />}
                      </button>
                    </div>
                  );
                }
                return (
                  <p
                    key={idx}
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                  >
                    {block.content.trim()}
                  </p>
                );
              })
              : msg.content}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Bar */}
      <div className="p-2 border-t border-white/20 bg-white/5 backdrop-blur-md">
        <div className="relative flex items-end max-w-4xl mx-auto w-full 
                        rounded-2xl border border-white/20 
                        bg-white/10 backdrop-blur-md p-2">
          {/* Plus Icon */}
          <button
            className="p-2 text-white/70 hover:text-white"
            onClick={() => alert("Upload window khul jaeygi")}
          >
            <Plus size={24} />
          </button>

          {/* Textarea */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="1"
            placeholder="Ask anything...."
            className="flex-1 bg-transparent text-white placeholder-white/50 
                       resize-none focus:outline-none px-2 py-2"
            style={{ minHeight: "30px", maxHeight: "200px" }}
            disabled={isStreaming}
          />

          {/* Send / Stop */}
          {isStreaming ? (
            <button
              onClick={() => {
                clearInterval(streamingInterval.current);
                tokenQueue.current = [];
                setIsStreaming(false);
              }}
              className="p-2 text-red-400 hover:text-red-500"
              title="Stop"
            >
              <FiStopCircle size={26} />
            </button>
          ) : (
            <button
              onClick={() => {
                if (!input.trim()) {
                  const msgDiv = document.getElementById("alertmsg");
                  msgDiv.innerText = "Please enter a message before sending.";
                  setTimeout(() => {
                    msgDiv.innerText = "";
                  }, 3000);
                  return;
                }
                document.getElementById("alertmsg").innerText = "";
                handleSend();
              }}
              className="p-2 text-white/70 hover:text-white rounded-full shadow-md 
                         transition"
              title="Send"
            >
              <FiArrowUpCircle size={26} />
            </button>
          )}
        </div>
        <div id="alertmsg" className="text-red-400 text-sm mt-1"></div>
      </div>

      {/* Sidebar Context */}
      {showContext && (
  <div className="fixed inset-0 z-40 flex">
    {/* Overlay */}
    <div 
      className="absolute inset-0 bg-white/1 backdrop-blur-sm" 
      onClick={() => setShowContext(false)} 
    />

    {/* Sidebar */}
    <div className="relative top-11 w-72 h-[656px] bg-gray-900/50 backdrop-blur-xl border-r border-white/20 p-4 flex flex-col z-50">
      <div className="flex justify-between items-center border-b border-white/20 pb-2">
        <h2 className="text-lg font-semibold text-gray-200">Chats History</h2>
        <button
          onClick={() => setShowContext(false)}
          className="text-gray-400 hover:text-gray-200 transition"
        >
          <FiX size={20} />
        </button>
      </div>
      <div className="mt-3 text-sm text-gray-300">
        Yahan aap ki recent chats show hongi (history, info, etc).
      </div>
    </div>
  </div>
)}

    </div>
  );
}
