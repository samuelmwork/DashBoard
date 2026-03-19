"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight, CheckCircle, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Project, ProjectStage } from "@/lib/data";
import { Button, Modal, Input, Textarea, Select, EmptyState } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

const stages: { stage: ProjectStage; label: string; color: string; dot: string }[] = [
  { stage: "Upcoming",  label: "Upcoming",  color: "#3B82F6", dot: "bg-blue-400" },
  { stage: "Active",    label: "Active",    color: "#F97316", dot: "bg-orange-400" },
  { stage: "Completed", label: "Completed", color: "#22C55E", dot: "bg-green-400" },
];

function AddProjectModal({ open, onClose, onRefresh }: { open: boolean; onClose: () => void; onRefresh: () => void }) {
  const [form, setForm] = useState({ clientName: "", service: "", budget: "", description: "", stage: "Upcoming" as ProjectStage });

  const handleSubmit = async () => {
    if (!form.clientName || !form.service) return;
    
    await supabase.from('projects').insert([
      {
        client_name: form.clientName,
        service: form.service,
        budget: Number(form.budget) || 0,
        description: form.description,
        status: form.stage.toLowerCase()
      }
    ]);

    onRefresh();
    onClose();
    setForm({ clientName: "", service: "", budget: "", description: "", stage: "Upcoming" });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Project">
      <div className="space-y-3">
        <Input label="Client Name *" placeholder="Client Co." value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
        <Input label="Service *" placeholder="Web App Development" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
        <Input label="Budget (₹)" type="number" placeholder="100000" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
        <Textarea label="Description" placeholder="Project details..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Select label="Stage" options={stages.map(s => ({ value: s.stage, label: s.label }))} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as ProjectStage })} />
        <div className="flex gap-2 pt-1">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit}>Add Project</Button>
        </div>
      </div>
    </Modal>
  );
}

