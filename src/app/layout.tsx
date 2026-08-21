import Navbar from "@/components/Navbar";
import { fontVariables } from "@/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
