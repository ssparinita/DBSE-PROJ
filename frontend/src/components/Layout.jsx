import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Layout() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient violet atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] ambient-glow-top opacity-70" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[50vh] ambient-glow opacity-40" />
        <div className="absolute top-1/3 right-0 w-[40vw] h-[40vh] ambient-glow opacity-30" />
      </div>
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}