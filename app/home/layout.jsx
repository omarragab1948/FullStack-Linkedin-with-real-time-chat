"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";

export default function Layout({ children }) {
  const user = useSelector((state) => state.auth);
  const mode = user?.user?.user?.mode;

  useEffect(() => {
    // Update the body background color after the initial render
    if (mode === "dark") {
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.style.backgroundColor = "#ffffff";
    }
  }, [mode]);

  return (
    <div className={`w-full ${mode} relative`}>
      <Header />
      {children}
    </div>
  );
}
