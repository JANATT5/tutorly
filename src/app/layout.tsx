import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import ChatWidget from "@/components/chat/ChatWidget";
import { fontVariables } from "@/fonts";
import { ROLE_COOKIE, parseRoleCookie } from "@/lib/session";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the role cookie server-side and pass it down, rather than
  // having Navbar (a Client Component) read document.cookie itself.
  // document doesn't exist during server-side rendering, so that
  // approach always rendered the logged-out state in the initial HTML
  // regardless of the actual cookie — and would hit a hydration
  // mismatch once client-side JS caught up and re-read it correctly.
  const cookieStore = await cookies();
  const initialRole = parseRoleCookie(cookieStore.get(ROLE_COOKIE)?.value);

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <QueryProvider>
          <Navbar initialRole={initialRole} />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </QueryProvider>
      </body>
    </html>
  );
}