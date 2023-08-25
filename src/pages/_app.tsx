import '@/styles/globals.css'
import { SessionProvider, getSession } from 'next-auth/react';
import type { AppProps } from 'next/app'
import { createContext, useEffect, useState } from 'react';

export type UserToken = {
  id: string;
  username: string;
  name: string;
}

export const UserContext = createContext<UserToken | undefined>(undefined);


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [user, setUser] = useState<UserToken | undefined>();

  useEffect(() => {
    getSession()
      .then((session) => {
        setUser(session?.user);
      })
      .catch((err) => {
        alert("Error al autenticar");
      });
  }, []);

  return (
    <SessionProvider session={session}>
      <UserContext.Provider value={user}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </SessionProvider>
  );
}