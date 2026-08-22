import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        <Footer />
      </body>
    </html>
  );
}
