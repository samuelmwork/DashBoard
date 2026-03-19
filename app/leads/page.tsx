"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, Eye, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Lead, LeadStatus } from "@/lib/data";
import { Button, Modal, Input, Select, Textarea, StatusBadge } from "@/components/ui";
import { formatCurrency, statusConfig } from "@/lib/utils";

const statusOptions = Object.keys(statusConfig).map((k) => ({ value: k, label: k }));
const allStatuses = ["All", ...Object.keys(statusConfig)] as const;

function AddLeadModal({ open, onClose, onRefresh }: { open: boolean; onClose: () => void; onRefresh: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", service: "", budget: "", timeline: "", status: "New" as LeadStatus, notes: "" });

  const handleSubmit = async () => {
    if (!form.name || !form.service) return;
    
    await supabase.from('Leads').insert([
      {
        name: form.name,
        phone: form.phone,
        service: form.service,
        budget: Number(form.budget) || 0,
        timeline: form.timeline,
        status: form.status.toLowerCase(),
        notes: form.notes
      }
    ]);

    onRefresh();
    onClose();
    setForm({ name: "", phone: "", service: "", budget: "", timeline: "", status: "New", notes: "" });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Lead">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Full Name *" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" placeholder="+91 98765..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <Input label="Service *" placeholder="Web Development, Mobile App..." value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Budget (₹)" type="number" placeholder="50000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          <Input label="Timeline" placeholder="2 months" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} />
        </div>
        <Select label="Status" options={statusOptions} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })} />
        <Textarea label="Notes" placeholder="Additional notes..." rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <div className="flex gap-2 pt-1">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit}>Add Lead</Button>
        </div>
      </div>
    </Modal>
  );
}

function LeadDetailModal({ lead, open, onClose, onRefresh }: { lead: Lead | null; open: boolean; onClose: () => void; onRefresh: () => void }) {
  if (!lead) return null;

  const updateStatus = async (status: LeadStatus) => {
    await supabase
      .from('Leads')
      .update({ status: status.toLowerCase() })
      .eq('id', lead.id);
    onRefresh();
  };

  const convertToProject = async () => {
    if (!lead) return;

    // 1. Insert into projects
    await supabase.from('projects').insert([
      {
        client_name: lead.name,
        service: lead.service,
        budget: lead.budget,
        description: lead.notes || lead.service,
        status: 'upcoming'
      }
    ]);

    // 2. Update lead status to 'converted'
    await supabase
      .from('Leads')
      .update({ status: 'converted' })
      .eq('id', lead.id);

    onRefresh();
    onClose();
  };

  const sc = statusConfig[lead.status];
  return (
    <Modal open={open} onClose={onClose} title="Lead Details">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-white text-lg font-bold">{lead.name.charAt(0)}</div>
          <div>
            <p className="text-white font-semibold">{lead.name}</p>
            <p className="text-[#52525B] text-sm">{lead.phone}</p>
          </div>
          <StatusBadge {...sc} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[["Service", lead.service], ["Budget", formatCurrency(lead.budget)], ["Timeline", lead.timeline], ["Added", lead.createdAt]].map(([k, v]) => (
            <div key={k} className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-3">
              <p className="text-[#52525B] text-xs mb-0.5">{k}</p>
              <p className="text-white text-sm font-medium">{v}</p>
            </div>
          ))}
        </div>
        {lead.notes && (
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-3">
            <p className="text-[#52525B] text-xs mb-0.5">Notes</p>
            <p className="text-[#A1A1AA] text-sm">{lead.notes}</p>
          </div>
        )}
        <Select
          label="Update Status"
          options={statusOptions}
          value={lead.status}
          onChange={(e) => updateStatus(e.target.value as LeadStatus)}
        />
        {lead.status !== "Converted" && (
          <Button variant="primary" className="w-full" onClick={convertToProject}>
            Convert to Project
          </Button>
        )}
      </div>
    </Modal>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [detail, setDetail] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('Leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
      return;
    }

    const mappedLeads: Lead[] = data.map((l: any) => {
      const status = l.status || "new";
      return {
        id: l.id,
        name: l.name,
        phone: l.phone,
        service: l.service,
        budget: l.budget,
        timeline: l.timeline,
        status: (status.charAt(0).toUpperCase() + status.slice(1)) as LeadStatus,
        createdAt: new Date(l.created_at).toISOString().split("T")[0],
        notes: l.notes
      };
    });

    setLeads(mappedLeads);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const deleteLead = async (id: string) => {
    await supabase.from('Leads').delete().eq('id', id);
    fetchLeads();
  };

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.service.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || l.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">All Leads</h2>
          <p className="text-[#52525B] text-sm mt-0.5">{leads.length} total · {leads.filter(l => l.status === "New").length} new</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52525B]" />
          <input
            className="w-full bg-[#111111] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#52525B] outline-none focus:border-[#3B82F6] transition-colors"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s ? "bg-[#3B82F6] text-white" : "bg-[#111111] border border-[#262626] text-[#A1A1AA] hover:bg-[#1A1A1A]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626]">
                {["Name", "Phone", "Service", "Budget", "Timeline", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[#52525B] text-xs font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[#52525B] text-sm">No leads found</td>
                  </tr>
                ) : (
                  filtered.map((lead, i) => {
                    const sc = statusConfig[lead.status];
                    return (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-[#1A1A1A] hover:bg-[#111111] transition-colors group"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-xs text-[#A1A1AA] font-medium shrink-0">
                              {lead.name.charAt(0)}
                            </div>
                            <span className="text-white text-sm font-medium whitespace-nowrap">{lead.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[#A1A1AA] text-sm whitespace-nowrap">{lead.phone}</td>
                        <td className="px-4 py-3.5 text-[#A1A1AA] text-sm whitespace-nowrap">{lead.service}</td>
                        <td className="px-4 py-3.5 text-white text-sm font-medium whitespace-nowrap">{formatCurrency(lead.budget)}</td>
                        <td className="px-4 py-3.5 text-[#A1A1AA] text-sm whitespace-nowrap">{lead.timeline}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge {...sc} /></td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setDetail(lead)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#52525B] hover:text-[#3B82F6] hover:bg-[#1A1A1A] transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteLead(lead.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#52525B] hover:text-[#EF4444] hover:bg-[#1A1A1A] transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} onRefresh={fetchLeads} />
      <LeadDetailModal lead={detail} open={!!detail} onClose={() => setDetail(null)} onRefresh={fetchLeads} />
    </motion.div>
  );
}
