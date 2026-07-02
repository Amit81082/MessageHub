import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthContext from "./context/AuthContext";
import { Inter } from "next/font/google";
import ActiveStatus from "./components/ActiveStatus";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "MessageHub",
  description: "This is a message hub. You can send and receive messages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${inter.className}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <AuthContext>
          <Toaster />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
