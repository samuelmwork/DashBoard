import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Freelance OS · Dashboard",
  description: "Premium freelance management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0A0A0A] text-white font-sans">
        <StoreProvider>
          <Sidebar />
          <Topbar />
          <main className="ml-[220px] pt-14 min-h-screen">
            <div className="p-6 lg:p-8">
              {children}
            </div>
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
