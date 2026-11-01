import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "⛳ なんくるナビさ - ゴルフコース管理",
  description: "Golf Course Management Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
