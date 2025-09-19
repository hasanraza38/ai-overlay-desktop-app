import { useState, useRef, useEffect } from "react";
import {
  FiSidebar,
  FiMessageSquare,
  // FiMaximize2,
  // FiPause,
  FiX,
  FiPauseCircle,
  FiCopy,
  FiArrowUpCircle,
  FiArrowUp,
  FiStopCircle,
} from "react-icons/fi";
import { BiConversation } from "react-icons/bi";
import { ArrowBigUp, Plus, Send } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
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
    <div className="h-screen flex flex-col bg-white text-gray-900">
      <Topbar />
      {/* Top Bar */}
      <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={() => setShowContext(true)}
          className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200"
        >
          <BiConversation size={18} />
          <span>Chats</span>
        </button>
        <div className="flex gap-5 text-gray-500">
          <button className="hover:text-black">
            <FiSidebar size={18} />
          </button>
          <button className="hover:text-black">
            <FiMessageSquare size={18} />
          </button>
          {/* <button className="hover:text-black"><FiMaximize2 size={18} /></button> */}
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
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
                      <div key={idx} className="relative my-2">
                        <pre className="bg-gray-900 text-green-200 text-sm p-3 rounded-md overflow-x-auto">
                          <code>{block.content.trim()}</code>
                        </pre>
                        {/* Copy Button (Code Copy) */}
                        <button
  onClick={() => {
    navigator.clipboard.writeText(block.content.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }}
  className="absolute top-1 right-1 text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
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
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="relative flex items-end max-w-4xl mx-auto w-full bg-[#f9f9f9] rounded-2xl border border-gray-300 p-2">
          {/* Plus Icon (Left) */}
          <button
            className="p-2 text-gray-500 hover:text-black"
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
            autoComplete="off"
            autoCorrect="off"
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 resize-none focus:outline-none px-2 py-2"
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
              className="p-2 text-gray-700 hover:text-black" title="stop"
            >
              <FiStopCircle size={26} />
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
              className="p-2 bg-white rounded-full shadow-2xl text-gray-500 hover:text-black" title="send"
            >
              <FiArrowUpCircle size={26}/>
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














