export interface Chat {
    id: number;
    name: string;
    user_email: string | null;
    timestamp: Date;
}

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export interface StoredMessage extends Message {
    id: number;
    chat_id: number;
}

export interface ChatWithMessages extends Chat {
    messages: StoredMessage[];
}

export interface DatabaseChat {
    id: number;
    name: string;
    user_email: string | null;
    timestamp: string;
  }
  
  export interface DatabaseMessage {
    id: number;
    chat_id: number;
    role: string;
    content: string;
  }
  