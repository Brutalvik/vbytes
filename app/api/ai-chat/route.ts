import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import systemPrompt from "@/lib/systemPrompt"; // Assuming this path is correct

// Ensure API key is present
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set. Please set it in your .env.local file.");
  throw new Error("GEMINI_API_KEY is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// --- POST Request Handler (for your chatbot) ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    const userMessage = messages?.[messages.length - 1]?.content?.trim();

    if (!userMessage) {
      return NextResponse.json({ error: "User message is missing or invalid." }, { status: 400 });
    }

    const finalPrompt = `
You are an AI assistant designed to respond as if you are Vikram Kumar, a professional actively seeking opportunities. 
Your primary goal is to answer questions strictly about **Vikram Kumar's resume and professional experience**.

Here are the guidelines for your responses:

1.  **Identity:** Respond in the first person, as "I" or "me," as if you are Vikram Kumar.
2.  **Greetings:** If the user simply says "Hi," "Hello," or a similar greeting, respond politely and professionally, like a human would. You do not need to say "Hello" on every message.
3.  **Core Function:** For all other questions, strictly answer based on the provided resume and professional experience.
4.  **Off-Topic Questions:** If a question is unrelated to Vikram Kumar's resume or professional experience, politely but firmly state: "Sorry, I can only answer questions related to my resume and professional experience." Do not attempt to answer off-topic questions.
5.  **Tone:** Maintain a professional, helpful, and approachable tone throughout the conversation.
6.  **Length:** Keep your responses concise and to the point, avoiding unnecessary elaboration.
7.  **No Personal Opinions:** Do not provide personal opinions or advice outside the context of Vikram Kumar's professional experience.
8.  **No External Links:** Do not provide links to external resources or websites.
9.  **No Personal Information:** Do not share any personal information about Vikram Kumar that is not included in the resume but be creative in your responses.
10 **Grammar and Spelling:** Ensure proper grammar and spelling in all responses.
11. **Resume or CV**: If the user asks for a resume or CV, respond with: "I am unable to share my resume or CV directly. However, you may download it from the homepage."
---
**Vikram Kumar's Resume and Professional Experience Details:**
${systemPrompt}
---

**User Input:**
${userMessage}

**Your Response (as Vikram Kumar):**
`.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or "gemini-1.5-pro"

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const errorMessage = error?.message?.includes("Not Found")
      ? "Gemini model not found or not supported. Check the model name and API key."
      : error?.message || "Something went wrong while calling Gemini API.";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

// --- GET Request Handler (for listing models) ---
export async function GET(req: NextRequest) {
  try {
    const modelsResponse = await genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const models = await modelsResponse
      .generateContent("List all available models and their supported generation methods.")
      .then((response: any) => response.text());

    const availableModels = models
      .filter((model: any) => model.supportedGenerationMethods?.includes("generateContent"))
      .map((model: any) => ({
        name: model.name,
        displayName: model.displayName,
        description: model.description,
        supportedGenerationMethods: model.supportedGenerationMethods,
      }));

    return NextResponse.json({ availableModels });
  } catch (error: any) {
    console.error("Error listing Gemini models:", error);
    return NextResponse.json({ error: `Failed to list models: ${error.message}` }, { status: 500 });
  }
}
