import { useEffect } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMarks } from "@/hooks/use-marks";
import { TrendingUp, Award, Target, BookOpen, ClipboardList } from "lucide-react";
import { SUBJECTS } from "./Marks";

export default function ProgressPage() {
  const [, setLocation] = useLocation();
  const role = localStorage.getItem("userRole");

  const { data: marksData } = useMarks();

  useEffect(() => { if (!role) setLocation("/login"); }, [role, setLocation]);
  if (!role) return null;

  const marks = (marksData || []) as any[];

  // Group by subject
  const bySubject: Record<string, { class: number[]; college: number[]; name: string }> = {};
  SUBJECTS.forEach(s => { bySubject[s.id] = { class: [], college: [], name: s.name }; });

  marks.forEach((m: any) => {
    const pct = m.totalMarks > 0 ? (m.marksObtained / m.totalMarks) * 100 : 0;
    const key = m.subjectId;
    if (!bySubject[key]) bySubject[key] = { class: [], college: [], name: m.subjectName || key };
    if (m.testType === "class_test")   bySubject[key].class.push(pct);
    if (m.testType === "college_test") bySubject[key].college.push(pct);
  });

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;

  const allPcts = marks.map(m => m.totalMarks > 0 ? (m.marksObtained / m.totalMarks) * 100 : 0);
  const overallAvg = allPcts.length ? Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length) : 0;
  const classTests   = marks.filter(m => m.testType === "class_test");
  const collegeTests = marks.filter(m => m.testType === "college_test");
  const classAvg   = classTests.length   ? Math.round(classTests.reduce((s, m)   => s + (m.marksObtained / m.totalMarks) * 100, 0) / classTests.length)   : 0;
  const collegeAvg = collegeTests.length ? Math.round(collegeTests.reduce((s, m) => s + (m.marksObtained / m.totalMarks) * 100, 0) / collegeTests.length) : 0;

  function gradeLabel(pct: number) {
    if (pct >= 90) return { label: "A+", cls: "bg-emerald-100 text-emerald-800" };
    if (pct >= 80) return { label: "A",  cls: "bg-green-100 text-green-800" };
    if (pct >= 70) return { label: "B+", cls: "bg-blue-100 text-blue-800" };
    if (pct >= 60) return { label: "B",  cls: "bg-yellow-100 text-yellow-800" };
    return { label: "C", cls: "bg-red-100 text-red-800" };
  }

  const subjectRows = Object.entries(bySubject)
    .map(([id, data]) => {
      const cAvg = avg(data.class);
      const gAvg = avg(data.college);
      const combined = [...data.class, ...data.college];
      const total = combined.length ? Math.round(combined.reduce((a, b) => a + b, 0) / combined.length) : null;
      return { id, name: data.name, classAvg: cAvg, collegeAvg: gAvg, overall: total };
    })
    .filter(r => r.overall !== null);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Academic Progress</h1>
            <p className="text-muted-foreground mt-1">Performance based on Class Tests and College Tests</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Overall Average",  value: `${overallAvg}%`, icon: TrendingUp, color: "from-indigo-500 to-purple-600" },
              { label: "Class Test Avg",   value: `${classAvg}%`,   icon: ClipboardList, color: "from-blue-500 to-blue-600" },
              { label: "College Test Avg", value: `${collegeAvg}%`, icon: BookOpen, color: "from-green-500 to-teal-600" },
              { label: "Tests Taken",      value: marks.length,     icon: Target, color: "from-orange-500 to-amber-600" },
            ].map(stat => (
              <Card key={stat.label} className={`bg-gradient-to-br ${stat.color} text-white border-0 shadow-lg`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="w-5 h-5 opacity-80" />
                    <Award className="w-4 h-4 opacity-50" />
                  </div>
                  <p className="text-3xl font-extrabold">{stat.value}</p>
                  <p className="text-sm opacity-85 mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Subject-wise Analysis */}
          {subjectRows.length > 0 ? (
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Subject-wise Performance</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                {subjectRows.map(row => {
                  const g = gradeLabel(row.overall!);
                  return (
                    <div key={row.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="font-semibold text-foreground">{row.name}</p>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                            {row.classAvg !== null   && <span>Class Test: <strong>{row.classAvg}%</strong></span>}
                            {row.collegeAvg !== null && <span>College Test: <strong>{row.collegeAvg}%</strong></span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={g.cls}>{g.label}</Badge>
                          <span className="text-lg font-bold text-foreground">{row.overall}%</span>
                        </div>
                      </div>
                      <Progress value={row.overall!} className="h-2.5" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="p-10 text-center text-muted-foreground">No marks data yet. Marks will appear here once added by the teacher.</CardContent></Card>
          )}

          {/* Class vs College Test Comparison */}
          {marks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader><CardTitle>Class Test Performance</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-4xl font-extrabold text-blue-600">{classAvg}%</p>
                  <p className="text-muted-foreground mt-1">{classTests.length} test{classTests.length !== 1 ? "s" : ""} recorded</p>
                  <Progress value={classAvg} className="mt-3 h-2" />
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader><CardTitle>College Test Performance</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-4xl font-extrabold text-green-600">{collegeAvg}%</p>
                  <p className="text-muted-foreground mt-1">{collegeTests.length} test{collegeTests.length !== 1 ? "s" : ""} recorded</p>
                  <Progress value={collegeAvg} className="mt-3 h-2" />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
