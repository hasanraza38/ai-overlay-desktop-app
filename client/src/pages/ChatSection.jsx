import { useState, useRef, useEffect } from "react";
import {
  FiX,
  FiCopy,
  FiArrowUpCircle,
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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { streamGroqResponse } from "../helper/streamGroq";
import { capitalizeName } from "../helper/capitalName";
import PopupNotification from "../components/PopupNotification";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";



export default function Chatbot() {
  // states
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
  const [isWaiting, setIsWaiting] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "error" });
  const [openContexts, setOpenContexts] = useState(false);



  // ref
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


  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    const chatContainer = messagesEndRef.current?.parentElement;
    if (!chatContainer) return;

    const handleScroll = () => {
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



  const loadConversation = async (id) => {
    try {
      const res = await api.get(`chatbot/conversations/${id}`);

      const data = Array.isArray(res.data) ? res.data : [];

      const formatted = data.flatMap((chat) => {
        const parts = [];

        if (chat?.context) {
          parts.push({
            role: "user",
            content: chat.context || "",
            type: "context",
          });
        }

        if (chat?.prompt) {
          parts.push({
            role: "user",
            content: chat.prompt || "",
            type: "prompt",
          });
        }

        if (chat?.response) {
          parts.push({
            role: "assistant",
            content: chat.response || "",
            type: "response",
          });
        }

        return parts;
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
    setCopiedText("");
  };

  const fetchConversations = async () => {
    try {

      const res = await api.get("chatbot/conversations");

      setConversations(res.data || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
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

    const currentProvider = savedConfig?.model || "grok";
    const currentApiKey = savedConfig?.apiKey || "";

    const userContext = { role: "user", content: copiedText, type: "context" };
    const userPrompt = { role: "user", content: input, type: "prompt" };

    setMessages((prev) => [
      ...prev,
      userContext,
      userPrompt,
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
      input,
      onChunk,
      onDone,
      activeConversation,
      currentProvider,
      currentApiKey,
      setActiveConversation,
      copiedText
    );
  };



  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


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

      <div>
        <button>

        </button>
      </div>


      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col bg-black/30 backdrop-blur-xl scrollbar-thin">


        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-400">
            <div>
              <h2 className="opacity-75 text-[20px] font-semibold text-white">
                How can I help you? {capitalizeName(user?.name || "User")}
              </h2>
            </div>
          </div>
        ) : (
          messages?.map((msg, i) => {
            if (!msg || typeof msg.content !== "string") return null;

            const parts = msg?.content?.split(/```/g);

            if (msg.type === "context") {
              return (
                <div
                  key={i}
                  className="self-end bg-blue-500/10 border border-blue-400/30 rounded-2xl backdrop-blur-sm p-3 max-w-[80%] mb-2 transition-all"
                >
                  <button
                    onClick={() => setOpenContexts(!openContexts)}
                    className="flex items-center justify-between w-full text-blue-300 text-sm font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <FiUser size={14} />
                      <span>Context</span>
                    </div>
                    <FiChevronDown
                      size={16}
                      className={`transform transition-transform duration-200 ${openContexts ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openContexts && (
                    <div className="mt-2 text-gray-200 text-[14px] whitespace-pre-wrap leading-relaxed bg-white/5 border border-white/10 p-3 rounded-md">
                      {msg.content}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={i}
                className={`whitespace-pre-wrap break-words p-4 rounded-2xl backdrop-blur-sm transition-all duration-200
          ${msg.role === "user"
                    ? "self-end bg-blue-500/20 border border-blue-400/30"
                    : "self-start bg-white/10 border border-white/20"
                  }
              max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[65%] xl:max-w-[55%]
             `}
              >
                {parts.map((part, idx) => {
                  if (idx % 2 === 1) {
                    const codeLang = part.match(/^[a-z]+/)?.[0] || "plaintext";
                    const code = part.replace(/^[a-z]+\n/, "");
                    return (
                      <div key={idx} className="relative group my-3">
                        <SyntaxHighlighter
                          language={codeLang}
                          style={{
                            ...oneDark,
                            'pre[class*="language-"]': {
                              ...oneDark['pre[class*="language-"]'],
                              background: "transparent",
                            },
                            'code[class*="language-"]': {
                              ...oneDark['code[class*="language-"]'],
                              background: "transparent",
                            },
                          }}
                          customStyle={{
                            borderRadius: "0.75rem",
                            padding: "1rem",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            fontSize: "0.85rem",
                            lineHeight: 1.6,
                            overflowX: "auto",
                          }}
                          wrapLongLines
                        >
                          {code}
                        </SyntaxHighlighter>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(code);
                            setCopied(idx);
                            setTimeout(() => setCopied(null), 2000);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 transition"
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
                    return (
                      <ReactMarkdown
                        key={idx}
                        remarkPlugins={[remarkGfm]}
                        className="prose prose-invert max-w-none text-gray-200 leading-relaxed"
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              className="text-2xl md:text-3xl font-bold text-white mt-4 mb-2 border-b border-white/10 pb-1"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-xl md:text-2xl font-semibold text-white mt-3 mb-1"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-lg md:text-xl font-semibold text-white mt-2 mb-1"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p
                              className="text-gray-200 text-[15px] md:text-[16px] mb-3 leading-relaxed"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc list-inside space-y-1 ml-4 text-gray-200 text-[15px] md:text-[16px]"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal list-inside space-y-1 ml-4 text-gray-200 text-[15px] md:text-[16px]"
                              {...props}
                            />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="border-l-4 border-blue-500 pl-3 italic text-gray-300 bg-white/5 p-2 rounded-md my-3"
                              {...props}
                            />
                          ),
                          a: ({ node, href, children, ...props }) => (
                            <a
                              {...props}
                              href={href}
                              onClick={(e) => {
                                e.preventDefault();
                                if (href) {
                                  if (window?.electronAPI?.openExt) {
                                    window.electronAPI.openExt(href);
                                  } else {
                                    window.open(href, "_blank");
                                  }
                                }
                              }}
                              className="text-blue-400 hover:underline hover:text-blue-300 cursor-pointer"
                            >
                              {children}
                            </a>
                          ),
                         
                        }}
                      >
                        {part}
                      </ReactMarkdown>
                    );
                  }
                })}

                {msg.role === "assistant" && i === messages.length - 1 && isWaiting && (
                  <div className="flex justify-center items-center gap-1 mt-2 text-gray-400">
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
            <span className="font-medium text-gray-300">Context</span>
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
              <TbPlayerStopFilled size={18} className="text-black" />
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


      {
        showSettings && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            />
          </div>
        )
      }

      {
        showPopup && (
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
        )
      }
    </div >
  );
}