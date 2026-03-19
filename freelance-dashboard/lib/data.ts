// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadStatus = "New" | "Contacted" | "Negotiation" | "Converted" | "Rejected";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  service: string;
  budget: number;
  timeline: string;
  status: LeadStatus;
  createdAt: string;
  notes?: string;
}

export type ProjectStage = "Upcoming" | "Active" | "Completed";

export interface Project {
  id: string | number;
  clientName: string;
  service: string;
  budget: any;
  finalPrice?: number | null;
  description: string;
  stage: ProjectStage;
  startDate: string;
  endDate?: string;
  // Raw Supabase fields
  status?: string;
  final_price?: any;
  created_at?: string | null;
  completed_at?: string | null;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  deals: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockLeads: Lead[] = [
  { id: "l1", name: "Aryan Mehta", phone: "+91 98765 43210", service: "Web App Development", budget: 120000, timeline: "3 months", status: "Negotiation", createdAt: "2024-06-01", notes: "Looking for a SaaS dashboard." },
  { id: "l2", name: "Priya Sharma", phone: "+91 99001 12345", service: "Mobile App", budget: 85000, timeline: "2 months", status: "Contacted", createdAt: "2024-06-03", notes: "React Native preferred." },
  { id: "l3", name: "Carlos Rivera", phone: "+1 555 867 5309", service: "E-Commerce Site", budget: 45000, timeline: "6 weeks", status: "New", createdAt: "2024-06-05" },
  { id: "l4", name: "Fatima Al-Hassan", phone: "+971 50 123 4567", service: "API Integration", budget: 30000, timeline: "1 month", status: "Converted", createdAt: "2024-05-20" },
  { id: "l5", name: "James Wu", phone: "+1 415 900 1234", service: "UI/UX Design", budget: 55000, timeline: "5 weeks", status: "Rejected", createdAt: "2024-05-15" },
  { id: "l6", name: "Sofia Andersen", phone: "+45 23 45 67 89", service: "Web App Development", budget: 95000, timeline: "10 weeks", status: "Contacted", createdAt: "2024-06-07" },
  { id: "l7", name: "Ravi Patel", phone: "+91 91234 56789", service: "SEO + Content", budget: 20000, timeline: "Ongoing", status: "New", createdAt: "2024-06-08" },
  { id: "l8", name: "Emily Turner", phone: "+44 7700 900123", service: "Full-Stack Build", budget: 150000, timeline: "4 months", status: "Negotiation", createdAt: "2024-06-09" },
];

export const mockProjects: Project[] = [
  { id: "p1", clientName: "Fatima Al-Hassan", service: "API Integration", budget: 30000, finalPrice: 32000, description: "REST API integration with third-party payment gateway and CRM sync.", stage: "Completed", startDate: "2024-05-20", endDate: "2024-06-15" },
  { id: "p2", clientName: "Aryan Mehta", service: "Web App Development", budget: 120000, description: "Full SaaS dashboard with analytics, billing, and user management.", stage: "Active", startDate: "2024-06-10" },
  { id: "p3", clientName: "Sofia Andersen", service: "Web App Development", budget: 95000, description: "Corporate web application with custom CMS and multi-language support.", stage: "Active", startDate: "2024-06-12" },
  { id: "p4", clientName: "Emily Turner", service: "Full-Stack Build", budget: 150000, description: "End-to-end marketplace platform with vendor dashboard and analytics.", stage: "Upcoming", startDate: "2024-07-01" },
  { id: "p5", clientName: "New Client – TBD", service: "Mobile App", budget: 75000, description: "React Native app for iOS and Android. Onboarding pending.", stage: "Upcoming", startDate: "2024-07-15" },
  { id: "p6", clientName: "Priya Sharma", service: "Mobile App", budget: 85000, finalPrice: 88000, description: "Ride-sharing app MVP with driver/rider flows.", stage: "Completed", startDate: "2024-04-01", endDate: "2024-06-01" },
];

export const mockRevenue: MonthlyRevenue[] = [
  // ... existing array unchanged, now exported for fallback use
  { month: "Jan", revenue: 42000, deals: 2 },
  { month: "Feb", revenue: 58000, deals: 3 },
  { month: "Mar", revenue: 35000, deals: 2 },
  { month: "Apr", revenue: 88000, deals: 4 },
  { month: "May", revenue: 120000, deals: 5 },
  { month: "Jun", revenue: 95000, deals: 4 },
  { month: "Jul", revenue: 0, deals: 0 },
  { month: "Aug", revenue: 0, deals: 0 },
  { month: "Sep", revenue: 0, deals: 0 },
  { month: "Oct", revenue: 0, deals: 0 },
  { month: "Nov", revenue: 0, deals: 0 },
  { month: "Dec", revenue: 0, deals: 0 },
];
