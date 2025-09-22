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
import { motion, AnimatePresence } from "framer-motion";

// Streaming function
async function streamGroqResponse(userMessage, onChunk, onDone, conversationId) {
  const token = await window.electronAPI.getToken();

  const response = await fetch("http://localhost:4000/api/v1/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      userInput: userMessage,
      context: "general",
      conversationId, // send active conversation id
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
  const [copiedText, setCopiedText] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);

  const [conversations, setConversations] = useState([]); // all convos
  const [activeConversation, setActiveConversation] = useState(null); // current convo

  const messagesEndRef = useRef(null);
  const tokenQueue = useRef([]);
  const streamingInterval = useRef(null);

  // Clipboard listen
  useEffect(() => {
    if (window.electronAPI?.onClipboardUpdate) {
      const unsubscribe = window.electronAPI.onClipboardUpdate((text) => {
        if (text && text.trim() !== "") {
          setCopiedText(text);
        }
      });
      return unsubscribe;
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversations on sidebar open
  useEffect(() => {
    if (showContext) {
      fetchConversations();
    }
  }, [showContext]);

  const fetchConversations = async () => {
    try {
      const token = await window.electronAPI.getToken();
      const res = await fetch("http://localhost:4000/api/v1/chatbot/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  // Load single conversation
  const loadConversation = async (id) => {
    try {
      const token = await window.electronAPI.getToken();
      const res = await fetch(`http://localhost:4000/api/v1/chatbot/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const formatted = [];
      data.forEach((chat) => {
        formatted.push({ role: "user", content: chat.prompt });
        formatted.push({ role: "assistant", content: chat.response });
      });

      setMessages(formatted);
      setActiveConversation(id);
      setShowContext(false);
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };

  // Start new conversation
  const startNewConversation = async () => {
    setShowContext(false);
    setMessages([]);
    setActiveConversation(null);

    try {
      const token = await window.electronAPI.getToken();
      const res = await fetch("http://localhost:4000/api/v1/chatbot/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: "New Chat" }),
      });
      const newConv = await res.json();

      setConversations((prev) => [newConv, ...prev]); // top pe add
      setActiveConversation(newConv._id);
      setShowContext(false);
    } catch (err) {
      console.error("Error creating new conversation:", err);
    }
  };

  // Handle send
  const handleSend = async () => {
    if ((!input.trim() && !copiedText.trim()) || isStreaming) return;

    const combinedMessage = copiedText ? copiedText + "\n\n" + input : input;
    const userMessage = { role: "user", content: combinedMessage };

    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setCopiedText("");
    setIsStreaming(true);

    const onChunk = (token) => tokenQueue.current.push(token);

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

    await streamGroqResponse(combinedMessage, onChunk, onDone, activeConversation);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col text-white backdrop-blur-xl bg-black/80 shadow-2xl border border-white/20">
      <Topbar />

      {/* Controls */}
      <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-md border-b border-white/20">
        <button
          onClick={() => setShowContext(true)}
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 hover:bg-white/30 transition"
        >
          <BiConversation size={18} />
          <span>Chats</span>
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col bg-black/20">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`whitespace-pre-line p-3 rounded-xl max-w-[85%] backdrop-blur-sm
              ${msg.role === "user"
                ? "self-end bg-blue-500/20 border border-blue-400/30"
                : "self-start bg-white/10 border border-white/20"
              }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-1 border-t border-white/20 bg-white/5 backdrop-blur-md">
      {/* Copied Text Box (Input ke upar dikhne wala) */}
{copiedText && (
  <div
    className="mx-auto max-w-4xl w-full mb-2 px-3 py-1.5 
               rounded-lg border border-white/20 bg-white/10 
               backdrop-blur-md text-xs text-white/70 
               flex items-center justify-between cursor-pointer"
    onClick={() => setShowPopup(true)}
  >
    <span className="font-medium text-gray-300">Copied Text</span>
    <button
      onClick={(e) => {
        e.stopPropagation();
        setCopiedText("");
      }}
      className="text-gray-400 hover:text-red-400 flex items-center"
    >
      <FiX size={14} />
    </button>
  </div>
)}

        <div className="relative flex items-end max-w-4xl mx-auto w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="1"
            placeholder="Ask anything...."
            className="flex-1 bg-transparent text-white placeholder-white/50 resize-none focus:outline-none px-2 py-2"
            disabled={isStreaming}
          />
          <button onClick={handleSend} disabled={isStreaming} className="p-2 text-white/70 hover:text-white">
            <FiArrowUpCircle size={26} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {showContext && (
          <div className="fixed inset-0 z-40 flex">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowContext(false)}
            />
            <motion.div
              className="relative top-10 w-72 h-[calc(100vh-2.75rem)] bg-gray-500/10 backdrop-blur-md border-r border-white/20 p-4 flex flex-col z-50 shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <h2 className="text-lg font-semibold text-gray-200">Chats</h2>
                <button onClick={() => setShowContext(false)} className="text-gray-400 hover:text-gray-200 transition">
                  <FiX size={20} />
                </button>
              </div>

              {/* New Chat Btn */}
              <button
                onClick={startNewConversation}
                className="flex items-center gap-2 mt-3 mb-4 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                <Plus size={16} /> New Chat
              </button>

              <h3 className="text-xs uppercase text-gray-400 mb-2">Recent Chats</h3>
              <div className="space-y-2 text-sm text-gray-100 overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <button
                      key={conv._id}
                      onClick={() => loadConversation(conv._id)}
                      className={`block w-full text-left px-2 py-1 rounded hover:bg-white/20 ${
                        activeConversation === conv._id ? "bg-white/10" : ""
                      }`}
                    >
                      {conv.title || "Untitled Chat"}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400">No chats yet</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Themed Popup (file ke end me) */}
{showPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowPopup(false)}
    />
    {/* Popup Box */}
    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 
                    rounded-xl shadow-lg p-4 max-w-sm w-full text-center">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">
        Copied Text
      </h3>
      <p className="text-xs text-gray-300 whitespace-pre-line">
        {copiedText}
      </p>
      <button
        onClick={() => setShowPopup(false)}
        className="mt-3 px-3 py-1 text-xs rounded-lg bg-white/20 
                   hover:bg-white/30 text-gray-200 transition"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
