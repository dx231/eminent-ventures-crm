import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Package, Truck, Users, UserCircle, FileText, DollarSign,
  CreditCard, BarChart3, UsersRound, Settings, Search, Bell, ChevronDown,
  Plus, X, MapPin, Phone, Calendar, TrendingUp, Filter, Download,
  Star, Clock, CheckCircle2, XCircle, ArrowRight, Menu, LogOut, ShieldCheck,
  Fingerprint, Building2, Gauge, ClipboardList, FileSignature, Wallet,
  ChevronRight, AlertTriangle, Trophy, Target
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

/* ============================== BRAND ============================== */

const BRAND = {
  navy: "#0b1524",
  navy2: "#101d30",
  teal: "#14b8a6",
  amber: "#f59e0b",
};

function EVLogo({ size = 36, mono = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="46" height="46" rx="12" fill={mono ? "none" : "#0f2137"} stroke={mono ? "currentColor" : "#1c3a57"} strokeWidth={mono ? 1.5 : 1} />
      <path d="M10 32L20 14L24 22L28 14L38 32" stroke="#14b8a6" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M14 32H34" stroke="#f59e0b" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

/* ============================== SEED DATA ============================== */

const STATUS_STYLES = {
  Available: "bg-slate-700/60 text-slate-200",
  Assigned: "bg-blue-500/15 text-blue-400",
  "Picked Up": "bg-amber-500/15 text-amber-400",
  "In Transit": "bg-indigo-500/15 text-indigo-400",
  Delivered: "bg-emerald-500/15 text-emerald-400",
  Cancelled: "bg-red-500/15 text-red-400",
};

const CITY_PAIRS = [
  ["Dallas", "TX", "Chicago", "IL"], ["Miami", "FL", "Atlanta", "GA"],
  ["Los Angeles", "CA", "Phoenix", "AZ"], ["Columbus", "OH", "Nashville", "TN"],
  ["Newark", "NJ", "Orlando", "FL"], ["Seattle", "WA", "Denver", "CO"],
  ["Houston", "TX", "Memphis", "TN"], ["Charlotte", "NC", "Baltimore", "MD"],
  ["Detroit", "MI", "Kansas City", "MO"], ["San Diego", "CA", "Las Vegas", "NV"],
  ["Portland", "OR", "Salt Lake City", "UT"], ["Tampa", "FL", "Richmond", "VA"],
];

const VEHICLES = [
  ["2021", "Toyota", "Camry"], ["2019", "Ford", "F-150"], ["2022", "Honda", "CR-V"],
  ["2018", "Chevrolet", "Silverado"], ["2023", "Tesla", "Model 3"], ["2020", "BMW", "X5"],
  ["2017", "Nissan", "Altima"], ["2021", "Jeep", "Wrangler"], ["2016", "Audi", "A4"],
  ["2022", "Subaru", "Outback"], ["2019", "Ram", "1500"], ["2020", "Hyundai", "Elantra"],
];

const AGENT_NAMES = ["Jack", "Zack", "Peter", "Emma", "Henry", "Jason", "Mark", "Dexter"];
const CUSTOMERS = ["R. Alvarez", "T. Nguyen", "M. Carter", "S. Bianchi", "J. Whitfield", "K. Osei", "D. Park", "L. Fontaine"];
const CARRIER_NAMES = ["Silver Arrow Logistics", "Bluegrass Auto Haulers", "Redline Transport Co", "Summit Ridge Carriers", "Pacific Crest Hauling", "Ironhide Freight", "Cascade Auto Movers", "Sunbelt Transport LLC"];

function seedOrders() {
  const statuses = ["Available", "Assigned", "Picked Up", "In Transit", "Delivered", "Cancelled"];
  const orders = [];
  for (let i = 0; i < 42; i++) {
    const [pc, ps, dc, ds] = CITY_PAIRS[i % CITY_PAIRS.length];
    const [year, make, model] = VEHICLES[i % VEHICLES.length];
    const customerPay = 550 + ((i * 37) % 900);
    const carrierPay = Math.round(customerPay * (0.72 + ((i % 5) * 0.02)));
    const status = statuses[i % statuses.length];
    const pickupOffset = (i % 14) - 4;
    const pickup = new Date(); pickup.setDate(pickup.getDate() + pickupOffset);
    const delivery = new Date(pickup); delivery.setDate(delivery.getDate() + 3 + (i % 4));
    orders.push({
      id: `EV-${10230 + i}`,
      year, make, model,
      vin: `1HGCM${(82000 + i * 13)}${i % 10}`,
      pickupCity: pc, pickupState: ps, deliveryCity: dc, deliveryState: ds,
      customer: CUSTOMERS[i % CUSTOMERS.length],
      carrier: status === "Available" ? "—" : CARRIER_NAMES[i % CARRIER_NAMES.length],
      dispatcher: AGENT_NAMES[i % AGENT_NAMES.length],
      customerPay, carrierPay, profit: customerPay - carrierPay,
      pickupDate: pickup.toISOString().slice(0, 10),
      deliveryDate: delivery.toISOString().slice(0, 10),
      status,
      transportType: i % 3 === 0 ? "Enclosed" : "Open",
      running: i % 6 !== 0 ? "Running" : "Inoperable",
      deposit: Math.round(customerPay * 0.2),
    });
  }
  return orders;
}

function seedCarriers() {
  return CARRIER_NAMES.map((name, i) => ({
    id: `C-${400 + i}`,
    name,
    mc: `MC-${712000 + i * 41}`,
    dot: `DOT-${2210000 + i * 77}`,
    insurance: i % 5 === 0 ? "Expiring Soon" : "Active",
    w9: i % 4 !== 1,
    coi: i % 3 !== 2,
    activeLoads: 1 + (i % 4),
    completedLoads: 60 + i * 17,
    avgRate: 900 + i * 45,
    score: (4.1 + (i % 6) * 0.15).toFixed(1),
    phone: `(80${i}) 555-01${10 + i}`,
    equipment: i % 3 === 0 ? "Enclosed" : "Open",
  }));
}

function seedDrivers() {
  const first = ["Marcus", "Elena", "Trevor", "Priya", "Dominic", "Sasha", "Ola", "Ruben", "Nina", "Gareth"];
  return first.map((n, i) => ({
    id: `D-${700 + i}`,
    name: `${n} ${["Reyes", "Novak", "Bishop", "Adeyemi", "Cross", "Duval"][i % 6]}`,
    phone: `(61${i}) 555-02${10 + i}`,
    truckNumber: `TRK-${310 + i}`,
    trailerType: i % 3 === 0 ? "Enclosed" : "Open (9-car)",
    currentLoad: i % 4 === 0 ? "—" : `EV-${10230 + i}`,
    location: CITY_PAIRS[i % CITY_PAIRS.length][0] + ", " + CITY_PAIRS[i % CITY_PAIRS.length][1],
    availability: ["Available", "On Route", "Off Duty"][i % 3],
    carrier: CARRIER_NAMES[i % CARRIER_NAMES.length],
  }));
}

function seedTeam(orders) {
  return AGENT_NAMES.map((name) => {
    const mine = orders.filter(o => o.dispatcher === name && o.status !== "Cancelled");
    const revenue = mine.reduce((s, o) => s + o.customerPay, 0);
    const carrierPay = mine.reduce((s, o) => s + o.carrierPay, 0);
    const profit = revenue - carrierPay;
    return {
      name, booked: mine.length, revenue, carrierPay, profit,
      weekly: Math.round(profit * 0.31), monthly: profit,
    };
  }).sort((a, b) => b.profit - a.profit);
}

const REVENUE_30D = Array.from({ length: 30 }).map((_, i) => ({
  day: `${i + 1}`,
  revenue: 3200 + Math.round(1800 * Math.sin(i / 3.2) + (i * 44) + (i % 5) * 220),
  carrierPay: 2400 + Math.round(1300 * Math.sin(i / 3.4 + 1) + (i * 33) + (i % 4) * 180),
}));

const ACTIVITY_FEED = [
  { text: "Carrier Redline Transport Co assigned to EV-10247", time: "8 min ago", icon: Truck },
  { text: "Rate confirmation signed for EV-10241", time: "26 min ago", icon: FileSignature },
  { text: "Invoice #INV-3391 marked Paid", time: "1 hr ago", icon: CreditCard },
  { text: "New order EV-10271 created by Emma", time: "2 hr ago", icon: Package },
  { text: "Driver Elena Novak marked On Route", time: "3 hr ago", icon: MapPin },
  { text: "COI uploaded for Cascade Auto Movers", time: "5 hr ago", icon: ShieldCheck },
];

/* ============================== SMALL HELPERS ============================== */

const money = (n) => `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const initials = (name) => name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium font-mono tracking-tight ${STATUS_STYLES[status] || "bg-slate-700 text-slate-200"}`}>
      {status}
    </span>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-slate-900/60 border border-slate-800 rounded-xl ${className}`}>{children}</div>;
}

/* ============================== LOGIN ============================== */

function LoginScreen({ onLogin }) {
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const roles = [
    { key: "Admin", desc: "Full system access", icon: ShieldCheck },
    { key: "Dispatcher", desc: "Orders & dispatch board", icon: Truck },
    { key: "Sales Agent", desc: "Bookings & commissions", icon: UsersRound },
    { key: "Shipper", desc: "Track your vehicle", icon: Package },
  ];
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-slate-900 to-slate-950 border-r border-slate-800">
          <div className="flex items-center gap-3">
            <EVLogo size={40} />
            <div>
              <div className="text-white font-semibold tracking-tight text-lg">Eminent Ventures</div>
              <div className="text-slate-500 text-xs font-mono">TRANSPORT MANAGEMENT SYSTEM</div>
            </div>
          </div>
          <div>
            <div className="text-slate-300 text-sm leading-relaxed mb-6">
              Dispatch, documents, and margin — tracked on one control tower for your whole brokerage.
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[["1,204", "Loads Moved"], ["98.4%", "On-Time"], ["$2.1M", "YTD Volume"]].map(([n, l]) => (
                <div key={l} className="border border-slate-800 rounded-lg py-3">
                  <div className="text-teal-400 font-mono font-semibold">{n}</div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-slate-600 text-xs">© {new Date().getFullYear()} Eminent Ventures Corp.</div>
        </div>
        <div className="bg-slate-900 p-10">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <EVLogo size={32} />
            <div className="text-white font-semibold">Eminent Ventures</div>
          </div>
          <h1 className="text-white text-xl font-semibold mb-1">Sign in to your workspace</h1>
          <p className="text-slate-500 text-sm mb-6">Select your role to continue.</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roles.map(r => (
              <button key={r.key} onClick={() => setRole(r.key)}
                className={`text-left p-3 rounded-lg border transition ${role === r.key ? "border-teal-500 bg-teal-500/10" : "border-slate-800 bg-slate-950/50 hover:border-slate-700"}`}>
                <r.icon size={16} className={role === r.key ? "text-teal-400" : "text-slate-500"} />
                <div className="text-sm text-white mt-2 font-medium">{r.key}</div>
                <div className="text-[11px] text-slate-500">{r.desc}</div>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@eminentventures.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500" />
            </div>
            <button onClick={() => onLogin(role)}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg py-2.5 text-sm transition flex items-center justify-center gap-2">
              Sign in as {role} <ArrowRight size={15} />
            </button>
            <div className="text-center text-xs text-slate-600 pt-1">Role-based access secures every module by permission level.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== SIDEBAR ============================== */

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: Package },
  { key: "dispatch", label: "Dispatch", icon: Truck },
  { key: "shippers", label: "Shippers", icon: Building2 },
  { key: "carriers", label: "Carriers", icon: ShieldCheck },
  { key: "drivers", label: "Drivers", icon: UserCircle },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "invoices", label: "Invoices", icon: FileSignature },
  { key: "payments", label: "Payments", icon: Wallet },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "team", label: "Team", icon: UsersRound },
  { key: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ view, setView, open, setOpen }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed md:static z-40 h-full md:h-auto w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
          <EVLogo size={32} />
          <div>
            <div className="text-white font-semibold text-sm tracking-tight leading-none">Eminent Ventures</div>
            <div className="text-slate-500 text-[10px] font-mono tracking-wide mt-1">BROKER TMS</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV.map(item => (
            <button key={item.key} onClick={() => { setView(item.key); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
                ${view === item.key ? "bg-teal-500/10 text-teal-400 border border-teal-500/30" : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"}`}>
              <item.icon size={17} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Gauge size={14} className="text-teal-500" /> System status: <span className="text-emerald-400">Operational</span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ============================== TOPBAR ============================== */

