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

    // // TODO:  Reroutes users from trying to access a chat id that isn't theirs
    // const session = await getServerSession();
    // if (!session || chat?.user_email !== session?.user?.email) {
    //     return redirect("/");
    // }



    return (
        <main className="pt-5">
            <Chat id={+chatId} messages={chat?.messages || []} key={chatId} />
        </main>
    );
}
