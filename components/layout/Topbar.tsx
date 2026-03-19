"use client";
import { usePathname } from "next/navigation";
import { Bell, User } from "lucide-react";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/projects": "Projects",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ?? "Dashboard";

  return (
    <header className="fixed top-0 left-[220px] right-0 h-14 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#262626] flex items-center justify-between px-6 z-30">
      <h1 className="text-white font-semibold text-[15px] tracking-tight">{title}</h1>

      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#1A1A1A] transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#262626]">
          <span className="text-[#A1A1AA] text-sm">Welcome,&nbsp;<span className="text-white font-medium">Sam</span></span>
          <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-[#A1A1AA]" />
          </div>
        </div>
      </div>
    </header>
  );
}
