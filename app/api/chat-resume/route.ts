import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4"),
    messages: [
      {
        role: "system",
        content:
          "You are Vikram Kumar's resume assistant. Only answer questions about his skills, experience, projects, and achievements.",
      },
      ...messages,
    ],
  });

  return result.toTextStreamResponse();
}
