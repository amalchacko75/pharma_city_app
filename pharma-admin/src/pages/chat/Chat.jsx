import { useState, useRef, useEffect } from "react";
import api from "../../api/axios";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // ✅ Fetch user geolocation once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation not available", err);
          setLocation({ lat: null, lng: null });
        }
      );
    }
  }, []);

  // ✅ send message function (handles text or suggestion)
  const sendMessage = async (msgText) => {
    if (!msgText.trim()) return;

    const userMsg = { sender: "user", text: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Always include lat/lng (even if 0)
      const payload = {
        message: msgText,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
      };

      const res = await api.post("/chatbot/chat/", payload);

      const botMsg = {
        sender: "bot",
        text: res.data.response_data.response,
        suggestions: res.data.response_data.suggestions || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat API error:", err);
      const botMsg = { sender: "bot", text: "Something went wrong!", suggestions: [] };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage(input);
  };

  // ✅ When suggestion is clicked
  const handleSuggestionClick = (suggestion) => {
    // Optionally warn user if location is not yet available
    if (location.lat === null || location.lng === null) {
      console.warn("Location not yet available — sending without it.");
    }
    sendMessage(suggestion);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">ChatBot</div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}

            {/* ✅ Suggestions */}
            {msg.sender === "bot" && msg.suggestions?.length > 0 && (
              <div className="chat-suggestions">
                {msg.suggestions.map((sugg, i) => (
                  <button
                    key={i}
                    className="suggestion-btn"
                    onClick={() => handleSuggestionClick(sugg)}
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-message bot typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={() => sendMessage(input)}>Send</button>
      </div>
    </div>
  );
}
