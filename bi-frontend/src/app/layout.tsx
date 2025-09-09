import type { Metadata } from "next";
import "./globals.css";
import LoadingIndicator from "@/components/widget/LoadingIndicator";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Skil Test Dev - Bisnis Indonesia",
  description: "Skil Test Dev - Bisnis Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
        <LoadingIndicator />
      </body>
    </html>
  );
}
