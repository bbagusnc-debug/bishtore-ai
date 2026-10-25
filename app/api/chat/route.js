import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message, imageBase64 } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key belum dipasang di Vercel!" }, { status: 500 });
    }

    const parts = [];

    // Jika ada foto dari kamera
    if (imageBase64) {
      const mimeType = imageBase64.substring(imageBase64.indexOf(":") + 1, imageBase64.indexOf(";"));
      const base64Data = imageBase64.split(",")[1];
      parts.push({
        inline_data: {
          mime_type: mimeType || "image/jpeg",
          data: base64Data,
        },
      });
    }

    // Teks instruksi user
    parts.push({ text: message || "Jelaskan gambar ini secara detail dan jelas." });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }] }),
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return NextResponse.json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      return NextResponse.json({ reply: "Maaf, Bishtore AI belum bisa membaca permintaan ini." });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
