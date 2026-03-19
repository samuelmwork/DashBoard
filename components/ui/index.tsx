"use client";
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Card ──────────────────────────────────────────────────────────────────────
interface CardProps { children: ReactNode; className?: string; hover?: boolean; onClick?: () => void; }
export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "bg-[#111111] border border-[#262626] rounded-xl p-5 transition-colors duration-150",
        hover && "hover:bg-[#1A1A1A] cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ─── KPI Card ──────────────────────────────────────────────────────────────────
interface KpiCardProps { title: string; value: string | number; sub?: string; icon: ReactNode; accent?: string; delay?: number; }
export function KpiCard({ title, value, sub, icon, accent = "#3B82F6", delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
      className="bg-[#111111] border border-[#262626] rounded-xl p-5 hover:bg-[#1A1A1A] transition-colors duration-150"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}18`, border: `1px solid ${accent}30` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
      </div>
      <p className="text-[#52525B] text-xs font-medium uppercase tracking-widest mb-1.5">{title}</p>
      <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-[#52525B] text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

// ─── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  size?: "sm" | "md";
  children: ReactNode;
}
export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2" };
  const variants = {
    primary:   "bg-[#3B82F6] text-white hover:bg-[#2563EB] active:scale-[0.98]",
    secondary: "bg-transparent border border-[#262626] text-[#A1A1AA] hover:bg-[#1A1A1A] hover:text-white active:scale-[0.98]",
    danger:    "bg-[#EF4444] text-white hover:bg-[#DC2626] active:scale-[0.98]",
    success:   "bg-[#22C55E] text-white hover:bg-[#16A34A] active:scale-[0.98]",
    ghost:     "bg-transparent text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A] active:scale-[0.98]",
  };
  return (
    <motion.button whileTap={{ scale: 0.97 }} className={cn(base, sizes[size], variants[variant], className)} {...(props as any)}>
      {children}
    </motion.button>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; }
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[#A1A1AA] text-xs font-medium">{label}</label>}
    <input
      ref={ref}
      className={cn(
        "bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#52525B] outline-none transition-colors duration-150",
        "focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30",
        className
      )}
      {...props}
    />
  </div>
));
Input.displayName = "Input";

// ─── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { value: string; label: string }[]; }
export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[#A1A1AA] text-xs font-medium">{label}</label>}
      <select
        className={cn(
          "bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors duration-150",
          "focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 appearance-none cursor-pointer",
          className
        )}
        {...props}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; }
export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[#A1A1AA] text-xs font-medium">{label}</label>}
      <textarea
        className={cn(
          "bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#52525B] outline-none transition-colors duration-150 resize-none",
          "focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30",
          className
        )}
        {...props}
      />
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
interface BadgeProps { label: string; bg: string; text: string; dot: string; }
export function StatusBadge({ label, bg, text, dot }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", bg, text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: string; }
export function Modal({ open, onClose, title, children, width = "max-w-lg" }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn("bg-[#111111] border border-[#262626] rounded-2xl shadow-2xl w-full", width)}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
              <h3 className="text-white font-semibold text-[15px]">{title}</h3>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#52525B] hover:text-white hover:bg-[#1A1A1A] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-white font-semibold text-[15px]">{title}</h2>
        {subtitle && <p className="text-[#52525B] text-xs mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-3">
        <span className="text-[#52525B] text-lg">∅</span>
      </div>
      <p className="text-[#52525B] text-sm">{message}</p>
    </div>
  );
}
