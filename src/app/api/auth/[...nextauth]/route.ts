import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { Profile } from "next-auth";

interface GitHubProfile extends Profile {
    login: string;
}

export const authOptions: AuthOptions = {
    callbacks: {
        async signIn({ profile }) {
            const gitHubProfile = profile as GitHubProfile;
            return gitHubProfile?.login === "deanmiranda";
        },
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
    ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };