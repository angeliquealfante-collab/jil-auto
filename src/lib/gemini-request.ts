// Invoke from a user action only. Personal API keys are sent only to Google.
export async function requestGemini(apiKey: string, body: unknown): Promise<string> {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    signal: AbortSignal.timeout(60000),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    if ([400, 401, 403].includes(response.status)) throw new Error("Google rejected the request. Check your Gemini API key and API access in Google AI Studio.");
    if (response.status === 429) throw new Error("Your Gemini quota or rate limit was reached. Check your Google AI Studio billing or try again later.");
    if (response.status === 404) throw new Error("The Gemini model is unavailable for this key.");
    throw new Error("Gemini is temporarily unavailable. Please try again.");
  }
  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("").trim();
  if (!text) throw new Error("Gemini did not return a result. Try adjusting the details.");
  return text;
}