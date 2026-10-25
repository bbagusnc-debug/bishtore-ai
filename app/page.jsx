"use client";
import { useState, useRef } from "react";
import { Camera, Send, Bot, User, Trash2 } from "lucide-react";

export default function BishtoreAI() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Halo! Saya Bishtore AI. Kamu bisa tanya apa saja atau jepret foto pakai tombol kamera 📷." }
  ]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input && !imagePreview) return;
    if (loading) return;

    const userMsg = { role: "user", text: input, image: imagePreview };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setImagePreview(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, imageBase64: userMsg.image }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || data.error }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Koneksi terputus. Coba lagi!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: "800px", margin: "0 auto", backgroundColor: "#0b1329" }}>
      {/* Header */}
      <header style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "#38bdf8" }}>⚡ Bishtore AI</h1>
        <span style={{ fontSize: "0.8rem", background: "#1e293b", padding: "4px 8px", borderRadius: "6px", color: "#94a3b8" }}>Versi 1.0</span>
      </header>

      {/* Chat Box */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            {msg.role === "assistant" && <Bot size={22} color="#38bdf8" style={{ marginTop: "4px" }} />}
            <div style={{ backgroundColor: msg.role === "user" ? "#0284c7" : "#1e293b", padding: "12px 16px", borderRadius: "14px", lineHeight: "1.5", fontSize: "0.95rem" }}>
              {msg.image && (
                <img src={msg.image} alt="Kamera preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", marginBottom: "8px", display: "block" }} />
              )}
              {msg.text}
            </div>
            {msg.role === "user" && <User size={22} color="#94a3b8" style={{ marginTop: "4px" }} />}
          </div>
        ))}
        {loading && <div style={{ color: "#94a3b8", fontSize: "0.85rem", fontStyle: "italic" }}>⚡ Bishtore AI sedang menganalisis...</div>}
      </div>

      {/* Preview Image sebelum dikirim */}
      {imagePreview && (
        <div style={{ padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", background: "#1e293b" }}>
          <img src={imagePreview} alt="Snapshot" style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
          <span style={{ fontSize: "0.8rem", color: "#38bdf8" }}>Foto siap dianalisis!</span>
          <Trash2 size={18} color="#f43f5e" style={{ cursor: "pointer", marginLeft: "auto" }} onClick={() => setImagePreview(null)} />
        </div>
      )}

      {/* Input & Tombol Kamera */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #1e293b", display: "flex", gap: "8px", alignItems: "center" }}>
        <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleCapture} style={{ display: "none" }} />
        <button onClick={() => fileInputRef.current?.click()} style={{ background: "#1e293b", border: "1px solid #334155", color: "#38bdf8", padding: "12px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center" }} title="Buka Kamera">
          <Camera size={20} />
        </button>
        <input
          type="text"
          placeholder="Tanya apa saja atau foto sesuatu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{ flex: 1, padding: "12px 16px", borderRadius: "24px", border: "1px solid #334155", background: "#0f172a", color: "#fff", outline: "none" }}
        />
        <button onClick={handleSend} style={{ background: "#0284c7", border: "none", color: "#fff", padding: "12px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
