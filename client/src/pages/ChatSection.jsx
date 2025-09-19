import { useState, useRef, useEffect } from "react";
import {
  FiSidebar,
  FiMessageSquare,
  // FiMaximize2,
  // FiPause,
  FiX,
  FiPauseCircle,
} from "react-icons/fi";
import { BiConversation } from "react-icons/bi";
import { Plus, Send } from "lucide-react";
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
        } catch { }
      }
    }
  }
}

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Utility: Parse response into structured blocks
  const parseResponse = (content) => {
    const blocks = [];
    const lines = content.split("\n");

    let currentBlock = { type: "text", content: "" };

    lines.forEach((line) => {
      if (line.startsWith("```")) {
        // Switch between code and text
        if (currentBlock.type === "code") {
          blocks.push(currentBlock);
          currentBlock = { type: "text", content: "" };
        } else {
          if (currentBlock.content.trim()) blocks.push(currentBlock);
          currentBlock = { type: "code", content: "" };
        }
      } else if (/^#+\s/.test(line)) {
        // Heading
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
  // const [isStreaming, setIsStreaming] = useState(false);

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
      // flush remaining tokens
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

    // typing effect interval
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
    <div className="bg bg-yellow-300">
      <div className="h-screen flex flex-col bg-white text-gray-900">

        {/* Top Bar */}
        <Topbar />

        {/* Chat Body */}
        <div className="flex-1 bg-transparent overflow-y-auto space-y-4 flex flex-col">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[90%] break-words ${msg.role === "user"
                ? "bg-gray-200 text-gray-900 self-end"
                : "bg-white text-black border border-gray-200 self-start"
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
                      <pre
                        key={idx}
                        className="bg-gray-900 text-green-200 text-sm p-3 rounded-md overflow-x-auto my-2"
                      >
                        <code>{block.content.trim()}</code>
                      </pre>
                    );
                  }
                  return (
                    <p key={idx} className="text-sm leading-relaxed whitespace-pre-wrap">
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
              disabled={isStreaming}
            />

            {/* Send / Stop Button */}
            {isStreaming ? (
              <button
                onClick={() => {
                  clearInterval(streamingInterval.current);
                  tokenQueue.current = [];
                  setIsStreaming(false);
                }}
                className="absolute right-3 bottom-2 text-red-600 hover:text-red-800"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!input.trim()) {
                    const msgDiv = document.getElementById("alertmsg");
                    msgDiv.innerText = "Please enter a message before sending.";


                    // 3 seconds baad auto clear
                    setTimeout(() => {
                      msgDiv.innerText = "";
                    }, 3000);

                    return;
                  }


                  document.getElementById("alertmsg").innerText = ""; // clear msg if any
                  handleSend();
                }}
                className="absolute right-3 bottom-2 text-blue-600 hover:text-blue-800"
              >
                <Send size={20} />
              </button>
            )}


          </div>
          <div id="alertmsg" className="text-red-500 text-sm mt-1"></div>
        </div>

        {/* Context Sidebar */}
        {showContext && (
          <div className="absolute top-11 left-0 w-72 h-[656px] bg-white border-r border-gray-200 shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold">Chats History</h2>
              <button
                onClick={() => setShowContext(false)}
                className="text-gray-500 hover:text-black"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Yahan aap ki recent chats show hongi (history, info, etc).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}














