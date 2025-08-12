export type Role = "system" | "user" | "assistant";

export interface AIMessage {
  role: Role;
  content: string;
}

export async function chatWithOpenAI(
  messages: AIMessage[],
  apiKey: string,
  model: string = "gpt-4o-mini"
): Promise<string> {
  if (!apiKey) throw new Error("Missing OpenAI API key");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`OpenAI error: ${response.status} ${errText}`);
  }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  return content;
}
