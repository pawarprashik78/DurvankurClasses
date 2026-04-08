import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Award, Users, BookOpen, TrendingUp, ArrowRight, CheckCircle,
  GraduationCap, Star, MapPin, Phone, Mail, ChevronRight,
  ClipboardList, MessageSquare, BarChart3, Shield
} from "lucide-react";

export default function Home() {
  const stats = [
    { value: "500+", label: "Active Students", icon: Users, color: "from-blue-500 to-cyan-400" },
    { value: "95%",  label: "Success Rate",    icon: Award, color: "from-emerald-500 to-teal-400" },
    { value: "10+",  label: "Years of Excellence", icon: TrendingUp, color: "from-violet-500 to-purple-400" },
    { value: "15+",  label: "Subjects Covered", icon: BookOpen, color: "from-amber-500 to-orange-400" },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Expert Faculty",
      desc: "Experienced educators with deep subject expertise and a passion for student success.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      desc: "Real-time marks, attendance, and performance analytics visible to students and parents.",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      desc: "Instant announcements from teachers to students and parents via the digital portal.",
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      icon: ClipboardList,
      title: "Digital Attendance",
      desc: "Automated attendance system with parent SMS/email alerts for every absence.",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      icon: Shield,
      title: "Secure Portal",
      desc: "Role-based access for Admins, Teachers, Students, and Parents — all data private.",
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      icon: Star,
      title: "Hall of Fame",
      desc: "Top performers recognised every batch with detailed achievement leaderboards.",
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
  ];

  const subjects = [
    "Mathematics", "Science & Technology I", "Science & Technology II",
    "Social Science", "English", "Marathi", "Hindi", "Sanskrit",
  ];

  const portalRoles = [
    { role: "Teacher", color: "border-blue-400 bg-blue-50 dark:bg-blue-900/20",    text: "text-blue-600 dark:text-blue-400",  perks: ["Mark daily attendance", "Upload study notes", "Post announcements"] },
    { role: "Student", color: "border-green-400 bg-green-50 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400", perks: ["View own marks & attendance", "Download study notes", "Check test schedule"] },
    { role: "Parent",  color: "border-amber-400 bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", perks: ["Track child's progress", "Receive absence alerts", "View fee status"] },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 overflow-hidden">
        {/* animated background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-sm font-medium text-primary">Now with Digital Management Portal</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground mb-6">
            Shape Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-secondary">
              Future
            </span>
            {" "}with<br />
            <span className="relative">
              Durvankar Classes
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10 Q150 2 298 10" stroke="url(#underline)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="underline" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
            Founded by <strong className="text-foreground">Priyanka Tambat</strong>, Durvankar Classes delivers
            personalized coaching with a cutting-edge digital portal for students, parents &amp; teachers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-13 px-8 rounded-xl text-base font-semibold shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 group">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-13 px-8 rounded-xl text-base font-semibold border-2 hover:-translate-y-0.5 transition-all duration-200">
                Access Portal
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* trust row */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {["No registration fee", "Digital progress tracking", "Instant parent alerts"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="py-14 bg-gradient-to-r from-primary via-violet-600 to-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="text-center text-white">
                <div className={`inline-flex p-3 rounded-2xl bg-white/20 mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-extrabold">{value}</div>
                <div className="text-sm opacity-80 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Everything You Need to Excel</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A complete ecosystem for students, parents, and teachers — all under one digital roof.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="group rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">
                <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Curriculum</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Subjects We Cover</h2>
            <p className="text-muted-foreground">Complete 10th standard syllabus with focused test preparation</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {subjects.map(sub => (
              <span key={sub} className="px-5 py-2.5 rounded-full border-2 border-primary/30 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-default">
                {sub}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTAL ROLES ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Digital Portal</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">One Portal, Three Roles</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Tailored dashboards for every stakeholder — secure, real-time, and mobile-friendly.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {portalRoles.map(({ role, color, text, perks }) => (
              <div key={role} className={`rounded-2xl border-2 ${color} p-6 hover:-translate-y-1 transition-all duration-300`}>
                <h3 className={`text-xl font-extrabold mb-4 ${text}`}>{role}</h3>
                <ul className="space-y-2">
                  {perks.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${text}`} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #4f46e5 100%)",
          padding: "96px 16px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            Ready to Join Durvankar Classes?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1.125rem", marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            Register today and get instant access to the student portal — track marks, attendance, notes, and much more.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            <Link href="/register">
              <button
                style={{
                  background: "#fff", color: "#6d28d9", border: "none",
                  padding: "14px 36px", borderRadius: 12, fontSize: "1rem",
                  fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  display: "flex", alignItems: "center", gap: 8, transition: "transform 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                Register Now <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/login">
              <button
                style={{
                  background: "transparent", color: "#fff",
                  border: "2px solid rgba(255,255,255,0.7)",
                  padding: "14px 36px", borderRadius: 12, fontSize: "1rem",
                  fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, transition: "transform 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; }}
              >
                Already Enrolled? Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <section className="py-10 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Dwarka, Nashik</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91-9325866940</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> durvankarclasses@gmail.com</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-6 bg-muted/40 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© 2024–25 <strong className="text-foreground">Durvankar Classes</strong>. Founded by <strong className="text-foreground">Priyanka Tambat</strong>. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link href="/register" className="hover:text-primary transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
