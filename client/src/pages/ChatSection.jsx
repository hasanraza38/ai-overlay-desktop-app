import { useState, useRef, useEffect } from "react";
import {
  FiX,
  FiCopy,
  FiArrowUpCircle,
  // FiStopCircle,
  FiTrash2,
  FiUser,
  FiCheck,
  FiChevronDown
} from "react-icons/fi";
import { MdOutlineArrowUpward } from "react-icons/md";
import { TbPlayerStopFilled } from "react-icons/tb";
import { BiConversation } from "react-icons/bi";
import { Plus } from "lucide-react";
import Topbar from "../components/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../Instance/api";
import PopupNotification from "../components/PopupNotification";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

async function streamGroqResponse(
  userMessage,
  onChunk,
  onDone,
  conversationId,
  provider,
  apiKey
) {

  console.log("Provider selected:", provider);

  let endpoint = "";

  if (provider === "grok") {
    endpoint = "https://ai-overlay.vercel.app/api/v1/chatbot";
    console.log("Using Grok endpoint");
  } else if (provider === "openai-4.0-mini") {
    endpoint = "https://ai-overlay.vercel.app/api/v1/chatbot/openai";
    console.log("Using OpenAI endpoint");
  } else if (provider === "gemini-2.0-flash") {
    endpoint = "https://ai-overlay.vercel.app/api/v1/chatbot/gemini";
    console.log("Using Gemini endpoint");
  } else {
    throw new Error("Invalid provider selected");
  }

  const token = await window.electronAPI.getToken();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      userInput: userMessage,
      context: "general",
      conversationId,
      model: provider,
      apiKey,
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
  const [copiedText, setCopiedText] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(null);
  const [provider, setProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "error" });

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const messagesEndRef = useRef(null);
  const tokenQueue = useRef([]);
  const streamingInterval = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const loadProviderKey = async () => {
      try {
        const allConfigs = await window.electron.invoke(
          "get-all-model-configs"
        );
        if (allConfigs && allConfigs[provider]) {
          setApiKey(allConfigs[provider].apiKey);
        } else {
          setApiKey("");
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProviderKey();
  }, [provider]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await window.electronAPI.getToken();

        if (!token) {
          console.warn("No token found");
          return;
        }

        const res = await api.get("dashboard/user");
        if (res.status !== 200) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = res.data;
        if (data.success) {
          setUser(data.data);
        } else {
          console.error("User fetch failed:", data.message);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await window.electronAPI.removeToken();

      setUser(null);

      navigate("/signup");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

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

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);



  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (!chatContainer) return;

    const handleScroll = () => {
      // agar user khud upar scroll kare to auto scroll band ho jaye
      const isNearBottom =
        chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 50;
      shouldAutoScroll.current = isNearBottom;
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isStreaming && shouldAutoScroll.current) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50); // chhota delay to prevent instant scroll during user scroll
      return () => clearTimeout(timer);
    }
  }, [messages, isStreaming]);





  useEffect(() => {
    if (!isStreaming) {
      const t = setTimeout(() => {
        const el = inputRef.current;
        if (el) {
          el.focus();
          const len = (el.value || "").length;
          try {
            el.setSelectionRange(len, len);
          } catch (e) {
          }
        }
      }, 60);

      return () => clearTimeout(t);
    }
  }, [isStreaming]);

  useEffect(() => {
    if (showContext) {
      fetchConversations();
    }
  }, [showContext]);

  const fetchConversations = async () => {
    try {

      const res = await api.get("chatbot/conversations");

      setConversations(res.data || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  const loadConversation = async (id) => {
    try {
      const res = await api.get(`chatbot/conversations/${id}`);
      console.log(res.data);

      const formatted = [];
      res.data.forEach((chat) => {
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

  const startNewConversation = async () => {
    setShowContext(false);
    setMessages([]);
    setActiveConversation(null);

    try {
      const token = await window.electronAPI.getToken();

      const res = await fetch("https://ai-overlay.vercel.app/api/v1/chatbot/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: "New Chat" }),
      });


      const newConv = await res.json();

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversation(newConv._id);
      setShowContext(false);
    } catch (err) {
      console.error("Error creating new conversation:", err);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      const token = await window.electronAPI.getToken();

      await api.delete(`chatbot/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConversations((prev) => prev.filter((c) => c._id !== conversationId));

      if (activeConversation === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  const [isWaiting, setIsWaiting] = useState(false);



  const handleSend = async () => {
    if ((!input.trim() && !copiedText.trim()) || isStreaming) return;

    const combinedMessage = copiedText ? copiedText + "\n\n" + input : input;


    const Token = combinedMessage.trim().split(/\s+/).length;
    if (Token > 8000) {
      setNotification({
        message: "Your prompt exceeds 8000 tokens per minute. Please reduce its length.",
        type: "error",
      });
      return;
    }


    const lastModel = localStorage.getItem("lastModel") || "grok";

    const savedConfig = await window.electronAPI.getModelConfig(lastModel);
    console.log("Loaded model config:", savedConfig);

    const currentProvider = savedConfig?.model || "grok";
    const currentApiKey = savedConfig?.apiKey || "";

    const userMessage = { role: "user", content: combinedMessage };

    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setCopiedText("");
    setIsStreaming(true);
    setIsWaiting(true);

    const onChunk = (token) => {
      setIsWaiting(false);
      tokenQueue.current.push(token);
    };

    const onDone = () => {
      setIsWaiting(false);
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

    await streamGroqResponse(
      combinedMessage,
      onChunk,
      onDone,
      activeConversation,
      currentProvider,
      currentApiKey
    );
  };





  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function capitalizeName(name) {
    if (!name) return "";
    return name
      .split(/[\s._]+/) // space, dot, underscore handle karega
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  return (
    <div className="h-screen flex flex-col text-zinc-300 bg-black/30 backdrop-blur-3xl shadow-2xl border border-white/20">
      <Topbar />

      {/* Popup Notification */}
      <PopupNotification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "error" })}
      />

      {/* Controls */}
      <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-md border-b border-white/20">
        <button
          onClick={() => setShowContext(true)}
          className="cursor-pointer flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 hover:bg-white/30 transition"
        >
          <BiConversation size={18} />
        </button>
      </div>




      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col bg-black/30 backdrop-blur-xl scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-400">
            <div>
              <h2 className="opacity-75 text-[20px] font-semibold text-white">How can i help you? {capitalizeName(user?.name || "User")}</h2>
              {/* <p className="text-sm text-gray-400 mt-2">
                Start a new conversation or ask something to begin chatting.
              </p> */}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const parts = msg.content.split(/```/g);
            return (
              <div
                key={i}
                className={`whitespace-pre-wrap break-words p-3 rounded-xl max-w-[85%] backdrop-blur-sm
            ${msg.role === "user"
                    ? "self-end bg-blue-500/20 border border-blue-400/30"
                    : "self-start bg-white/10 border border-white/20"
                  }`}
              >
                {parts.map((part, idx) => {
                  if (idx % 2 === 1) {
                    const code = part.replace(/^[a-z]+\n/, "");
                    return (
                      <div key={idx} className="relative group my-2">
                        <SyntaxHighlighter
                          language={part.match(/^[a-z]+/)?.[0] || "javascript"}
                          style={{
                            ...oneDark,
                            'pre[class*="language-"]': { ...oneDark['pre[class*="language-"]'], background: "transparent" },
                            'code[class*="language-"]': { ...oneDark['code[class*="language-"]'], background: "transparent" },
                          }}
                          customStyle={{
                            borderRadius: "0.75rem",
                            padding: "0.75rem",
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.2)",
                            fontSize: "0.85rem",
                            overflowX: "auto",
                          }}
                          wrapLongLines={true}
                          showLineNumbers={false}
                        >
                          {code}
                        </SyntaxHighlighter>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(code);
                            setCopied(idx);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="absolute top-1 right-1 p-1 rounded bg-white/10 hover:bg-white/20 transition"
                        >
                          {copied === idx ? (
                            <FiCheck size={14} className="text-gray-300" />
                          ) : (
                            <FiCopy size={14} className="text-gray-300" />
                          )}
                        </button>
                      </div>
                    );
                  } else {
                    return <p key={idx}>{part}</p>;

                  }
                })}
                {msg.role === "assistant" && i === messages.length - 1 && isWaiting && (
                  <div className="flex justify-center items-center gap-1 mt-1 text-gray-400">
                    <span className="animate-bounce text-[8px]">●</span>
                    <span className="animate-bounce delay-150 text-[8px]">●</span>
                    <span className="animate-bounce delay-300 text-[8px]">●</span>
                  </div>
                )}
              </div>
            );
          })
        )}

        <div ref={messagesEndRef}></div>
      </div>





      {/* Input */}
      <div className="p-1 border-t border-white/20 bg-white/5 backdrop-blur-md">
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
              className="cursor-pointer text-gray-400 hover:text-red-400 flex items-center"
            >
              <FiX size={14} />
            </button>
          </div>
        )}

        <div className="relative flex items-end max-w-4xl mx-auto w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-1">


          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="1"
            placeholder="Ask anything"
            className="flex-1 bg-transparent text-white placeholder-white/60 resize-none focus:outline-none px-4 py-2 break-words"
            disabled={isStreaming}
          />
          {isStreaming ? (
            <button
              onClick={() => {
                clearInterval(streamingInterval.current);
                tokenQueue.current = [];
                setIsStreaming(false);
                setIsWaiting(false);
              }}
              className="p-2 rounded-[50%] opacity-75 bg-white text-red-400 hover:text-red-500 cursor-pointer"
            >
              <TbPlayerStopFilled size={20} className="text-black" />
            </button>

          ) : (
            <button
              onClick={handleSend}
              disabled={isStreaming}
              className="p-2 rounded-[50%] opacity-75 bg-white text-white/70 hover:text-white cursor-pointer"
            >
              <MdOutlineArrowUpward size={22} className="text-black" />
            </button>

          )}
        </div>

      </div>


      {/* Context Sidebar */}
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
              className="relative top-10 w-52 h-[calc(100vh-2.75rem)] bg-gray-500/10 backdrop-blur-lg border-r border-white/20 flex flex-col z-50 shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="flex h-13 justify-between items-center border-b border-white/20 p-4">
                <h2 className="text-lg font-semibold text-gray-200">Chats</h2>

                <button onClick={() => setShowContext(false)} className="cursor-pointer text-gray-400 hover:text-gray-200 transition">

                  <FiX size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm text-gray-100 scrollbar-thin">
                <button
                  onClick={startNewConversation}
                  className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-white/20 text-white text-sm mb-3"
                >
                  <Plus size={16} /> New Chat
                </button>

                <h3 className="text-xs uppercase text-gray-400 mb-2">
                  Recent Chats
                </h3>
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <div
                      key={conv._id}
                      className={`group flex items-center justify-between w-full px-2 py-1 rounded hover:bg-white/20 ${activeConversation === conv._id ? "bg-white/10" : ""
                        }`}
                    >
                      {/* Chat Title Button */}
                      <button
                        onClick={() => loadConversation(conv._id)}
                        className="cursor-pointer flex-1 text-left text-sm truncate"
                      >
                        {conv.title || "Untitled Chat"}
                      </button>

                      <button
                        onClick={() => handleDeleteConversation(conv._id)}
                        className="cursor-pointer opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 transition ml-2"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No chats yet</p>
                )}
              </div>

              <div className="border-t border-white/20 p-3">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center cursor-pointer gap-2 h-8 w-full px-2 py-2 rounded hover:bg-white/10 text-white"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-8 h-8 text-gray-400 bg-gray-700 rounded-full p-1" />
                      )}
                      <span className="text-sm font-medium">
                        {user?.name || "User"}
                      </span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute bottom-12 left-0 w-48 bg-gray-800/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-2 text-sm z-50">
                        <button
                          onClick={() => navigate("/settings")}
                          className="block w-full cursor-pointer text-left px-2 py-2 rounded hover:bg-white/10 text-gray-200"
                        >
                          Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full cursor-pointer text-left px-2 py-2 rounded hover:bg-red-500/20 text-red-400"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Loading user...</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {showSettings && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          />
          <div
            className="relative bg-white/10 backdrop-blur-xl border border-white/20 
                          rounded-xl shadow-lg p-4 max-w-sm w-full text-center"
          >
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              Copied Text
            </h3>
            <p
              className="text-xs text-gray-300 whitespace-pre-wrap break-words text-left 
             max-h-32 overflow-y-auto leading-relaxed px-2 py-1 rounded-md bg-black/20"
            >
              {copiedText}
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="cursor-pointer mt-3 px-3 py-1 text-xs rounded-lg bg-white/20 
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