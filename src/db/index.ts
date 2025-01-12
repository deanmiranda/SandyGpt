import { neon } from "@neondatabase/serverless";

import type { Chat, ChatWithMessages, Message } from "../types";

// Initialize the Neon database connection
const sql = neon(`${process.env.NEON_SANDY_GPT_DATABASE_URL}`);

// export async function getChat(chatId: number): Promise<ChatWithMessages | null> {
//   const { rows: chats } = await sql`SELECT * FROM chats WHERE id = ${chatId}`;
//   if (!chats[0]) {
//     return null;
//   }

//   const { rows: messages } = await sql`SELECT * FROM messages WHERE chat_id = ${chatId}`;
//   return {
//     ...chats[0],
//     messages: messages.map((msg) => ({
//       ...msg,
//       role: msg.role as "user" | "assistant",
//       content: msg.content,
//     })),
//   } as ChatWithMessages;
// }

// export async function getChats(userEmail: string): Promise<Chat[]> {
//   const { rows: chats } = await sql`SELECT * FROM chats WHERE user_email = ${userEmail}`;
//   return chats as Chat[];
// }

export async function createChat(
  userEmail: string | null, 
  name: string,
  msgs: Message[]
): Promise<number> {
  // Validate that userEmail is not null or undefined
  // Insert a new chat and return the inserted chat's ID
  const chatResult = (await sql`
    INSERT INTO chats (user_email, name) 
    VALUES (${userEmail}, ${name}) RETURNING id
  `) as { id: number }[];

  // Validate that we have a valid chat ID
  if (chatResult.length === 0 || !chatResult[0]?.id) {
    throw new Error("Failed to create chat. No ID returned.");
  }

  const chatId = chatResult[0].id;

  // Insert messages for the new chat
  for (const msg of msgs) {
    await sql`INSERT INTO messages (chat_id, role, content) VALUES (${chatId}, ${msg.role}, ${msg.content})`;
  }

  return chatId;
}



// export async function getChatsWithMessages(userEmail: string): Promise<ChatWithMessages[]> {
//   const { rows: chats } = await sql`
//     SELECT * FROM chats WHERE user_email = ${userEmail} ORDER BY timestamp DESC LIMIT 3`;

//   for (const chat of chats) {
//     const { rows: messages } = await sql`SELECT * FROM messages WHERE chat_id = ${chat.id}`;
//     chat.messages = messages.map((msg) => ({
//       ...msg,
//       role: msg.role as "user" | "assistant",
//       content: msg.content,
//     }));
//   }

//   return chats as ChatWithMessages[];
// }

// export async function getMessages(chatId: number) {
//   const { rows: messages } = await sql`SELECT * FROM messages WHERE chat_id = ${chatId}`;

//   return messages.map((msg) => ({
//     ...msg,
//     role: msg.role as "user" | "assistant",
//     content: msg.content,
//   }));
// }

export async function updateChat(chatId: number, msgs: Message[]) {
  // Delete old messages for the chat
  await sql`DELETE FROM messages WHERE chat_id = ${chatId}`;

  // Insert the updated messages
  for (const msg of msgs) {
    await sql`INSERT INTO messages (chat_id, role, content) VALUES (${chatId}, ${msg.role}, ${msg.content})`;
  }
}