function Topbar({ role, onMenu, onLogout }) {
  const [openProfile, setOpenProfile] = useState(false);
  return (
    <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 md:px-6 py-3 flex items-center gap-4">
      <button className="md:hidden text-slate-400" onClick={onMenu}><Menu size={22} /></button>
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input placeholder="Search orders, VIN, carrier, customer..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 outline-none focus:border-teal-500" />
      </div>
      <div className="flex-1" />
      <button className="relative text-slate-400 hover:text-white">
        <Bell size={19} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
      </button>
      <div className="relative">
        <button onClick={() => setOpenProfile(o => !o)} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-900">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-semibold">{initials(role)}</div>
          <div className="hidden sm:block text-left">
            <div className="text-xs text-white leading-none">{role}</div>
            <div className="text-[10px] text-slate-500">Eminent Ventures</div>
          </div>
          <ChevronDown size={14} className="text-slate-500" />
        </button>
        {openProfile && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden">
            <button className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"><Settings size={14} /> Account settings</button>
            <button onClick={onLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2"><LogOut size={14} /> Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */

function KpiCard({ label, value, sub, icon: Icon, accent = "teal" }) {
  const accents = { teal: "text-teal-400 bg-teal-500/10", amber: "text-amber-400 bg-amber-500/10", red: "text-red-400 bg-red-500/10", blue: "text-blue-400 bg-blue-500/10", emerald: "text-emerald-400 bg-emerald-500/10" };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accents[accent]}`}><Icon size={16} /></div>
      </div>
      <div className="text-xl font-semibold text-white font-mono tracking-tight">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
      {sub && <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp size={11} />{sub}</div>}
    </Card>
  );
}

function Dashboard({ orders }) {
  const active = orders.filter(o => ["Assigned", "Picked Up", "In Transit"].includes(o.status)).length;
  const available = orders.filter(o => o.status === "Available").length;
  const assigned = orders.filter(o => o.status === "Assigned").length;
  const pickedUp = orders.filter(o => o.status === "Picked Up").length;
  const delivered = orders.filter(o => o.status === "Delivered").length;
  const cancelled = orders.filter(o => o.status === "Cancelled").length;
  const live = orders.filter(o => o.status !== "Cancelled");
  const revenue = live.reduce((s, o) => s + o.customerPay, 0);
  const carrierPay = live.reduce((s, o) => s + o.carrierPay, 0);
  const profit = revenue - carrierPay;

  const byStatus = ["Available", "Assigned", "Picked Up", "In Transit", "Delivered", "Cancelled"].map(s => ({
    name: s, value: orders.filter(o => o.status === s).length
  }));
  const COLORS = ["#64748b", "#3b82f6", "#f59e0b", "#6366f1", "#10b981", "#ef4444"];

  const upcomingPickups = orders.filter(o => ["Assigned", "Available"].includes(o.status)).slice(0, 5);
  const upcomingDeliveries = orders.filter(o => ["Picked Up", "In Transit"].includes(o.status)).slice(0, 5);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-lg font-semibold">Control Tower</h1>
        <p className="text-slate-500 text-sm">Live snapshot of every order moving through Eminent Ventures.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-9 gap-3">
        <KpiCard label="Active Orders" value={active} icon={Truck} accent="blue" />
        <KpiCard label="Available Orders" value={available} icon={Package} accent="teal" />
        <KpiCard label="Assigned Orders" value={assigned} icon={ClipboardList} accent="blue" />
        <KpiCard label="Picked Up" value={pickedUp} icon={MapPin} accent="amber" />
        <KpiCard label="Delivered" value={delivered} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="Cancelled" value={cancelled} icon={XCircle} accent="red" />
        <KpiCard label="Total Revenue" value={money(revenue)} icon={DollarSign} accent="teal" sub="+8.2% vs last 30d" />
        <KpiCard label="Total Carrier Pay" value={money(carrierPay)} icon={Truck} accent="amber" />
        <KpiCard label="Gross Profit" value={money(profit)} icon={TrendingUp} accent="emerald" sub={`${((profit / revenue) * 100).toFixed(1)}% margin`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white text-sm font-medium">Revenue vs Carrier Pay — 30 Days</div>
            <div className="flex gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Carrier Pay</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={REVENUE_30D}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="carrierPay" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="text-white text-sm font-medium mb-4">Orders by Status</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {byStatus.map((entry, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-y-1.5 mt-2 text-xs">
            {byStatus.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS[i] }} /> {s.name} <span className="text-slate-600">({s.value})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="text-white text-sm font-medium mb-4 flex items-center gap-2"><Clock size={15} className="text-teal-400" /> Recent Activity</div>
          <div className="space-y-3">
            {ACTIVITY_FEED.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0"><a.icon size={13} className="text-slate-400" /></div>
                <div>
                  <div className="text-xs text-slate-300 leading-snug">{a.text}</div>
                  <div className="text-[11px] text-slate-600">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-white text-sm font-medium mb-4 flex items-center gap-2"><MapPin size={15} className="text-blue-400" /> Upcoming Pickups</div>
          <div className="space-y-2.5">
            {upcomingPickups.map(o => (
              <div key={o.id} className="flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-200 font-mono">{o.id}</div>
                  <div className="text-slate-500">{o.pickupCity}, {o.pickupState}</div>
                </div>
                <div className="text-slate-400 font-mono">{o.pickupDate}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-white text-sm font-medium mb-4 flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400" /> Upcoming Deliveries</div>
          <div className="space-y-2.5">
            {upcomingDeliveries.map(o => (
              <div key={o.id} className="flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-200 font-mono">{o.id}</div>
                  <div className="text-slate-500">{o.deliveryCity}, {o.deliveryState}</div>
                </div>
                <div className="text-slate-400 font-mono">{o.deliveryDate}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== ORDERS ============================== */

function CreateOrderModal({ onClose, onCreate }) {
  const [f, setF] = useState({
    customer: "", pickupContact: "", pickupPhone: "", pickupAddress: "",
    deliveryContact: "", deliveryPhone: "", deliveryAddress: "",
    year: "", make: "", model: "", vin: "", lot: "",
    running: "Running", transportType: "Open",
    customerPay: "", carrierPay: "", deposit: "",
    pickupDate: "", deliveryDate: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const profit = (Number(f.customerPay) || 0) - (Number(f.carrierPay) || 0);

  const field = (label, key, type = "text", span = "col-span-1") => (
    <div className={span}>
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      <input value={f[key]} onChange={set(key)} type={type}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 sticky top-0 bg-slate-900">
          <div className="text-white font-medium">Create Order</div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <div className="text-xs uppercase tracking-wide text-teal-400 mb-2 font-medium">Customer</div>
            <div className="grid grid-cols-2 gap-3">{field("Customer Name", "customer", "text", "col-span-2")}</div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-teal-400 mb-2 font-medium">Pickup</div>
            <div className="grid grid-cols-2 gap-3">
              {field("Pickup Contact", "pickupContact")}
              {field("Pickup Phone", "pickupPhone")}
              {field("Pickup Address", "pickupAddress", "text", "col-span-2")}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-teal-400 mb-2 font-medium">Delivery</div>
            <div className="grid grid-cols-2 gap-3">
              {field("Delivery Contact", "deliveryContact")}
              {field("Delivery Phone", "deliveryPhone")}
              {field("Delivery Address", "deliveryAddress", "text", "col-span-2")}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-teal-400 mb-2 font-medium">Vehicle</div>
            <div className="grid grid-cols-3 gap-3">
              {field("Year", "year")}
              {field("Make", "make")}
              {field("Model", "model")}
              {field("VIN", "vin")}
              {field("Lot Number", "lot")}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Running / Inoperable</label>
                <select value={f.running} onChange={set("running")} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500">
                  <option>Running</option><option>Inoperable</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Open / Enclosed</label>
                <select value={f.transportType} onChange={set("transportType")} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500">
                  <option>Open</option><option>Enclosed</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-teal-400 mb-2 font-medium">Pricing & Dates</div>
            <div className="grid grid-cols-3 gap-3">
              {field("Customer Pay", "customerPay", "number")}
              {field("Carrier Pay", "carrierPay", "number")}
              {field("Deposit", "deposit", "number")}
              {field("Pickup Date", "pickupDate", "date")}
              {field("Delivery Date", "deliveryDate", "date")}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Profit (auto)</label>
                <div className={`w-full rounded-lg px-3 py-2 text-sm font-mono font-semibold border ${profit >= 0 ? "border-emerald-800 bg-emerald-500/10 text-emerald-400" : "border-red-800 bg-red-500/10 text-red-400"}`}>
                  {money(profit)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-slate-800 flex justify-end gap-2 sticky bottom-0 bg-slate-900">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white">Cancel</button>
          <button onClick={() => onCreate(f, profit)} className="px-4 py-2 rounded-lg text-sm bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold">Create Order</button>
        </div>
      </div>
    </div>
  );
}

function OrdersView({ orders, setOrders }) {
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = orders.filter(o =>
    (statusFilter === "All" || o.status === statusFilter) &&
    (query === "" || o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.toLowerCase().includes(query.toLowerCase()) || o.vin.toLowerCase().includes(query.toLowerCase()))
  );

  const handleCreate = (f, profit) => {
    const id = `EV-${10230 + orders.length + 1}`;
    setOrders([{
      id, year: f.year, make: f.make, model: f.model, vin: f.vin || "PENDING",
      pickupCity: f.pickupAddress.split(",")[0] || "TBD", pickupState: "—",
      deliveryCity: f.deliveryAddress.split(",")[0] || "TBD", deliveryState: "—",
      customer: f.customer || "Unnamed", carrier: "—", dispatcher: "You",
      customerPay: Number(f.customerPay) || 0, carrierPay: Number(f.carrierPay) || 0, profit,
      pickupDate: f.pickupDate || "—", deliveryDate: f.deliveryDate || "—",
      status: "Available", transportType: f.transportType, running: f.running,
      deposit: Number(f.deposit) || 0,
    }, ...orders]);
    setShowCreate(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-white text-lg font-semibold">Orders</h1>
          <p className="text-slate-500 text-sm">{filtered.length} of {orders.length} orders</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={16} /> Create Order
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search order#, customer, VIN"
            className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-teal-500 w-64" />
        </div>
        {["All", "Available", "Assigned", "Picked Up", "In Transit", "Delivered", "Cancelled"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg border ${statusFilter === s ? "border-teal-500 text-teal-400 bg-teal-500/10" : "border-slate-800 text-slate-400 hover:text-white"}`}>
            {s}
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 text-left">
              {["Order #", "Vehicle", "Pickup", "Delivery", "Customer", "Carrier", "Cust. Pay", "Carrier Pay", "Profit", "Pickup Date", "Delivery Date", "Status"].map(h => (
                <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-slate-800/60 hover:bg-slate-900/60">
                <td className="px-4 py-3 font-mono text-teal-400 whitespace-nowrap">{o.id}</td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{o.year} {o.make} {o.model}</td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{o.pickupCity}, {o.pickupState}</td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{o.deliveryCity}, {o.deliveryState}</td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{o.customer}</td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{o.carrier}</td>
                <td className="px-4 py-3 font-mono text-slate-200 whitespace-nowrap">{money(o.customerPay)}</td>
                <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">{money(o.carrierPay)}</td>
                <td className={`px-4 py-3 font-mono whitespace-nowrap ${o.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>{money(o.profit)}</td>
                <td className="px-4 py-3 text-slate-400 font-mono whitespace-nowrap">{o.pickupDate}</td>
                <td className="px-4 py-3 text-slate-400 font-mono whitespace-nowrap">{o.deliveryDate}</td>
                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showCreate && <CreateOrderModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}

/* ============================== DISPATCH ============================== */

function DispatchConfirmModal({ order, carrier, onClose, onConfirm }) {
  const [pickupEta, setPickupEta] = useState(order.pickupDate);
  const [deliveryEta, setDeliveryEta] = useState(order.deliveryDate);
  const [signed, setSigned] = useState("");
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="text-white font-medium">Dispatch Confirmation</div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-sm text-slate-300">Assign <span className="font-mono text-teal-400">{order.id}</span> to <span className="text-white font-medium">{carrier.name}</span></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Pickup ETA</label>
              <input type="date" value={pickupEta} onChange={e => setPickupEta(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Delivery ETA</label>
              <input type="date" value={deliveryEta} onChange={e => setDeliveryEta(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1"><FileSignature size={12} /> Type name to e-sign rate confirmation</label>
            <input value={signed} onChange={e => setSigned(e.target.value)} placeholder="Full name"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500" />
          </div>
        </div>
        <div className="px-5 py-4 border-t border-slate-800 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white">Cancel</button>
          <button disabled={!signed} onClick={() => onConfirm(pickupEta, deliveryEta)}
            className="px-4 py-2 rounded-lg text-sm bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-semibold">Confirm Dispatch</button>
        </div>
      </div>
    </div>
  );
}

function DispatchView({ orders, setOrders, carriers }) {
  const dispatchable = orders.filter(o => ["Available", "Assigned", "Picked Up", "In Transit"].includes(o.status));
  const [selectedId, setSelectedId] = useState(dispatchable[0]?.id);
  const [carrierQuery, setCarrierQuery] = useState("");
  const [confirmCarrier, setConfirmCarrier] = useState(null);
  const order = orders.find(o => o.id === selectedId) || dispatchable[0];

  const filteredCarriers = carriers.filter(c => c.name.toLowerCase().includes(carrierQuery.toLowerCase()));

  const advance = (status) => setOrders(orders.map(o => o.id === order.id ? { ...o, status } : o));
  const assignCarrier = (pickupEta, deliveryEta) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, carrier: confirmCarrier.name, status: "Assigned", pickupDate: pickupEta, deliveryDate: deliveryEta } : o));
    setConfirmCarrier(null);
  };

  if (!order) return <div className="text-slate-500 text-sm">No dispatchable orders.</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-white text-lg font-semibold">Dispatch Board</h1>
        <p className="text-slate-500 text-sm">Match orders to carriers and move loads through the pipeline.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {dispatchable.map(o => (
          <button key={o.id} onClick={() => setSelectedId(o.id)}
            className={`shrink-0 px-3 py-2 rounded-lg border text-xs font-mono ${o.id === order.id ? "border-teal-500 bg-teal-500/10 text-teal-400" : "border-slate-800 text-slate-400 hover:text-white"}`}>
            {o.id}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-2 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-teal-400">{order.id}</div>
            <StatusBadge status={order.status} />
          </div>
          <div className="text-white font-medium">{order.year} {order.make} {order.model}</div>
          <div className="text-xs text-slate-500 font-mono">VIN {order.vin}</div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
              <div className="text-slate-500 mb-1 flex items-center gap-1"><MapPin size={11} /> Pickup</div>
              <div className="text-slate-200">{order.pickupCity}, {order.pickupState}</div>
              <div className="text-slate-500 font-mono mt-1">{order.pickupDate}</div>
            </div>
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
              <div className="text-slate-500 mb-1 flex items-center gap-1"><MapPin size={11} /> Delivery</div>
              <div className="text-slate-200">{order.deliveryCity}, {order.deliveryState}</div>
              <div className="text-slate-500 font-mono mt-1">{order.deliveryDate}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 text-center">
              <div className="text-slate-500">Cust. Pay</div><div className="text-slate-200 font-mono mt-1">{money(order.customerPay)}</div>
            </div>
            <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 text-center">
              <div className="text-slate-500">Carrier Pay</div><div className="text-slate-200 font-mono mt-1">{money(order.carrierPay)}</div>
            </div>
            <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 text-center">
              <div className="text-slate-500">Profit</div><div className="text-emerald-400 font-mono mt-1">{money(order.profit)}</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-slate-500 mb-2">Current carrier</div>
            <div className="text-sm text-white">{order.carrier}</div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            {["Assigned", "Picked Up", "In Transit", "Delivered", "Cancelled"].map(s => (
              <button key={s} onClick={() => advance(s)}
                className={`text-xs px-3 py-1.5 rounded-lg border ${order.status === s ? "border-teal-500 text-teal-400 bg-teal-500/10" : "border-slate-800 text-slate-400 hover:text-white"}`}>
                {s}
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white text-sm font-medium">Available Carriers</div>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={carrierQuery} onChange={e => setCarrierQuery(e.target.value)} placeholder="Search carriers"
                className="bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white outline-none focus:border-teal-500 w-48" />
            </div>
          </div>
          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
            {filteredCarriers.map(c => (
              <div key={c.id} className="flex items-center justify-between border border-slate-800 rounded-lg p-3">
                <div>
                  <div className="text-sm text-white flex items-center gap-2">{c.name} <span className="text-[10px] text-slate-500 font-mono">{c.mc}</span></div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Star size={10} className="text-amber-400" />{c.score}</span>
                    <span>{c.equipment}</span>
                    <span className={c.insurance === "Active" ? "text-emerald-400" : "text-amber-400"}>{c.insurance}</span>
                    <span>Avg {money(c.avgRate)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmCarrier(c)} className="text-xs px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold">Assign Carrier</button>
                  <button className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500">Assign Driver</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {confirmCarrier && (
        <DispatchConfirmModal order={order} carrier={confirmCarrier} onClose={() => setConfirmCarrier(null)} onConfirm={assignCarrier} />
      )}
    </div>
  );
}

/* ============================== CARRIERS ============================== */

function CarriersView({ carriers }) {
  const [selected, setSelected] = useState(carriers[0]);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-white text-lg font-semibold">Carriers</h1>
        <p className="text-slate-500 text-sm">{carriers.length} carriers in your network</p>
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-2 divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
          {carriers.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} className={`w-full text-left p-4 hover:bg-slate-900/60 ${selected?.id === c.id ? "bg-slate-900/80" : ""}`}>
              <div className="text-sm text-white">{c.name}</div>
              <div className="text-[11px] text-slate-500 flex gap-3 mt-1">
                <span className="font-mono">{c.mc}</span>
                <span className="flex items-center gap-1"><Star size={10} className="text-amber-400" />{c.score}</span>
              </div>
            </button>
          ))}
        </Card>
        {selected && (
          <Card className="lg:col-span-3 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-white text-lg font-medium">{selected.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">{selected.mc} · {selected.dot}</div>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selected.insurance === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                Insurance {selected.insurance}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                ["Active Loads", selected.activeLoads],
                ["Completed Loads", selected.completedLoads],
                ["Avg Rate", money(selected.avgRate)],
                ["Performance", selected.score + " / 5"],
              ].map(([l, v]) => (
                <div key={l} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                  <div className="text-white font-mono font-semibold">{v}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{l}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center gap-2 text-sm">
                {selected.w9 ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
                <span className="text-slate-300">W-9 {selected.w9 ? "on file" : "missing"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {selected.coi ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-red-400" />}
                <span className="text-slate-300">COI {selected.coi ? "on file" : "missing"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400"><Phone size={14} /> {selected.phone}</div>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ============================== DRIVERS ============================== */

function DriversView({ drivers }) {
  const availColor = { Available: "text-emerald-400 bg-emerald-500/10", "On Route": "text-blue-400 bg-blue-500/10", "Off Duty": "text-slate-400 bg-slate-700/40" };
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-white text-lg font-semibold">Drivers</h1>
        <p className="text-slate-500 text-sm">{drivers.length} drivers across your carrier network</p>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map(d => (
          <Card key={d.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 font-semibold">{initials(d.name)}</div>
                <div>
                  <div className="text-sm text-white">{d.name}</div>
                  <div className="text-[11px] text-slate-500">{d.carrier}</div>
                </div>
              </div>
              <span className={`text-[11px] px-2 py-1 rounded-md font-medium ${availColor[d.availability]}`}>{d.availability}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5"><Phone size={11} /> {d.phone}</div>
              <div className="flex items-center gap-1.5"><Truck size={11} /> {d.truckNumber}</div>
              <div className="flex items-center gap-1.5"><Package size={11} /> {d.trailerType}</div>
              <div className="flex items-center gap-1.5"><MapPin size={11} /> {d.location}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-500">
              Current load: <span className="text-teal-400 font-mono">{d.currentLoad}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================== SHIPPERS ============================== */

function ShippersView({ orders }) {
  const shipperMap = {};
  orders.forEach(o => {
    if (!shipperMap[o.customer]) shipperMap[o.customer] = { name: o.customer, orders: 0, spend: 0 };
    shipperMap[o.customer].orders += 1;
    shipperMap[o.customer].spend += o.customerPay;
  });
  const shippers = Object.values(shipperMap).sort((a, b) => b.spend - a.spend);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-white text-lg font-semibold">Shippers</h1>
        <p className="text-slate-500 text-sm">Customer accounts booking with Eminent Ventures</p>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {shippers.map(s => (
          <Card key={s.name} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-semibold">{initials(s.name)}</div>
              <div className="text-sm text-white">{s.name}</div>
            </div>
            <div className="flex justify-between text-xs">
              <div><div className="text-slate-500">Orders</div><div className="text-white font-mono mt-0.5">{s.orders}</div></div>
              <div><div className="text-slate-500">Total Spend</div><div className="text-emerald-400 font-mono mt-0.5">{money(s.spend)}</div></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================== DOCUMENTS ============================== */

const DOC_TYPES = [
  { key: "bol", name: "Bill of Lading", icon: FileText, desc: "Condition report & chain of custody" },
  { key: "dispatch", name: "Dispatch Sheet", icon: ClipboardList, desc: "Carrier assignment & load details" },
  { key: "ratecon", name: "Rate Confirmation", icon: FileSignature, desc: "Signed carrier rate agreement" },
  { key: "invoice", name: "Invoice", icon: CreditCard, desc: "Customer billing document" },
  { key: "pod", name: "Proof of Delivery", icon: CheckCircle2, desc: "Signed delivery confirmation" },
];

function DocumentsView({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(orders[0]?.id);
  const [signName, setSignName] = useState("");
  const order = orders.find(o => o.id === selectedOrder);

  const generate = (docName) => {
    const content = `EMINENT VENTURES — ${docName.toUpperCase()}\nOrder: ${order.id}\nVehicle: ${order.year} ${order.make} ${order.model}\nCustomer: ${order.customer}\nCarrier: ${order.carrier}\nPickup: ${order.pickupCity}, ${order.pickupState} (${order.pickupDate})\nDelivery: ${order.deliveryCity}, ${order.deliveryState} (${order.deliveryDate})\nCustomer Pay: $${order.customerPay}\nCarrier Pay: $${order.carrierPay}\n${signName ? `E-Signed by: ${signName}\n` : ""}Generated: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${order.id}-${docName.replace(/\s+/g, "-")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-white text-lg font-semibold">Documents</h1>
        <p className="text-slate-500 text-sm">Generate and download load documents with e-signature support.</p>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Order</label>
          <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500">
            {orders.map(o => <option key={o.id} value={o.id}>{o.id} — {o.year} {o.make} {o.model}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1"><FileSignature size={12} /> E-signature (type full name)</label>
          <input value={signName} onChange={e => setSignName(e.target.value)} placeholder="Full name"
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500 w-56" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DOC_TYPES.map(d => (
          <Card key={d.key} className="p-4 flex flex-col">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3"><d.icon size={17} /></div>
            <div className="text-sm text-white font-medium">{d.name}</div>
            <div className="text-xs text-slate-500 mt-1 flex-1">{d.desc}</div>
            <button onClick={() => generate(d.name)} disabled={!order} className="mt-4 flex items-center justify-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-3 py-2">
              <Download size={13} /> Generate & Download
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================== INVOICES / PAYMENTS ============================== */

function seedInvoices(orders) {
  return orders.filter(o => o.status !== "Cancelled").slice(0, 20).map((o, i) => ({
    id: `INV-${3300 + i}`, order: o.id, customer: o.customer, amount: o.customerPay,
    status: i % 3 === 0 ? "Unpaid" : "Paid", method: i % 2 === 0 ? "ACH" : "Card",
    date: o.pickupDate,
  }));
}
function seedCarrierPayments(orders) {
  return orders.filter(o => o.status !== "Cancelled" && o.carrier !== "—").slice(0, 20).map((o, i) => ({
    id: `PAY-${5100 + i}`, order: o.id, carrier: o.carrier, amount: o.carrierPay,
    status: i % 4 === 0 ? "Unpaid" : "Paid", method: i % 2 === 0 ? "Comdata" : "ACH",
    date: o.deliveryDate,
  }));
}

function PayTable({ rows, entityLabel }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-500 border-b border-slate-800 text-left">
            {["ID", "Order", entityLabel, "Amount", "Method", "Date", "Status"].map(h => <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b border-slate-800/60 hover:bg-slate-900/60">
              <td className="px-4 py-3 font-mono text-teal-400 whitespace-nowrap">{r.id}</td>
              <td className="px-4 py-3 font-mono text-slate-300 whitespace-nowrap">{r.order}</td>
              <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{r.customer || r.carrier}</td>
              <td className="px-4 py-3 font-mono text-slate-200 whitespace-nowrap">{money(r.amount)}</td>
              <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{r.method}</td>
              <td className="px-4 py-3 text-slate-400 font-mono whitespace-nowrap">{r.date}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-md text-[11px] font-medium ${r.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function InvoicesView({ orders }) {
  const invoices = useMemo(() => seedInvoices(orders), [orders]);
  const outstanding = invoices.filter(i => i.status === "Unpaid").reduce((s, i) => s + i.amount, 0);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-white text-lg font-semibold">Invoices</h1>
        <p className="text-slate-500 text-sm">Customer billing across all active orders</p>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-xl">
        <Card className="p-4"><div className="text-slate-500 text-xs">Total Invoiced</div><div className="text-white font-mono font-semibold mt-1">{money(invoices.reduce((s, i) => s + i.amount, 0))}</div></Card>
        <Card className="p-4"><div className="text-slate-500 text-xs">Outstanding</div><div className="text-amber-400 font-mono font-semibold mt-1">{money(outstanding)}</div></Card>
        <Card className="p-4"><div className="text-slate-500 text-xs">Paid</div><div className="text-emerald-400 font-mono font-semibold mt-1">{invoices.filter(i => i.status === "Paid").length}</div></Card>
      </div>
      <PayTable rows={invoices} entityLabel="Customer" />
    </div>
  );
}

function PaymentsView({ orders }) {
  const payments = useMemo(() => seedCarrierPayments(orders), [orders]);
  const outstanding = payments.filter(p => p.status === "Unpaid").reduce((s, p) => s + p.amount, 0);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-white text-lg font-semibold">Payments</h1>
        <p className="text-slate-500 text-sm">Carrier payouts and outstanding balances</p>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-xl">
        <Card className="p-4"><div className="text-slate-500 text-xs">Total Paid Out</div><div className="text-white font-mono font-semibold mt-1">{money(payments.reduce((s, p) => s + p.amount, 0))}</div></Card>
        <Card className="p-4"><div className="text-slate-500 text-xs">Outstanding</div><div className="text-amber-400 font-mono font-semibold mt-1">{money(outstanding)}</div></Card>
        <Card className="p-4"><div className="text-slate-500 text-xs">Paid</div><div className="text-emerald-400 font-mono font-semibold mt-1">{payments.filter(p => p.status === "Paid").length}</div></Card>
      </div>
      <PayTable rows={payments} entityLabel="Carrier" />
    </div>
  );
}

/* ============================== REPORTS ============================== */

function ReportsView({ orders }) {
  const [customer, setCustomer] = useState("All");
  const [carrier, setCarrier] = useState("All");
  const [dispatcher, setDispatcher] = useState("All");

  const filtered = orders.filter(o =>
    (customer === "All" || o.customer === customer) &&
    (carrier === "All" || o.carrier === carrier) &&
    (dispatcher === "All" || o.dispatcher === dispatcher) &&
    o.status !== "Cancelled"
  );

  const revenue = filtered.reduce((s, o) => s + o.customerPay, 0);
  const carrierPay = filtered.reduce((s, o) => s + o.carrierPay, 0);
  const profit = revenue - carrierPay;
  const completed = filtered.filter(o => o.status === "Delivered").length;
  const avgProfit = filtered.length ? profit / filtered.length : 0;

  const byDispatcher = AGENT_NAMES.map(name => {
    const rows = filtered.filter(o => o.dispatcher === name);
    return { name, profit: rows.reduce((s, o) => s + o.profit, 0), orders: rows.length };
  }).filter(d => d.orders > 0).sort((a, b) => b.profit - a.profit);

  const Select = ({ label, value, setValue, options }) => (
    <div>
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      <select value={value} onChange={e => setValue(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500">
        <option>All</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-lg font-semibold">Reports</h1>
        <p className="text-slate-500 text-sm">Performance across customers, carriers, and dispatchers.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1"><Calendar size={11} /> Date Range</label>
          <select className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500">
            <option>Last 30 days</option><option>Last 90 days</option><option>Year to date</option>
          </select>
        </div>
        <Select label="Customer" value={customer} setValue={setCustomer} options={[...new Set(orders.map(o => o.customer))]} />
        <Select label="Carrier" value={carrier} setValue={setCarrier} options={[...new Set(orders.map(o => o.carrier).filter(c => c !== "—"))]} />
        <Select label="Dispatcher" value={dispatcher} setValue={setDispatcher} options={AGENT_NAMES} />
        <button className="self-end flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white"><Filter size={13} /> Apply</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4"><div className="text-slate-500 text-xs">Revenue</div><div className="text-white font-mono font-semibold mt-1">{money(revenue)}</div></Card>
        <Card className="p-4"><div className="text-slate-500 text-xs">Carrier Pay</div><div className="text-white font-mono font-semibold mt-1">{money(carrierPay)}</div></Card>
        <Card className="p-4"><div className="text-slate-500 text-xs">Profit</div><div className="text-emerald-400 font-mono font-semibold mt-1">{money(profit)}</div></Card>
        <Card className="p-4"><div className="text-slate-500 text-xs">Orders Completed</div><div className="text-white font-mono font-semibold mt-1">{completed}</div></Card>
        <Card className="p-4"><div className="text-slate-500 text-xs">Avg Profit / Order</div><div className="text-white font-mono font-semibold mt-1">{money(avgProfit)}</div></Card>
      </div>

      <Card className="p-5">
        <div className="text-white text-sm font-medium mb-4">Profit by Dispatcher</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byDispatcher}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
            <YAxis stroke="#475569" fontSize={11} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="profit" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/* ============================== TEAM ============================== */

const TEAM_GOAL = 13000;

function TeamView({ orders }) {
  const team = useMemo(() => seedTeam(orders), [orders]);
  const totalProfit = team.reduce((s, t) => s + t.profit, 0);
  const pct = Math.min(100, (totalProfit / TEAM_GOAL) * 100);
  const remaining = Math.max(0, TEAM_GOAL - totalProfit);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-lg font-semibold">Team</h1>
        <p className="text-slate-500 text-sm">Agent performance and progress toward the team goal.</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-white text-sm font-medium"><Target size={16} className="text-teal-400" /> Team Goal — Jul 15 to Aug 14</div>
          <div className="text-xs text-slate-500">{money(totalProfit)} of {money(TEAM_GOAL)}</div>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400" style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div><div className="text-white font-mono font-semibold">{money(totalProfit)}</div><div className="text-[11px] text-slate-500 mt-1">Current Profit</div></div>
          <div><div className="text-amber-400 font-mono font-semibold">{money(remaining)}</div><div className="text-[11px] text-slate-500 mt-1">Remaining</div></div>
          <div><div className="text-teal-400 font-mono font-semibold">{pct.toFixed(1)}%</div><div className="text-[11px] text-slate-500 mt-1">Complete</div></div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 text-white text-sm font-medium mb-4"><Trophy size={16} className="text-amber-400" /> Agent Leaderboard</div>
        <div className="space-y-2">
          {team.map((t, i) => (
            <div key={t.name} className="flex items-center gap-3 border border-slate-800 rounded-lg p-3">
              <div className="w-6 text-center text-xs text-slate-500 font-mono">{i + 1}</div>
              <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-semibold">{initials(t.name)}</div>
              <div className="flex-1">
                <div className="text-sm text-white">{t.name}</div>
                <div className="text-[11px] text-slate-500">{t.booked} orders booked</div>
              </div>
              <div className="text-emerald-400 font-mono text-sm">{money(t.profit)}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {team.map(t => (
          <Card key={t.name} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 font-semibold">{initials(t.name)}</div>
              <div className="text-sm text-white font-medium">{t.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><div className="text-slate-500">Booked</div><div className="text-white font-mono mt-0.5">{t.booked}</div></div>
              <div><div className="text-slate-500">Revenue</div><div className="text-white font-mono mt-0.5">{money(t.revenue)}</div></div>
              <div><div className="text-slate-500">Carrier Pay</div><div className="text-white font-mono mt-0.5">{money(t.carrierPay)}</div></div>
              <div><div className="text-slate-500">Profit</div><div className="text-emerald-400 font-mono mt-0.5">{money(t.profit)}</div></div>
              <div><div className="text-slate-500">Weekly</div><div className="text-white font-mono mt-0.5">{money(t.weekly)}</div></div>
              <div><div className="text-slate-500">Monthly</div><div className="text-white font-mono mt-0.5">{money(t.monthly)}</div></div>
            </div>
            <div className="mt-3">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${Math.min(100, (t.profit / (TEAM_GOAL / 4)) * 100)}%` }} />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">vs individual share of team goal</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================== SETTINGS ============================== */

function SettingsView({ role }) {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-white text-lg font-semibold">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account and workspace preferences.</p>
      </div>
      <Card className="p-5 space-y-4">
        <div className="text-sm text-white font-medium">Profile</div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-slate-400 mb-1 block">Full Name</label><input defaultValue="" placeholder="Your name" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500" /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Role</label><input readOnly value={role} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400" /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Email</label><input placeholder="you@eminentventures.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500" /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">Phone</label><input placeholder="(555) 555-5555" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-teal-500" /></div>
        </div>
      </Card>
      <Card className="p-5 space-y-3">
        <div className="text-sm text-white font-medium">Notifications</div>
        {["New order created", "Carrier assigned", "Payment received", "Document signed"].map(n => (
          <label key={n} className="flex items-center justify-between text-sm text-slate-300">
            {n}
            <input type="checkbox" defaultChecked className="accent-teal-500" />
          </label>
        ))}
      </Card>
      <Card className="p-5 space-y-3">
        <div className="text-sm text-white font-medium flex items-center gap-2"><Fingerprint size={15} className="text-teal-400" /> Security</div>
        <button className="text-xs px-3 py-2 rounded-lg border border-slate-800 text-slate-300 hover:border-slate-600">Change password</button>
        <button className="text-xs px-3 py-2 rounded-lg border border-slate-800 text-slate-300 hover:border-slate-600 ml-2">Enable two-factor authentication</button>
      </Card>
    </div>
  );
}

/* ============================== APP ============================== */

export default function App() {
  const [role, setRole] = useState(null);
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState(seedOrders);
  const [carriers] = useState(seedCarriers);
  const [drivers] = useState(seedDrivers);

  if (!role) return <LoginScreen onLogin={setRole} />;

  const pageTitle = NAV.find(n => n.key === view)?.label;

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 font-sans">
      <Sidebar view={view} setView={setView} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar role={role} onMenu={() => setSidebarOpen(true)} onLogout={() => setRole(null)} />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {view === "dashboard" && <Dashboard orders={orders} />}
          {view === "orders" && <OrdersView orders={orders} setOrders={setOrders} />}
          {view === "dispatch" && <DispatchView orders={orders} setOrders={setOrders} carriers={carriers} />}
          {view === "shippers" && <ShippersView orders={orders} />}
          {view === "carriers" && <CarriersView carriers={carriers} />}
          {view === "drivers" && <DriversView drivers={drivers} />}
          {view === "documents" && <DocumentsView orders={orders} />}
          {view === "invoices" && <InvoicesView orders={orders} />}
          {view === "payments" && <PaymentsView orders={orders} />}
          {view === "reports" && <ReportsView orders={orders} />}
          {view === "team" && <TeamView orders={orders} />}
          {view === "settings" && <SettingsView role={role} />}
        </main>
      </div>
    </div>
  );
}
