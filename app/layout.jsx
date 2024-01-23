import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./rtk/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LinkedIn",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body className={`${inter.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
