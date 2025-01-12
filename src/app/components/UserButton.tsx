"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
// import { useEffect } from "react";

function getFirstTwoCapitalLetters(str?: string | null) {
  const match = (str || "").match(/[A-Z]/g);
  return match ? match.slice(0, 2).join("") : "GT";
}

export default function UserButton({
  onSignIn,
  onSignOut,
}: {
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const { data: session, status } = useSession();

  // console.log("Session and Status:", { session, status });
  // useEffect(() => {
  //   if (status === "authenticated" && session?.user?.name) {
  //     console.log("Authenticated user's name: ", session.user.name);
  //   }
  // }, [session, status]);

  return (
    <div>
      {status === "authenticated" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              {session?.user?.image ? (
                <AvatarImage src={session.user.image} />
              ) : (
                <AvatarFallback>
                  {getFirstTwoCapitalLetters(session?.user?.name)}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                onSignOut();
              }}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {status === "unauthenticated" && (
        <Button onClick={() => onSignIn()}>Sign in</Button>
      )}
    </div>
  );
}