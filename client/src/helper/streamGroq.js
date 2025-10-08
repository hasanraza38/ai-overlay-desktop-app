export async function streamGroqResponse(
  userMessage,
  onChunk,
  onDone,
  conversationId,
  provider,
  apiKey,
  setActiveConversation,
  context 
) {
  let endpoint = "";

  if (provider === "grok") {
    endpoint = "http://localhost:4000/api/v1/chatbot";
  } else if (provider === "openai-4.0-mini") {
    endpoint = "http://localhost:4000/api/v1/chatbot/openai";
  } else if (provider === "gemini-2.0-flash") {
    endpoint = "http://localhost:4000/api/v1/chatbot/gemini";
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
      context, 
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

          if (json.conversationId && !conversationId) {
            setActiveConversation(json.conversationId);
          }

          if (json.token) onChunk(json.token);
        } catch {
          console.warn(" Failed to parse stream chunk:", data);
        }
      }
    }
  }
}
