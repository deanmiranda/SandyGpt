"use server";
import OpenAI from "openai";
import { auth as getServerSession } from "@/auth";
import { createChat, updateChat } from "@/db";


if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length === 0) {
    throw new Error(
        `OpenAI API key is missing or empty in environment: ${process.env.OPENAI_API_KEY}`
    );
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getCompletion(
  id: number | null,
  messageHistory: {
    role: "user" | "assistant";
    content: string;
  }[]
):Promise<{messages: any[], id: number}> {
  const session = await getServerSession();
  const userEmail = session?.user?.email || null;

  console.log("Session user email:", session);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messageHistory.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  const messages = [
    ...messageHistory,
    response.choices[0].message as unknown as {
      role: "user" | "assistant";
      content: string;
    },
  ];

  let chatId = id;
  if (!chatId) {
    chatId = await createChat(
      userEmail,
      messageHistory[0]?.content || "New Chat",
      messages
    );
  } else {
    await updateChat(chatId, messages);
  }
  return {
    messages,
    id: chatId,
  };
}