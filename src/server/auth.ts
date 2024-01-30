import type { DefaultSession, NextAuthOptions } from 'next-auth';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getServerSession } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

import { env } from '@/env';
import { db } from '@/server/db';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id
      }
    })
  },
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_PROVIDER_CLIENT_ID,
      clientSecret: env.GITHUB_PROVIDER_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user,user:email,repo'
        }
      }
    })
  ]
};

export const getServerAuthSession = () => getServerSession(authOptions);
