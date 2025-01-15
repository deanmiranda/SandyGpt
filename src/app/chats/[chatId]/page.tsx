import { redirect, notFound } from "next/navigation";
import { auth as getServerSession } from "@/auth";

import Chat from "@/app/components/Chat";

import { getChat } from "@/db";

export const dynamic = "force-dynamic";

export default async function ChatDetail({
    params,
}: {
    params: { chatId: string }
}) {
    const { chatId } = await params;
    const chat = await getChat(+chatId);
    
    // Reroutes nonexisting chats
    if (!chat) {
        return notFound();
    }

    const session = await getServerSession();
    // Only check if logged-in user owns this chat
    if (session?.user?.username && chat.username !== session.user.username) {
        return redirect("/");
    }

    return (
        <main className="pt-5">
            <Chat id={+chatId} messages={chat?.messages || []} key={chatId} />
        </main>
    );
}
