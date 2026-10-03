import React, { useState } from "react";
import { Search, ShieldCheck, ChevronDown, X } from "lucide-react";
import { AdminHeader } from "@/pages/admin/AdminLayout";
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { id: "u1", name: "Sara Khan", email: "sara@gmail.com", role: "CUSTOMER", orders: 7 },
  { id: "u2", name: "Aryan Mehta", email: "aryan@novaelectronics.in", role: "VENDOR", studio: "Nova Electronics" },
  { id: "u3", name: "Admin", email: "admin@galerie.in", role: "ADMIN" },
  { id: "u4", name: "Priya Nair", email: "priya@gmail.com", role: "CUSTOMER", orders: 3 },
  { id: "u5", name: "Rahul Verma", email: "rahul@gmail.com", role: "CUSTOMER", orders: 12 },
  { id: "u6", name: "Diya Malhotra", email: "diya@ateliermode.in", role: "VENDOR", studio: "Atelier Mode" },
];

const ROLE_STYLE = {
  CUSTOMER: "bg-accent/15 text-accent",
  VENDOR: "bg-emerald-500/15 text-emerald-400",
  ADMIN: "bg-amber-500/15 text-amber-400",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [promote, setPromote] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const list = users.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const confirmPromote = () => {
    setUsers((arr) => arr.map((u) => (u.id === promote.id ? { ...u, role: "VENDOR", studio: promote.studio || `${u.name}'s Studio` } : u)));
    setPromote(null);
  };

  return (
    <div>
      <AdminHeader eyebrow="Admin" title="Users" subtitle="Search, roles & vendor promotion" />
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="w-full pl-11 pr-4 py-2.5 rounded-2xl glass-strong text-sm outline-none focus:border-accent/50" />
      </div>
      <div className="rounded-3xl glass-strong overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_120px_100px_120px] gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">
          <span>Name</span><span>Email</span><span>Role</span><span>Orders</span><span>Action</span>
        </div>
        {list.map((u) => (
          <div key={u.id} className="grid grid-cols-[1fr_1fr_120px_100px_120px] gap-3 px-5 py-3.5 items-center border-b border-border/30">
            <span className="text-sm text-foreground truncate">{u.name}</span>
            <span className="text-sm text-muted-foreground truncate">{u.email}</span>
            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold w-fit", ROLE_STYLE[u.role])}>{u.role}</span>
            <span className="text-sm text-muted-foreground">{u.orders ?? "—"}</span>
            <div>
              {u.role === "CUSTOMER" && (
                <button onClick={() => setPromote({ id: u.id, name: u.name, studio: "" })} className="px-3 py-1.5 rounded-full glass text-xs font-medium text-accent hover:border-accent/40">Promote →</button>
              )}
              {u.role === "VENDOR" && <span className="text-xs text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> {u.studio}</span>}
            </div>
          </div>
        ))}
      </div>

      {promote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setPromote(null)} />
          <div className="relative w-full max-w-md animate-float-up">
            <div className="rounded-3xl glass-strong overflow-hidden glow-violet relative">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 ambient-glow" />
              <button onClick={() => setPromote(null)} className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full glass flex items-center justify-center"><X className="w-4 h-4" /></button>
              <div className="relative z-10 p-7">
                <h3 className="font-display font-700 text-xl text-foreground mb-1">Promote to Vendor</h3>
                <p className="text-sm text-muted-foreground mb-5">This creates the vendor profile and studio in one transaction.</p>
                <p className="text-sm text-foreground mb-4">{promote.name}</p>
                <label className="text-xs text-muted-foreground block mb-1.5">Studio name</label>
                <input autoFocus value={promote.studio} onChange={(e) => setPromote({ ...promote, studio: e.target.value })} placeholder="e.g. Nova Electronics" className="w-full px-4 py-3 rounded-2xl glass text-sm outline-none focus:border-accent/50 mb-4" />
                <div className="flex gap-2">
                  <button onClick={() => setPromote(null)} className="flex-1 px-4 py-3 rounded-2xl glass text-sm text-foreground/80">Cancel</button>
                  <button onClick={confirmPromote} className="flex-1 px-4 py-3 rounded-2xl bg-accent text-white text-sm font-semibold">Confirm promotion</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}