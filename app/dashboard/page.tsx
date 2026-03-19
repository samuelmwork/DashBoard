"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, FolderOpen, CheckCircle2, DollarSign, ArrowRight, Plus, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Lead, Project, mockRevenue } from "@/lib/data";
import { KpiCard, Card, SectionHeader, StatusBadge } from "@/components/ui";
// import { RevenueAreaChart } from "@/components/charts/RevenueChart";
import { formatCurrency, statusConfig } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchData = async () => {
    // Fetch Leads
    const { data: leadsData } = await supabase
      .from('Leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (leadsData) {
      setLeads(leadsData.map((l: any) => {
        const status = l.status || "New";
        return {
          id: l.id,
          name: l.name,
          phone: l.phone || "",
          service: l.service,
          budget: l.budget,
          status: (status.charAt(0).toUpperCase() + status.slice(1)) as any,
          createdAt: l.created_at,
          timeline: l.timeline || ""
        };
      }));
    }

    // Fetch Projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*');
    
    if (projectsError) {
      console.error("DASHBOARD - PROJECTS FETCH ERROR:", projectsError);
    }

    if (projectsData) {
      console.log("DASHBOARD - RAW PROJECTS FROM SUPABASE:", projectsData);
      setProjects(projectsData.map((p: any) => {
        const status = p.status || "upcoming";
        return {
          id: p.id,
          clientName: p.client_name,
          service: p.service,
          budget: p.budget,
          finalPrice: p.final_price,
          description: p.description || "",
          stage: (status.charAt(0).toUpperCase() + status.slice(1)) as any,
          startDate: p.created_at,
          created_at: p.created_at, // for raw access
          status: p.status, // for raw access
          final_price: p.final_price, // for raw access
          completed_at: p.completed_at
        };
      }));
    } else {
      console.warn("DASHBOARD - NO PROJECTS DATA RETURNED");
    }
  };

  useEffect(() => {
    fetchData();

    const projectsChannel = supabase
      .channel("dashboard-projects-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => fetchData()
      )
      .subscribe();

    const leadsChannel = supabase
      .channel("dashboard-leads-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Leads" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(leadsChannel);
    };
  }, []);

  // Step 1: Verify data fetching (Log full data)
  console.log("DASHBOARD - PROJECT DATA:", projects);
  console.log("STATUS VALUES:", projects.map((p: any) => p.status));
  console.log("FINAL PRICES:", projects.map((p: any) => p.final_price));
  console.log("COMPLETED_AT:", projects.map((p: any) => p.completed_at));

  // Step 3: Temporary Debug (All completed projects)
  // Include 'archived' in completedProjects for persistent revenue
  const completedProjects = projects.filter((p: any) => p.status === "completed" || p.status === "archived");
  const activeProjects = projects.filter((p: any) => p.status === "active");

  console.log("Step 3 - Completed Projects count:", completedProjects.length);

  // Step 4: Fix Year Filter (Per user instruction: only valid if completed_at exists)
  const currentYear = new Date().getFullYear();
  const validProjectsForChart = completedProjects.filter((p: any) => {
    if (!p.completed_at) return false;
    const d = new Date(p.completed_at);
    return d.getFullYear() === currentYear;
  });

  console.log("Step 4 - Valid Projects for Chart:", validProjectsForChart);

  // Step 5: Fix Month Mapping (Fixed Jan to Dec)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueData = months.map((month) => ({ month, revenue: 0, deals: 0 }));

  validProjectsForChart.forEach((p: any) => {
    const d = new Date(p.completed_at!);
    const monthIndex = d.getMonth();
    revenueData[monthIndex].revenue += (Number(p.final_price) || 0);
    revenueData[monthIndex].deals += 1;
  });

  console.log("Step 5 - Monthly Revenue Array:", revenueData);

  // Step 6: Fix Total Revenue & Counts
  // SENIOR DECISION: Use all completed projects for KPIs to ensure immediate visibility,
  // while keeping the chart strict to completed_at as per user instruction.
  const totalRevenue = completedProjects.reduce((sum, p: any) => sum + (Number(p.final_price) || 0), 0);
  
  const activeCount = activeProjects.length;
  const completedCount = completedProjects.length;
  const totalLeads = leads.length;

  console.log("Step 6 - Total Revenue (incl. fallback):", totalRevenue);

  const recentLeads = leads.slice(0, 5);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Leads" value={totalLeads} sub={`${leads.filter(l => l.status === "New").length} new`} icon={<Users className="w-4 h-4" />} accent="#3B82F6" delay={0} />
        <KpiCard title="Active Projects" value={activeCount} sub="In progress" icon={<FolderOpen className="w-4 h-4" />} accent="#F97316" delay={0.05} />
        <KpiCard title="Completed" value={completedCount} sub="All time" icon={<CheckCircle2 className="w-4 h-4" />} accent="#22C55E" delay={0.1} />
        <KpiCard title="Total Revenue" value={formatCurrency(totalRevenue)} sub="From completed" icon={<DollarSign className="w-4 h-4" />} accent="#3B82F6" delay={0.15} />
      </motion.div>

      {/* Middle Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Leads */}
        <Card className="lg:col-span-2">
          <SectionHeader
            title="Recent Leads"
            subtitle="Latest incoming enquiries"
            action={
              <Link href="/leads">
                <motion.span whileHover={{ x: 2 }} className="inline-flex items-center gap-1 text-[#3B82F6] text-xs font-medium hover:opacity-80 transition-opacity cursor-pointer">
                  View all <ArrowRight className="w-3 h-3" />
                </motion.span>
              </Link>
            }
          />
          <div className="space-y-0.5">
            {recentLeads.map((lead, i) => {
              const sc = statusConfig[lead.status];
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.2 }}
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-[#1A1A1A] transition-colors group cursor-default"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0 text-[#A1A1AA] text-xs font-semibold">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{lead.name}</p>
                      <p className="text-[#52525B] text-xs truncate">{lead.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4 shrink-0">
                    <span className="text-[#A1A1AA] text-xs hidden sm:block">{formatCurrency(lead.budget)}</span>
                    <StatusBadge {...sc} />
                    <span className="text-[#52525B] text-xs hidden md:block">{lead.timeline}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <SectionHeader title="Quick Actions" subtitle="Shortcuts" />
          <div className="space-y-2">
            {[
              { label: "View All Leads", href: "/leads", icon: Users, color: "#3B82F6" },
              { label: "View Projects", href: "/projects", icon: FolderOpen, color: "#F97316" },
{ label: "Projects Pipeline", href: "/projects", icon: TrendingUp, color: "#22C55E" },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#262626] hover:bg-[#1A1A1A] hover:border-[#3B82F6]/30 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-[#A1A1AA] text-sm group-hover:text-white transition-colors font-medium">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#52525B] ml-auto group-hover:text-[#3B82F6] transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#262626]">
            <p className="text-[#52525B] text-xs font-medium uppercase tracking-widest mb-2">Pipeline</p>
            <div className="space-y-2">
              {(["Upcoming", "Active", "Completed"] as const).map((stage) => {
                const count = projects.filter((p) => p.stage === stage).length;
                const pct = projects.length ? (count / projects.length) * 100 : 0;
                const colors: Record<string, string> = { Upcoming: "#3B82F6", Active: "#F97316", Completed: "#22C55E" };
                return (
                  <div key={stage}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#A1A1AA]">{stage}</span>
                      <span className="text-[#52525B]">{count}</span>
                    </div>
                    <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: colors[stage] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Revenue Graph */}
      <motion.div variants={itemVariants}>
        <Card>
          <SectionHeader
            title="Revenue Overview"
            subtitle="Actual earnings from Supabase"
            action={
            <Link href="/projects">
              <motion.span whileHover={{ x: 2 }} className="inline-flex items-center gap-1 text-[#3B82F6] text-xs font-medium hover:opacity-80 cursor-pointer">
                View projects <ArrowRight className="w-3 h-3" />
              </motion.span>
            </Link>
            }
          />
          {/* Revenue chart removed with Finance */}
        </Card>
      </motion.div>
    </motion.div>
  );
}
