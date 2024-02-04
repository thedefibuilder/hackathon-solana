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
    /* IT IS TOO EARLY TO UPDATE THE ACCOUNT, AT THIS POINT IT IS NOT YET INSERTED IN THE DB
    signIn: async ({ user, account, profile }) => {
      if (user && account && profile) {
        const _account = await db.account.findFirst({
          where: {
            userId: user.id
          }
        });
        console.log('_account', _account);

        if (!_account?.username) {
          console.log('UPDATING WAIIII');
          await db.account.update({
            where: {
              id: _account?.id
            },
            data: {
              username: profile.name
            }
          });
        }
      }

      return true;
    }, */

    /* IT NEVER GETS CALLED
    jwt: async ({ user, account, profile, token }) => {
      if (user && account && profile) {
        const _account = await db.account.findFirst({
          where: {
            userId: user.id
          }
        });
        console.log('_account', _account);

        if (!_account?.username) {
          console.log('UPDATING WAIIII');
          await db.account.update({
            where: {
              id: _account?.id
            },
            data: {
              username: profile.name
            }
          });
        }
      }

      return token;
    }, */
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
          scope: 'read:user,user:email,public_repo'
        }
      }
    })
  ]
};

export const getServerAuthSession = () => getServerSession(authOptions);
