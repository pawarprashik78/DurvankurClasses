import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { api, getUserName, getLinkedId } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users, UserCheck, DollarSign, BookOpen, MessageSquare,
  ClipboardList, TrendingUp, Bell, CheckCircle2, XCircle,
  GraduationCap, Calendar, FileText, Trophy, ArrowRight,
  AlertTriangle, ClipboardCheck, Star, Percent,
} from "lucide-react";

// ── tiny recharts-free bar using CSS ──────────────────────────
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({
  title, value, sub, icon: Icon, gradient, link,
}: { title: string; value: string | number; sub?: string; icon: any; gradient: string; link?: string }) {
  const inner = (
    <Card className={`${gradient} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <Icon className="w-5 h-5" />
          </div>
          {link && <ArrowRight className="w-4 h-4 opacity-70" />}
        </div>
        <p className="text-3xl font-extrabold">{value}</p>
        <p className="text-sm font-semibold mt-0.5 opacity-90">{title}</p>
        {sub && <p className="text-xs mt-1 opacity-70">{sub}</p>}
      </CardContent>
    </Card>
  );
  return link ? <Link href={link}>{inner}</Link> : inner;
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
function AdminDashboard() {
  const { data: statsData } = useQuery({ queryKey: ["/api/dashboard/stats"], queryFn: () => api.get<any>("/dashboard/stats") });
  const { data: studentsData } = useQuery({ queryKey: ["/api/students"], queryFn: () => api.get<any[]>("/students") });
  const { data: feesData } = useQuery({ queryKey: ["/api/fees"], queryFn: () => api.get<any[]>("/fees") });
  const { data: testsData } = useQuery({ queryKey: ["/api/tests"], queryFn: () => api.get<any[]>("/tests") });

  const students = studentsData || [];
  const fees = feesData || [];
  const tests = testsData || [];

  const paidFees = fees.filter((f: any) => f.status === "paid").length;
  const pendingFees = fees.filter((f: any) => f.status === "pending").length;
  const totalFeeAmt = fees.reduce((s: number, f: any) => s + parseFloat(f.amount || 0), 0);
  const collectedAmt = fees.reduce((s: number, f: any) => s + parseFloat(f.paidAmount || 0), 0);
  const collectionPct = totalFeeAmt > 0 ? Math.round((collectedAmt / totalFeeAmt) * 100) : (statsData?.feeCollectionPercentage ?? 0);

  const upcoming = tests.filter((t: any) => t.status === "upcoming");
  const subjectPerf = [
    { name: "Mathematics", avg: 88, color: "bg-blue-500" },
    { name: "Science", avg: 79, color: "bg-green-500" },
    { name: "English", avg: 88, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-900 to-purple-900 p-7 text-white">
        <div className="relative z-10">
          <p className="text-indigo-300 text-sm font-medium mb-1">Welcome back, Admin</p>
          <h1 className="text-3xl font-extrabold">Institute Overview</h1>
          <p className="text-slate-300 mt-1 text-sm">Durvankur Classes — Academic Year 2025-26</p>
        </div>
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -right-24 w-72 h-72 bg-white/5 rounded-full" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} sub="Active enrollments" icon={Users} gradient="bg-gradient-to-br from-blue-500 to-blue-700" link="/attendance" />
        <StatCard title="Fee Collection" value={`${collectionPct}%`} sub={`₹${collectedAmt.toLocaleString("en-IN")} collected`} icon={DollarSign} gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" link="/fees" />
        <StatCard title="Upcoming Tests" value={upcoming.length} sub="Scheduled tests" icon={ClipboardList} gradient="bg-gradient-to-br from-violet-500 to-violet-700" link="/tests" />
        <StatCard title="Pending Fees" value={pendingFees} sub={`${paidFees} paid this month`} icon={AlertTriangle} gradient="bg-gradient-to-br from-rose-500 to-rose-700" link="/fees" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5 text-primary" /> Subject-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectPerf.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className={`font-bold text-foreground`}>{s.avg}%</span>
                </div>
                <MiniBar value={s.avg} max={100} color={s.color} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fee Summary */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="w-5 h-5 text-primary" /> Fee Collection Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Billed</span>
                <span className="font-semibold">₹{totalFeeAmt.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Collected</span>
                <span className="font-semibold text-emerald-600">₹{collectedAmt.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-semibold text-rose-600">₹{(totalFeeAmt - collectedAmt).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <MiniBar value={collectedAmt} max={totalFeeAmt} color="bg-emerald-500" />
            <p className="text-xs text-muted-foreground">{collectionPct}% fees collected this academic year</p>
            <Link href="/fees">
              <Button variant="outline" size="sm" className="w-full">View All Fee Records <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </CardContent>
        </Card>

        {/* Student List Quick View */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-5 h-5 text-primary" /> Student Roster
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      {s.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.standard} • {s.rollNumber}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">{s.standard}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tests */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-primary" /> Upcoming Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-6">No upcoming tests</p>
              ) : upcoming.map((t: any) => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <ClipboardList className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.standard} • {t.totalMarks} marks</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">{t.testDate}</Badge>
                </div>
              ))}
            </div>
            <Link href="/tests">
              <Button variant="outline" size="sm" className="w-full mt-4">Manage Tests <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TEACHER DASHBOARD
// ═══════════════════════════════════════════════════════════════
function TeacherDashboard() {
  const { data: studentsData } = useQuery({ queryKey: ["/api/students"], queryFn: () => api.get<any[]>("/students") });
  const { data: testsData } = useQuery({ queryKey: ["/api/tests"], queryFn: () => api.get<any[]>("/tests") });
  const { data: notesData } = useQuery({ queryKey: ["/api/notes", {}], queryFn: () => api.get<any[]>("/notes") });
  const { data: messagesData } = useQuery({ queryKey: ["/api/messages"], queryFn: () => api.get<any[]>("/messages") });
  const students = studentsData || [];
  const tests = testsData || [];
  const notes = notesData || [];
  const messages = messagesData || [];
  const upcoming = tests.filter((t: any) => t.status === "upcoming");
  const unread = messages.filter((m: any) => !m.isRead);

  const subjectPerf = [
    { name: "Mathematics", avg: 88, students: 3, color: "bg-blue-500" },
    { name: "Science", avg: 79, students: 3, color: "bg-green-500" },
    { name: "English", avg: 88, students: 3, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-700 to-blue-800 p-7 text-white">
        <div className="relative z-10">
          <p className="text-teal-200 text-sm font-medium mb-1">Good evening, Teacher</p>
          <h1 className="text-3xl font-extrabold">Teaching Dashboard</h1>
          <p className="text-slate-300 mt-1 text-sm">Manage classes, notes and student progress</p>
        </div>
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Students" value={students.length} icon={Users} gradient="bg-gradient-to-br from-blue-500 to-blue-700" link="/attendance" />
        <StatCard title="Tests Scheduled" value={upcoming.length} sub="Upcoming tests" icon={ClipboardList} gradient="bg-gradient-to-br from-violet-500 to-violet-700" link="/tests" />
        <StatCard title="Notes Uploaded" value={notes.length} icon={BookOpen} gradient="bg-gradient-to-br from-amber-500 to-amber-700" link="/notes" />
        <StatCard title="Unread Messages" value={unread.length} icon={MessageSquare} gradient="bg-gradient-to-br from-rose-500 to-rose-700" link="/messages" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Performance */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5 text-primary" /> Class Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectPerf.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className="font-bold">{s.avg}% avg</span>
                </div>
                <MiniBar value={s.avg} max={100} color={s.color} />
                <p className="text-xs text-muted-foreground">{s.students} students tested</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student Progress Quick View */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="w-5 h-5 text-primary" /> Student Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {students.map((s: any, i: number) => {
              const avgMarks = [81.5, 92, 88][i] || 80;
              const attendance = [80, 100, 50][i] || 75;
              return (
                <div key={s.id} className="p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {s.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{avgMarks}%</p>
                      <p className="text-xs text-muted-foreground">avg marks</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Marks</p>
                      <MiniBar value={avgMarks} max={100} color="bg-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Attendance {attendance}%</p>
                      <MiniBar value={attendance} max={100} color={attendance >= 75 ? "bg-green-500" : "bg-red-500"} />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Upcoming Tests */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-primary" /> Upcoming Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <div className="p-2 bg-violet-100 rounded-lg"><ClipboardList className="w-4 h-4 text-violet-600" /></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.standard} • {t.totalMarks} marks</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">{t.testDate}</Badge>
              </div>
            ))}
            <Link href="/tests"><Button variant="outline" size="sm" className="w-full mt-2">View Tests <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="w-5 h-5 text-primary" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: "Mark Attendance", icon: ClipboardCheck, href: "/attendance", color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" },
              { label: "Add Marks", icon: FileText, href: "/marks", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
              { label: "Upload Notes", icon: BookOpen, href: "/notes", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
              { label: "Schedule Test", icon: Calendar, href: "/tests", color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" },
              { label: "Send Message", icon: MessageSquare, href: "/messages", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
              { label: "View Progress", icon: TrendingUp, href: "/progress", color: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100" },
            ].map((a) => (
              <Link key={a.href} href={a.href}>
                <button className={`w-full flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${a.color}`}>
                  <a.icon className="w-4 h-4" /> {a.label}
                </button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PARENT DASHBOARD
// ═══════════════════════════════════════════════════════════════
function ParentDashboard() {
  const { data: monthlyData } = useQuery({ queryKey: ["/api/attendance/monthly"], queryFn: () => api.get<any[]>("/attendance/monthly") });
  const { data: testResultsData } = useQuery({ queryKey: ["/api/test-results"], queryFn: () => api.get<any[]>("/test-results") });
  const { data: absenceData } = useQuery({ queryKey: ["/api/notifications/absence"], queryFn: () => api.get<any[]>("/notifications/absence") });
  const { data: feesData } = useQuery({ queryKey: ["/api/fees"], queryFn: () => api.get<any[]>("/fees") });
  const monthly = monthlyData || [];
  const testResults = testResultsData || [];
  const absenceNotifs = absenceData || [];
  const fees = feesData || [];

  const studentName = getUserName() || "Student";
  const lastMonth = monthly[monthly.length - 1];
  const unreadNotifs = absenceNotifs.filter((n: any) => !n.isRead);
  const pendingFees = fees.filter((f: any) => f.status === "pending" || f.status === "partial");
  const pendingAmt = pendingFees.reduce((s: number, f: any) => s + parseFloat(f.amount || 0) - parseFloat(f.paidAmount || 0), 0);
  const avgMark = testResults.length > 0
    ? (testResults.reduce((s: number, r: any) => s + (r.marksObtained / r.totalMarks) * 100, 0) / testResults.length).toFixed(0)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-rose-600 to-red-700 p-7 text-white">
        <div className="relative z-10">
          <p className="text-pink-200 text-sm font-medium mb-1">Welcome, Parent</p>
          <h1 className="text-3xl font-extrabold">{studentName}'s Progress</h1>
          <p className="text-pink-100 mt-1 text-sm">Your child's academic overview</p>
        </div>
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full" />
      </div>

      {/* Absence Alert */}
      {unreadNotifs.length > 0 && (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-red-200 bg-red-50">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Absence Alert</p>
            {unreadNotifs.map((n: any) => <p key={n.id} className="text-sm text-red-700 mt-0.5">{n.message}</p>)}
          </div>
          <Link href="/attendance"><Button size="sm" variant="outline" className="shrink-0 border-red-300 text-red-700 hover:bg-red-100">View <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value={`${lastMonth?.percentage ?? 0}%`} sub={`${lastMonth?.month ?? ""} ${lastMonth?.year ?? ""}`} icon={ClipboardCheck} gradient="bg-gradient-to-br from-green-500 to-green-700" link="/attendance" />
        <StatCard title="Avg Marks" value={`${avgMark}%`} sub="Across all subjects" icon={Percent} gradient="bg-gradient-to-br from-blue-500 to-blue-700" link="/test-results" />
        <StatCard title="Pending Fees" value={`₹${pendingAmt.toLocaleString("en-IN")}`} sub={`${pendingFees.length} month(s) due`} icon={DollarSign} gradient={pendingAmt > 0 ? "bg-gradient-to-br from-rose-500 to-rose-700" : "bg-gradient-to-br from-emerald-500 to-emerald-700"} link="/fees" />
        <StatCard title="Notifications" value={unreadNotifs.length} sub="Unread alerts" icon={Bell} gradient="bg-gradient-to-br from-amber-500 to-amber-700" link="/attendance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Attendance */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-primary" /> Monthly Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthly.slice(-4).map((m: any) => (
              <div key={`${m.month}-${m.year}`} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{m.month} {m.year}</span>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span className="text-green-600 font-semibold">✓{m.present}</span>
                    <span className="text-red-500 font-semibold">✗{m.absent}</span>
                    <Badge className={`text-xs ${m.percentage >= 90 ? "bg-green-100 text-green-800" : m.percentage >= 75 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                      {m.percentage}%
                    </Badge>
                  </div>
                </div>
                <MiniBar value={m.percentage} max={100} color={m.percentage >= 90 ? "bg-green-500" : m.percentage >= 75 ? "bg-yellow-500" : "bg-red-500"} />
              </div>
            ))}
            <Link href="/attendance"><Button variant="outline" size="sm" className="w-full mt-2">Detailed View <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </CardContent>
        </Card>

        {/* Recent Test Results */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="w-5 h-5 text-primary" /> Recent Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {testResults.slice(0, 4).map((r: any) => {
              const pct = Math.round((r.marksObtained / r.totalMarks) * 100);
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${r.grade === "A+" ? "bg-emerald-100 text-emerald-700" :
                      r.grade === "A" ? "bg-green-100 text-green-700" :
                        r.grade.startsWith("B") ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                    }`}>{r.grade}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{r.testName}</p>
                    <p className="text-xs text-muted-foreground">{r.subjectName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{r.marksObtained}/{r.totalMarks}</p>
                    <p className="text-xs text-muted-foreground">{pct}%</p>
                  </div>
                </div>
              );
            })}
            <Link href="/test-results"><Button variant="outline" size="sm" className="w-full mt-2">All Results <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </CardContent>
        </Card>

        {/* Fee Status */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="w-5 h-5 text-primary" /> Fee Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {fees.slice(0, 6).map((f: any) => (
                <div key={f.id} className={`p-3 rounded-xl border text-center ${f.status === "paid" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <p className="text-xs font-semibold text-muted-foreground">{f.month}</p>
                  <p className="text-base font-bold mt-0.5">{f.status === "paid" ? "✓ Paid" : "⚠ Pending"}</p>
                  <p className="text-xs text-muted-foreground">₹{f.amount}</p>
                </div>
              ))}
            </div>
            <Link href="/fees"><Button variant="outline" size="sm" className="w-full">View Fee Details <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Star className="w-5 h-5 text-primary" /> Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: "Attendance", icon: ClipboardCheck, href: "/attendance", color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" },
              { label: "Test Results", icon: GraduationCap, href: "/test-results", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
              { label: "Study Notes", icon: BookOpen, href: "/notes", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
              { label: "Achievements", icon: Trophy, href: "/achievements", color: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100" },
              { label: "Fees", icon: DollarSign, href: "/fees", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
              { label: "Messages", icon: MessageSquare, href: "/messages", color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" },
            ].map((a) => (
              <Link key={a.href} href={a.href}>
                <button className={`w-full flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${a.color}`}>
                  <a.icon className="w-4 h-4" /> {a.label}
                </button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STUDENT DASHBOARD
// ═══════════════════════════════════════════════════════════════
function StudentDashboard() {
  const { data: weeklyData } = useQuery({ queryKey: ["/api/attendance/weekly"], queryFn: () => api.get<any[]>("/attendance/weekly") });
  const { data: testResultsData } = useQuery({ queryKey: ["/api/test-results"], queryFn: () => api.get<any[]>("/test-results") });
  const { data: testsData } = useQuery({ queryKey: ["/api/tests"], queryFn: () => api.get<any[]>("/tests") });
  const { data: notesData } = useQuery({ queryKey: ["/api/notes", {}], queryFn: () => api.get<any[]>("/notes") });
  const weekly = weeklyData || [];
  const testResults = testResultsData || [];
  const tests = testsData || [];
  const notes = notesData || [];
  const studentName = getUserName() || "Student";
  const upcoming = tests.filter((t: any) => t.status === "upcoming");
  const avgMark = testResults.length > 0
    ? (testResults.reduce((s: number, r: any) => s + (r.marksObtained / r.totalMarks) * 100, 0) / testResults.length).toFixed(0)
    : 0;
  const presentDays = weekly.filter((d: any) => d.status === "present").length;
  const attendancePct = weekly.length > 0 ? Math.round((presentDays / weekly.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-600 p-7 text-white">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1">Hello, Student 👋</p>
          <h1 className="text-3xl font-extrabold">{studentName}</h1>
          <p className="text-blue-100 mt-1 text-sm">Welcome back to your dashboard</p>
          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold">{avgMark}%</p>
              <p className="text-xs text-blue-200">Avg Marks</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-extrabold">{attendancePct}%</p>
              <p className="text-xs text-blue-200">Attendance</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-extrabold">{upcoming.length}</p>
              <p className="text-xs text-blue-200">Upcoming Tests</p>
            </div>
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full" />
      </div>

      {/* Weekly Attendance */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-5 h-5 text-primary" /> This Week's Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {weekly.map((d: any) => (
              <div key={d.date} className={`rounded-xl p-3 text-center flex flex-col items-center gap-1.5 border transition-all ${d.status === "present" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-bold text-muted-foreground">{d.day}</p>
                {d.status === "present"
                  ? <CheckCircle2 className="w-6 h-6 text-green-500" />
                  : <XCircle className="w-6 h-6 text-red-500" />}
                <p className={`text-xs font-semibold ${d.status === "present" ? "text-green-700" : "text-red-600"}`}>{d.status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Test Results */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-5 h-5 text-primary" /> Recent Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {testResults.slice(0, 4).map((r: any) => {
              const pct = Math.round((r.marksObtained / r.totalMarks) * 100);
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${r.grade === "A+" ? "bg-emerald-100 text-emerald-700" : r.grade === "A" ? "bg-green-100 text-green-700" : r.grade.startsWith("B") ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{r.grade}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{r.testName}</p>
                    <p className="text-xs text-muted-foreground">{r.subjectName} • {r.term}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{r.marksObtained}/{r.totalMarks}</p>
                    <p className="text-xs text-muted-foreground">{pct}%</p>
                  </div>
                </div>
              );
            })}
            <Link href="/test-results"><Button variant="outline" size="sm" className="w-full mt-2">All Results <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </CardContent>
        </Card>

        {/* Upcoming Tests */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="w-5 h-5 text-primary" /> Upcoming Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No upcoming tests! 🎉</p>
            ) : upcoming.map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="w-4 h-4 text-blue-600" /></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.standard} • {t.totalMarks} marks</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">{t.testDate}</Badge>
              </div>
            ))}
            <Link href="/tests"><Button variant="outline" size="sm" className="w-full mt-2">View All Tests <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </CardContent>
        </Card>

        {/* Quick Access to Notes */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="w-5 h-5 text-primary" /> Study Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.slice(0, 3).map((n: any) => {
              const typeIcon = n.type === "video" ? "🎥" : n.type === "ppt" ? "📊" : "📝";
              return (
                <div key={n.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors cursor-pointer">
                  <span className="text-xl">{typeIcon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold line-clamp-1">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.subjectName} • {n.teacherName}</p>
                  </div>
                </div>
              );
            })}
            <Link href="/notes"><Button variant="outline" size="sm" className="w-full mt-2">All Study Notes <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Star className="w-5 h-5 text-primary" /> Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: "My Attendance", icon: ClipboardCheck, href: "/attendance", color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" },
              { label: "Test Results", icon: GraduationCap, href: "/test-results", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
              { label: "Study Notes", icon: BookOpen, href: "/notes", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
              { label: "Achievements", icon: Trophy, href: "/achievements", color: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100" },
              { label: "Progress", icon: TrendingUp, href: "/progress", color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" },
              { label: "Tests", icon: ClipboardList, href: "/tests", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
            ].map((a) => (
              <Link key={a.href} href={a.href}>
                <button className={`w-full flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${a.color}`}>
                  <a.icon className="w-4 h-4" /> {a.label}
                </button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [, setLocation] = useLocation();
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (!role) setLocation("/login");
  }, [role, setLocation]);

  if (!role) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <main className="flex-1 ml-64 mt-16 p-8">
        {role === "admin" && <AdminDashboard />}
        {role === "teacher" && <TeacherDashboard />}
        {role === "parent" && <ParentDashboard />}
        {role === "student" && <StudentDashboard />}
      </main>
    </div>
  );
}
