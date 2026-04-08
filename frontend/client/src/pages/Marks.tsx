import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMarks, useCreateMark } from "@/hooks/use-marks";
import { useStudents } from "@/hooks/use-students";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, TrendingUp, BookOpen } from "lucide-react";
import { format } from "date-fns";

/** Durvankar standard subject list */
export const SUBJECTS = [
  { id: "MATH", name: "Mathematics",            detail: "Algebra & Geometry" },
  { id: "SCI1", name: "Science & Technology I", detail: "Physics & Chemistry" },
  { id: "SCI2", name: "Science & Technology II",detail: "Biology & Environment" },
  { id: "SS",   name: "Social Science",          detail: "History, Civics & Geography" },
  { id: "ENG",  name: "English",                 detail: "Language & Literature" },
  { id: "MAR",  name: "Marathi",                 detail: "Optional Language" },
  { id: "HIN",  name: "Hindi",                   detail: "Optional Language" },
  { id: "SAN",  name: "Sanskrit",                detail: "Optional Language" },
];

function GradeBadge({ pct }: { pct: number }) {
  if (pct >= 90) return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">A+</Badge>;
  if (pct >= 80) return <Badge className="bg-green-100 text-green-800 border-green-200">A</Badge>;
  if (pct >= 70) return <Badge className="bg-blue-100 text-blue-800 border-blue-200">B+</Badge>;
  if (pct >= 60) return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">B</Badge>;
  if (pct >= 50) return <Badge className="bg-orange-100 text-orange-800 border-orange-200">C</Badge>;
  return <Badge className="bg-red-100 text-red-800 border-red-200">D</Badge>;
}

export default function Marks() {
  const [, setLocation] = useLocation();
  const role = localStorage.getItem("userRole");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const { data: marksData, isLoading } = useMarks();
  const { data: students } = useStudents();
  const createMark = useCreateMark();

  const [formData, setFormData] = useState({
    studentId: "", subjectId: "", testName: "",
    testType: "class_test",
    marksObtained: "", totalMarks: "100",
    testDate: format(new Date(), "yyyy-MM-dd"), remarks: "",
  });

  useEffect(() => { if (!role) setLocation("/login"); }, [role, setLocation]);
  if (!role) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMark.mutateAsync({
        studentId: formData.studentId,
        subjectId: formData.subjectId,
        subjectName: SUBJECTS.find(s => s.id === formData.subjectId)?.name || formData.subjectId,
        testName: formData.testName,
        testType: formData.testType,
        marksObtained: parseFloat(formData.marksObtained),
        totalMarks: parseFloat(formData.totalMarks),
        testDate: formData.testDate,
        remarks: formData.remarks || undefined,
      });
      toast({ title: "✅ Marks Saved", description: `${formData.testType === "class_test" ? "Class Test" : "College Test"} marks recorded.` });
      setDialogOpen(false);
      setFormData({ studentId: "", subjectId: "", testName: "", testType: "class_test", marksObtained: "", totalMarks: "100", testDate: format(new Date(), "yyyy-MM-dd"), remarks: "" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    }
  };

  const studentMap: Record<string, string> = {};
  (students || []).forEach((s: any) => { studentMap[s.id] = s.name; });

  const allMarks = (marksData || []) as any[];
  const filtered = allMarks.filter((m: any) => {
    const subMatch = filterSubject === "all" || m.subjectId === filterSubject;
    const typeMatch = filterType === "all" || m.testType === filterType;
    return subMatch && typeMatch;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Marks & Results</h1>
              <p className="text-muted-foreground mt-1">View marks across all subjects — Class Tests & College Tests</p>
            </div>
            {(role === "admin" || role === "teacher") && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-lg gap-2"><Plus className="w-4 h-4" />Add Marks</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader><DialogTitle>Enter Marks</DialogTitle></DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Student *</Label>
                      <Select value={formData.studentId} onValueChange={v => setFormData({ ...formData, studentId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                        <SelectContent>{(students || []).map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject *</Label>
                      <Select value={formData.subjectId} onValueChange={v => setFormData({ ...formData, subjectId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} <span className="text-muted-foreground text-xs">({s.detail})</span></SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Test Type *</Label>
                      <Select value={formData.testType} onValueChange={v => setFormData({ ...formData, testType: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class_test">Class Test</SelectItem>
                          <SelectItem value="college_test">College Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Test Name *</Label>
                      <Input placeholder="e.g., Unit Test 1" value={formData.testName} onChange={e => setFormData({ ...formData, testName: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Marks Obtained *</Label>
                        <Input type="number" min="0" value={formData.marksObtained} onChange={e => setFormData({ ...formData, marksObtained: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Marks *</Label>
                        <Input type="number" min="1" value={formData.totalMarks} onChange={e => setFormData({ ...formData, totalMarks: e.target.value })} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Test Date *</Label>
                      <Input type="date" value={formData.testDate} onChange={e => setFormData({ ...formData, testDate: e.target.value })} required />
                    </div>
                    <Button type="submit" disabled={createMark.isPending || !formData.studentId || !formData.subjectId} className="w-full">
                      {createMark.isPending ? "Saving…" : "Save Marks"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-52"><SelectValue placeholder="Filter by subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {SUBJECTS.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Filter by type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="class_test">Class Test</SelectItem>
                <SelectItem value="college_test">College Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Marks Records</CardTitle></CardHeader>
            <CardContent className="p-0">
              {isLoading ? <p className="text-center text-muted-foreground py-10">Loading…</p> : (
                <Table>
                  <TableHeader><TableRow className="bg-muted/30">
                    {(role === "admin" || role === "teacher") && <TableHead>Student</TableHead>}
                    <TableHead>Subject</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>%</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {filtered.length === 0
                      ? <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-10">No marks records found.</TableCell></TableRow>
                      : filtered.map((m: any) => {
                          const pct = m.totalMarks > 0 ? Math.round((m.marksObtained / m.totalMarks) * 100) : 0;
                          const subName = SUBJECTS.find(s => s.id === m.subjectId)?.name || m.subjectId || m.subjectName || "—";
                          return (
                            <TableRow key={m.id} className="hover:bg-muted/20">
                              {(role === "admin" || role === "teacher") && <TableCell className="font-medium">{studentMap[m.studentId] || m.studentId}</TableCell>}
                              <TableCell><span className="font-medium">{subName}</span></TableCell>
                              <TableCell>{m.testName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={m.testType === "class_test" ? "text-blue-700 border-blue-300" : "text-purple-700 border-purple-300"}>
                                  {m.testType === "class_test" ? "Class Test" : "College Test"}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold">{m.marksObtained}/{m.totalMarks}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={pct} className="w-16 h-2" />
                                  <span className="text-sm font-medium">{pct}%</span>
                                </div>
                              </TableCell>
                              <TableCell><GradeBadge pct={pct} /></TableCell>
                              <TableCell className="text-muted-foreground text-sm">{m.testDate || "—"}</TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
