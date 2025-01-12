"use server"
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length === 0) {
    throw new Error(`OpenAI API key is missing or empty in environment: ${process.env.OPENAI_API_KEY}`);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function getCompletion(
    messageHistory: {
        role: "user" | "assistant";
        content: string;
    }[],
) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messageHistory,
    })

    const messages = [
        ...messageHistory,
        response.choices[0].message as unknown as {
            role: "user" | "assistant";
            content: string;
        },
    ];

    return {
        messages,
    }
}