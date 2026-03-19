"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Lead, Project, mockLeads, mockProjects, LeadStatus, ProjectStage } from "./data";

interface StoreCtx {
  leads: Lead[];
  projects: Project[];
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  deleteLead: (id: string) => void;
  addProject: (project: Project) => void;
  moveProject: (id: string, stage: ProjectStage) => void;
  updateFinalPrice: (id: string, price: number) => void;
  deleteProject: (id: string) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const addLead = (lead: Lead) => setLeads((p) => [lead, ...p]);
  const updateLeadStatus = (id: string, status: LeadStatus) =>
    setLeads((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
  const deleteLead = (id: string) => setLeads((p) => p.filter((l) => l.id !== id));

  const addProject = (project: Project) => setProjects((p) => [project, ...p]);
  const moveProject = (id: string, stage: ProjectStage) =>
    setProjects((p) => p.map((pr) => (pr.id === id ? { ...pr, stage } : pr)));
  const updateFinalPrice = (id: string, price: number) =>
    setProjects((p) => p.map((pr) => (pr.id === id ? { ...pr, finalPrice: price } : pr)));
  const deleteProject = (id: string) => setProjects((p) => p.filter((pr) => pr.id !== id));

  return (
    <StoreContext.Provider value={{ leads, projects, addLead, updateLeadStatus, deleteLead, addProject, moveProject, updateFinalPrice, deleteProject }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
