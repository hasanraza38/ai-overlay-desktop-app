import { useEffect, useState, useRef } from "react";

function ChatSection() {
  const [clipboardText, setClipboardText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!window.electronAPI) {
      console.error('electronAPI is not available');
      setIsLoading(false);
      return;
    }

    try {
      const text = window.electronAPI.readClipboard();
      setClipboardText(text || "");
    } catch (err) {
      console.error("Error reading initial clipboard:", err);
    }

    setIsLoading(false);

    // Clipboard listener
    const cleanup = window.electronAPI.onClipboardUpdate((newText) => {
      setClipboardText(newText || "");
      if (newText) {
        addMessage("context", newText);
      }
    });

    // Selection listener
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection) {
        const text = selection.toString();
        setSelectedText(text);
        if (text) addMessage("context", text);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);
    document.addEventListener("selectionchange", handleSelection);

    return () => {
      if (typeof cleanup === "function") cleanup();
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, []);

  const addMessage = (type, content) => {
    setMessages((prev) => [...prev, { type, content }]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim()) return;

    addMessage("user", userInput);
    setUserInput("");

    // Mock AI response (replace with API call)
    setTimeout(() => {
      addMessage("bot", `I see you're asking about "${userInput}". Based on your ${selectedText ? "selected text" : "clipboard content"}, I can help with that!`);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading AI Overlay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <i className="fas fa-robot text-xl"></i>
            </div>
            <h1 className="text-xl font-bold">AI Overlay</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm bg-white/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Connected</span>
          </div>
        </div>
      </div>

      {/* Context Bar - Fixed at the top above input */}
      {(selectedText || clipboardText) && (
        <div className="bg-amber-50 border-b border-amber-200 p-3">
          <div className="max-w-4xl mx-auto flex items-start">
            <div className="bg-amber-100 p-1 rounded mr-2 mt-0.5">
              <i className="fas fa-clipboard text-amber-600 text-xs"></i>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-amber-800 mb-1">Context from {selectedText ? "selection" : "clipboard"}:</p>
              <p className="text-xs text-amber-700 truncate">
                {selectedText || clipboardText}
              </p>
            </div>
            <button 
              onClick={() => {
                setSelectedText("");
                setClipboardText("");
              }}
              className="text-amber-500 hover:text-amber-700 text-xs"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Welcome message */}
            <div className="max-w-[85%] md:max-w-[75%] bg-blue-100 text-gray-800 p-4 rounded-2xl rounded-bl-none mb-4">
              <div>Hello! I'm your AI assistant. I can use text from your clipboard or selections as context for our conversation.</div>
              <div className="text-xs text-gray-500 mt-2 text-right">Just now</div>
            </div>

            {/* Messages list */}
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] md:max-w-[75%] mb-4 p-4 rounded-2xl ${
                  msg.type === "user" 
                    ? "bg-blue-600 text-white ml-auto rounded-br-none" 
                    : msg.type === "context" 
                    ? "bg-amber-100 text-amber-900 border border-amber-200 mx-auto text-sm" 
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <div>{msg.content}</div>
                <div className={`text-xs mt-2 text-right ${msg.type === "user" ? "text-blue-200" : "text-gray-500"}`}>
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-3">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask AI Overlay anything..." 
                className="flex-1 py-3 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!userInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            
            {/* Help text */}
            <p className="text-xs text-gray-500 mt-2 text-center">
              Select text or copy to clipboard to provide context for AI responses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSection;