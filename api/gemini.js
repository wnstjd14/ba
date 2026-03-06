export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { prompt, imageBase64, imageMimeType } = req.body;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  const parts = [];
  if (imageBase64) parts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
  parts.push({ text: prompt });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { responseModalities: ["image", "text"] }
      })
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
