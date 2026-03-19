"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FolderKanban, DollarSign, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads",     label: "Leads",     icon: Users },
  { href: "/projects",  label: "Projects",  icon: FolderKanban },
  // { href: "/finance",   label: "Finance",   icon: DollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-[#000000] border-r border-[#262626] flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#262626]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-blue flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-[15px] tracking-tight">Freelance OS</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer group",
                  active
                    ? "bg-[#111111] text-white"
                    : "text-[#A1A1AA] hover:bg-[#1A1A1A] hover:text-white"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-blue rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon className={cn("w-4 h-4 shrink-0", active ? "text-accent-blue" : "text-[#52525B] group-hover:text-[#A1A1AA]")} strokeWidth={active ? 2.5 : 2} />
                {label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#262626]">
        <p className="text-[#52525B] text-xs">v1.0.0 · Freelance OS</p>
      </div>
    </aside>
  );
}
