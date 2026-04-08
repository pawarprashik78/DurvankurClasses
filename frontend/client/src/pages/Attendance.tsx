import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAttendance, useCreateAttendance, useAttendanceWeekly, useAttendanceMonthly, useAbsenceNotifications } from "@/hooks/use-attendance";
import { useStudents } from "@/hooks/use-students";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck, Plus, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format, parse, isValid } from "date-fns";

// Format date: "2024-04-07" → "07-Apr-2024"
function formatDate(d: string) {
  if (!d) return "-";
  try {
    const parsed = parse(d, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? format(parsed, "dd-MMM-yyyy") : d;
  } catch { return d; }
}

function StatusBadge({ status }: { status: string }) {
  if (status === "present") return <Badge className="bg-green-100 text-green-800 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3" />Present</Badge>;
  if (status === "absent")  return <Badge className="bg-red-100 text-red-800 border-red-200 gap-1"><XCircle className="w-3 h-3" />Absent</Badge>;
  return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1"><Clock className="w-3 h-3" />Late</Badge>;
}

export default function Attendance() {
  const [, setLocation] = useLocation();
  const role = localStorage.getItem("userRole");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: attendanceData, isLoading } = useAttendance();
  const { data: students } = useStudents();
  const createAttendance = useCreateAttendance();

  const [formData, setFormData] = useState({
    studentId: "", date: format(new Date(), "yyyy-MM-dd"), status: "present", remarks: "",
  });

  useEffect(() => { if (!role) setLocation("/login"); }, [role, setLocation]);
  if (!role) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAttendance.mutateAsync({
        studentId: formData.studentId,
        date: formData.date, status: formData.status,
        remarks: formData.remarks || undefined,
      });
      toast({ title: "✅ Attendance Marked", description: `Marked ${formData.status} — email sent to parent if absent.` });
      setDialogOpen(false);
      setFormData({ studentId: "", date: format(new Date(), "yyyy-MM-dd"), status: "present", remarks: "" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    }
  };

  // Build student name lookup
  const studentMap: Record<string, string> = {};
  (students || []).forEach((s: any) => { studentMap[s.id] = s.name; });

  // Parent / Student personal view
  const isParentOrStudent = role === "parent" || role === "student";
  const { data: weeklyData } = useAttendanceWeekly();
  const { data: monthlyData } = useAttendanceMonthly();
  const { data: absenceNotifs } = useAbsenceNotifications();

  const weekly  = (weeklyData  || []) as any[];
  const monthly = (monthlyData || []) as any[];
  const notifs  = (absenceNotifs || []) as any[];
  const unread  = notifs.filter((n: any) => !n.isRead).length;

  if (isParentOrStudent) {
    const total   = monthly.length;
    const present = monthly.filter((a: any) => a.status === "present").length;
    const absent  = monthly.filter((a: any) => a.status === "absent").length;
    const pct     = total > 0 ? Math.round((present / total) * 100) : 0;

    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role={role} />
        <main className="flex-1 ml-64 mt-16 p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
              <p className="text-muted-foreground mt-1">Your attendance record</p>
            </div>

            {unread > 0 && (
              <div className="flex items-start gap-4 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300">⚠️ {unread} Absence Alert{unread > 1 ? "s" : ""}</p>
                  <p className="text-sm text-red-600 dark:text-red-400">Parent email notifications have been sent.</p>
                </div>
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Classes", value: total, color: "from-blue-500 to-blue-600" },
                { label: "Present",       value: present, color: "from-green-500 to-green-600" },
                { label: "Absent",        value: absent,  color: "from-red-500 to-red-600" },
              ].map(s => (
                <Card key={s.label} className={`bg-gradient-to-br ${s.color} text-white border-0`}>
                  <CardContent className="p-5 text-center">
                    <p className="text-4xl font-extrabold">{s.value}</p>
                    <p className="text-sm opacity-90 mt-1">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Attendance % */}
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <span className="font-semibold text-foreground">Attendance Percentage</span>
                <span className={`text-2xl font-extrabold ${pct >= 75 ? "text-green-600" : "text-red-600"}`}>{pct}%</span>
              </CardContent>
            </Card>

            {/* Recent Records */}
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Recent Attendance (Last 7 Days)</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow className="bg-muted/30">
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {weekly.length === 0
                      ? <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No records found</TableCell></TableRow>
                      : weekly.map((a: any) => (
                        <TableRow key={a.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium">{formatDate(a.date)}</TableCell>
                          <TableCell><StatusBadge status={a.status} /></TableCell>
                          <TableCell className="text-muted-foreground">{a.remarks || "—"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Admin / Teacher view
  const records = (attendanceData || []) as any[];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
              <p className="text-muted-foreground mt-1">Mark and monitor student attendance</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-lg gap-2">
                  <Plus className="w-4 h-4" /> Mark Attendance
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Mark Attendance</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Student *</Label>
                    <Select value={formData.studentId} onValueChange={v => setFormData({ ...formData, studentId: v })}>
                      <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                      <SelectContent>
                        {(students || []).map((s: any) => (
                          <SelectItem key={s.id} value={s.id}>{s.name} — {s.rollNumber}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent (sends email to parent)</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Remarks</Label>
                    <Input placeholder="Optional remarks" value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
                  </div>
                  <Button type="submit" disabled={createAttendance.isPending || !formData.studentId} className="w-full">
                    {createAttendance.isPending ? "Saving..." : "Save Attendance"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading attendance records…</p>
          ) : (
            <Card className="shadow-lg">
              <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck className="w-5 h-5" />All Attendance Records</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow className="bg-muted/30">
                    <TableHead>Student Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {records.length === 0
                      ? <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10">No attendance records yet. Mark the first one!</TableCell></TableRow>
                      : records.map((a: any) => (
                        <TableRow key={a.id} className="hover:bg-muted/20">
                          <TableCell className="font-semibold">{studentMap[a.studentId] || a.studentId}</TableCell>
                          <TableCell>{formatDate(a.date)}</TableCell>
                          <TableCell><StatusBadge status={a.status} /></TableCell>
                          <TableCell className="text-muted-foreground">{a.remarks || "—"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
