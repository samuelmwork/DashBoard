"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, User, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Modal, Button } from "@/components/ui";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/projects": "Projects",
};

export default function Topbar() {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ?? "Dashboard";

  const handleClearAll = async () => {
    setLoading(true);
    try {
      // Delete all leads and projects
      // We use .neq('id', '0') to satisfy some Supabase configurations that require a filter for delete
      const { error: leadsError } = await supabase.from('Leads').delete().neq('id', '0');
      const { error: projectsError } = await supabase.from('projects').delete().neq('id', '0');

      if (leadsError || projectsError) {
        console.error("Error clearing data:", leadsError || projectsError);
        alert("Failed to clear some data. Check console.");
      }
    } catch (err) {
      console.error("Unexpected error during clear all:", err);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-[220px] right-0 h-14 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#262626] flex items-center justify-between px-6 z-30">
        <h1 className="text-white font-semibold text-[15px] tracking-tight">{title}</h1>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-xs font-medium border border-transparent hover:border-[#EF4444]/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
          
          <div className="h-4 w-px bg-[#262626] mx-1" />

          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#1A1A1A] transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#262626]">
            <span className="text-[#A1A1AA] text-sm">Welcome,&nbsp;<span className="text-white font-medium">Sam</span></span>
            <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-[#A1A1AA]" />
            </div>
          </div>
        </div>
      </header>

      <Modal 
        open={showConfirm} 
        onClose={() => setShowConfirm(false)} 
        title="Clear All Data?"
      >
        <div className="space-y-4">
          <p className="text-[#A1A1AA] text-sm leading-relaxed">
            This will permanently delete all <span className="text-white font-medium">Leads</span> and <span className="text-white font-medium">Projects</span> (including archived ones). This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={handleClearAll}
              loading={loading}
            >
              Clear Everything
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