function ProjectCard({ project, onRefresh }: { project: Project; onRefresh: () => void }) {
  const [priceInput, setPriceInput] = useState(project.finalPrice ? String(project.finalPrice) : "");
  const [editingPrice, setEditingPrice] = useState(false);

  // Sync input with prop when database updates
  useEffect(() => {
    setPriceInput(project.finalPrice ? String(project.finalPrice) : "");
  }, [project.finalPrice]);
  
  const moveProject = async (newStage: ProjectStage) => {
    console.log('moveProject called:', { projectId: project.id, newStage, hasCompletedAt: !!project.completed_at, hasFinalPrice: !!project.finalPrice });
    
    const updateData: any = { status: newStage.toLowerCase() };
    
    // PERFECTED: Use created_at instead of non-existent completed_at
    if (newStage === "Completed") {
      updateData.completed_at = new Date().toISOString();
    }

    console.log('Update payload:', updateData);
    
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', project.id)
      .select();

    console.log('Supabase response:', { data, error });
    
    if (error) {
      console.error("Error moving project:", error);
      alert(`Update failed: ${error.message}`);
      
      // FINAL FALLBACK - status only
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('projects')
        .update({ status: newStage.toLowerCase() })
        .eq('id', project.id)
        .select();
        
      console.log('Fallback status-only update:', { fallbackData, fallbackError });
      
      if (fallbackError) {
        console.error('Even fallback failed:', fallbackError);
        return;
      }
    } else {
      console.log("✅ Project updated successfully");
    }
    
    // Step 8 (from previous): Immediately refresh UI
    onRefresh();
  };

  const updateFinalPrice = async (input: string | number) => {
    // Advanced Parsing: handle k, K, m, M suffixes
    let str = String(input).toLowerCase().replace(/,/g, '');
    let multiplier = 1;

    if (str.includes('k')) {
      multiplier = 1000;
      str = str.replace('k', '');
    } else if (str.includes('l')) { // handle Lakhs for Indian context
      multiplier = 100000;
      str = str.replace('l', '');
    } else if (str.includes('m')) {
      multiplier = 1000000;
      str = str.replace('m', '');
    }

    const sanitizedStr = str.replace(/[^\d.]/g, '');
    const priceVal = parseFloat(sanitizedStr);
    const finalPriceVal = isNaN(priceVal) ? 0 : Math.round(priceVal * multiplier);
    
    console.log(`Updating Project ${project.id}: input="${input}", final=${finalPriceVal}`);
    
    const { data, error } = await supabase
      .from('projects')
      .update({ final_price: finalPriceVal })
      .eq('id', project.id)
      .select();
    
    if (error) {
      console.error("Error updating final price:", error);
      return;
    }
    console.log("Update successful. Server response:", data);
    onRefresh();
  };

  const deleteProject = async () => {
    const { error } = await supabase.from('projects').delete().eq('id', project.id);
    if (error) {
      console.error("Error deleting project:", error);
      return;
    }
    onRefresh();
  };

  const stage = project.stage;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
      transition={{ duration: 0.2 }}
      className="bg-[#111111] border border-[#262626] hover:border-[#3B82F6]/30 rounded-xl p-4 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{project.clientName}</p>
          <p className="text-[#52525B] text-xs mt-0.5">{project.service}</p>
        </div>
        <button onClick={() => deleteProject()} className="w-6 h-6 flex items-center justify-center rounded-md text-[#52525B] hover:text-[#EF4444] hover:bg-[#1A1A1A] transition-colors shrink-0 ml-2">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {project.description && (
        <p className="text-[#52525B] text-xs leading-relaxed mb-3 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-3 h-3 text-[#52525B]" />
        <span className="text-[#A1A1AA] text-xs">Budget:</span>
        <span className="text-white text-xs font-medium">{formatCurrency(project.budget)}</span>
        {project.finalPrice && project.finalPrice !== project.budget && (
          <>
            <span className="text-[#52525B] text-xs">→</span>
            <span className="text-[#22C55E] text-xs font-medium">{formatCurrency(project.finalPrice)}</span>
          </>
        )}
      </div>

      {/* Revenue Control Logic */}
      <div className="mb-3">
        {stage === "Active" ? (
          editingPrice ? (
            <div className="flex gap-1.5">
              <input
                autoFocus
                className="flex-1 bg-[#0A0A0A] border border-[#3B82F6] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                placeholder="Final price..."
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { updateFinalPrice(priceInput); setEditingPrice(false); }
                  if (e.key === "Escape") setEditingPrice(false);
                }}
              />
              <button 
                onClick={() => { updateFinalPrice(priceInput); setEditingPrice(false); }} 
                className="px-2 py-1.5 bg-[#3B82F6] text-white text-xs rounded-lg hover:bg-[#2563EB] transition-colors"
              >
                Set
              </button>
            </div>
          ) : (
            <button onClick={() => setEditingPrice(true)} className="text-[#3B82F6] text-xs hover:underline transition-colors flex items-center gap-1 font-medium">
              <Plus className="w-3 h-3" /> {project.finalPrice ? "Edit" : "Set"} final price
            </button>
          )
        ) : stage === "Completed" ? (
          <div className="flex items-center gap-2 py-1.5 px-2.5 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg">
            <DollarSign className="w-3 h-3 text-[#22C55E]" />
            <span className="text-[#A1A1AA] text-xs">Final Price:</span>
            <span className="text-white text-xs font-bold">{formatCurrency(project.finalPrice || 0)}</span>
          </div>
        ) : null}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1.5 pt-3 border-t border-[#1A1A1A]">
        {stage === "Upcoming" && (
          <button onClick={() => moveProject("Active")} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-[#F97316] border border-[#F97316]/30 rounded-lg hover:bg-[#F97316]/10 transition-colors">
            <ArrowRight className="w-3 h-3" /> Move Active
          </button>
        )}
        {stage === "Active" && (
          <button 
            onClick={() => {
              console.log('Complete button clicked:', project.id, 'finalPrice:', project.finalPrice);
              if (!project.finalPrice || project.finalPrice === 0) {
                alert("Set final price before completing project");
                return;
              }
              moveProject("Completed");
            }} 
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
              !project.finalPrice || project.finalPrice === 0
                ? "text-[#52525B] border-[#262626] opacity-50 cursor-not-allowed" 
                : "text-[#22C55E] border-[#22C55E]/30 hover:bg-[#22C55E]/10"
            }`}
          >
            <CheckCircle className="w-3 h-3" /> Complete
          </button>
        )}
        {stage === "Completed" && (
          <div className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-[#22C55E] bg-[#22C55E]/5 border border-[#22C55E]/10 rounded-lg">
            <CheckCircle className="w-3 h-3" /> Done
          </div>
        )}
      </div>
    </motion.div>
  );
}

function KanbanColumn({ stage, label, color, dot, projects, onRefresh }: { stage: ProjectStage; label: string; color: string; dot: string; projects: Project[]; onRefresh: () => void }) {
  const colProjects = projects.filter((p) => p.stage === stage);

  return (
    <div className="flex-1 min-w-[280px] max-w-[360px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <span className="text-white text-sm font-semibold">{label}</span>
          <span className="text-[#52525B] text-xs ml-1 bg-[#1A1A1A] px-1.5 py-0.5 rounded-md">{colProjects.length}</span>
        </div>
      </div>

      <div className="space-y-3 min-h-[200px]">
        <AnimatePresence>
          {colProjects.length === 0 ? (
            <div className="bg-[#111111]/50 border border-dashed border-[#262626] rounded-xl py-8 flex items-center justify-center">
              <p className="text-[#52525B] text-xs">No projects</p>
            </div>
          ) : (
            colProjects.map((project) => <ProjectCard key={project.id} project={project} onRefresh={onRefresh} />)
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) {
      console.error("Error fetching projects:", error);
      return;
    }

    const mappedProjects: Project[] = data.map((p: any) => {
      const status = p.status || "upcoming";
      return {
        id: p.id,
        clientName: p.client_name,
        service: p.service,
        budget: p.budget,
        finalPrice: p.final_price,
        description: p.description,
        stage: (status.charAt(0).toUpperCase() + status.slice(1)) as ProjectStage,
        startDate: new Date(p.created_at).toISOString().split("T")[0]
      };
    });

    setProjects(mappedProjects);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Project Pipeline</h2>
          <p className="text-[#52525B] text-sm mt-0.5">{projects.length} total projects</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Add Project
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((s) => (
          <KanbanColumn key={s.stage} {...s} projects={projects} onRefresh={fetchProjects} />
        ))}
      </div>

      <AddProjectModal open={addOpen} onClose={() => setAddOpen(false)} onRefresh={fetchProjects} />
    </motion.div>
  );
}
