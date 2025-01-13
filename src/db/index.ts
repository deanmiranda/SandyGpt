import { neon } from "@neondatabase/serverless";

import type { Chat, ChatWithMessages, Message, StoredMessage } from "../types";

// Initialize the Neon database connection
const sql = neon(`${process.env.NEON_SANDY_GPT_DATABASE_URL}`);

export async function getChat(chatId: number): Promise<ChatWithMessages | null> {
  const chats = await sql`SELECT * FROM chats WHERE id = ${chatId}`;
  if (chats.length === 0) {
    return null;
  }  
  const chat: Chat = {
    id: chats[0].id,
    name: chats[0].name,
    user_email: chats[0].user_email,
    timestamp: new Date(chats[0].timestamp),
  };

  const messages = await sql`SELECT * FROM messages WHERE chat_id = ${chatId}`;
  const formattedMessages: StoredMessage[] = messages.map((msg) => ({
    id: msg.id,
    chat_id: msg.chat_id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));

  return {
    ...chat,
    messages: formattedMessages,
  };
}


export async function getChats(userEmail: string): Promise<Chat[]> {
  
  const chats = await sql`SELECT * FROM chats WHERE user_email = ${userEmail}`;
  return chats.map((chat) => ({
    id: chat.id,
    name: chat.name,
    user_email: chat.user_email,
    timestamp: new Date(chat.timestamp),
  })) as Chat[];
}


export async function createChat(
  userEmail: string | null,
  name: string,
  msgs: Message[]
): Promise<number> {
  const chatResult = await sql`
    INSERT INTO chats (user_email, name) 
    VALUES (${userEmail}, ${name}) RETURNING id
  `;
  // console.log("Chat Insert Result:", chatResult);

  if (!Array.isArray(chatResult) || chatResult.length === 0 || !chatResult[0]?.id) {
    throw new Error("Failed to create chat. No ID returned.");
  }

  const chatId = chatResult[0].id;

  for (const msg of msgs) {
    const messageResult = await sql`
      INSERT INTO messages (chat_id, role, content) 
      VALUES (${chatId}, ${msg.role}, ${msg.content}) RETURNING *
    `;
    // console.log("Message Insert Result:", messageResult);
  }

  return chatId;
}



export async function getChatsWithMessages(userEmail: string): Promise<ChatWithMessages[]> {
  const chats = await sql`SELECT * FROM chats WHERE user_email = ${userEmail} ORDER BY timestamp DESC LIMIT 3`;

  const chatWithMessages = await Promise.all(
    chats.map(async (chat) => {
      const messages = await sql`SELECT * FROM messages WHERE chat_id = ${chat.id}`;
      return {
        id: chat.id,
        name: chat.name,
        user_email: chat.user_email,
        timestamp: new Date(chat.timestamp),
        messages: messages.map((msg) => ({
          id: msg.id,
          chat_id: msg.chat_id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      };
    })
  );

  return chatWithMessages as ChatWithMessages[];
}

export async function getMessages(chatId: number): Promise<StoredMessage[]> {
  const messages = await sql`SELECT * FROM messages WHERE chat_id = ${chatId}`;

  return messages.map((msg) => ({
    id: msg.id,
    chat_id: msg.chat_id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));
}


export async function updateChat(chatId: number, msgs: Message[]) {
  await sql`DELETE FROM messages WHERE chat_id = ${chatId}`;

  for (const msg of msgs) {
    await sql`INSERT INTO messages (chat_id, role, content) VALUES (${chatId}, ${msg.role}, ${msg.content})`;
  }
}
