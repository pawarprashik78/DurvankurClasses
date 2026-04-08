import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ClipboardList, TrendingUp, BookOpen, School } from "lucide-react";
import { format } from "date-fns";

function gradeBadgeClass(grade: string) {
    if (grade === "A+") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (grade === "A") return "bg-green-100 text-green-800 border-green-300";
    if (grade === "B+" || grade === "B") return "bg-blue-100 text-blue-800 border-blue-300";
    if (grade === "C") return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
}

export default function ParentTestResults() {
    const [, setLocation] = useLocation();
    const role = localStorage.getItem("userRole");
    const [activeTab, setActiveTab] = useState<"tuition" | "school">("tuition");
    const [subjectFilter, setSubjectFilter] = useState("all");
    const resultsQuery = useQuery({
      queryKey: ["/api/test-results"],
      queryFn: () => api.get<any[]>("/test-results"),
    });

    useEffect(() => {
        if (!role) setLocation("/login");
    }, [role, setLocation]);
    if (!role) return null;

    const allResults = resultsQuery.data || [];
    const filteredByTab = allResults.filter((r: any) => r.testType === activeTab);
    const filtered = subjectFilter === "all" ? filteredByTab : filteredByTab.filter((r: any) => r.subjectName === subjectFilter);
    const subjects = Array.from(new Set(allResults.map((r: any) => r.subjectName)));

    const tuitionCount = allResults.filter((r: any) => r.testType === "tuition").length;
    const schoolCount = allResults.filter((r: any) => r.testType === "school").length;
    const avgPct = allResults.length > 0
        ? (allResults.reduce((sum: number, r: any) => sum + (r.marksObtained / r.totalMarks) * 100, 0) / allResults.length).toFixed(1)
        : "0";

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar role={role} />
            <main className="flex-1 ml-64 mt-16 p-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Test Results</h1>
                        <p className="text-muted-foreground mt-1">School & Tuition test marks for your child</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-0">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <ClipboardList className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-indigo-100 text-sm">Tuition Tests</p>
                                    <p className="text-3xl font-bold">{tuitionCount}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-violet-500 to-violet-700 text-white border-0">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <School className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-violet-100 text-sm">School Tests</p>
                                    <p className="text-3xl font-bold">{schoolCount}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-0">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-emerald-100 text-sm">Overall Average</p>
                                    <p className="text-3xl font-bold">{avgPct}%</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs + Filter */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex rounded-lg overflow-hidden border border-border">
                                    <button
                                        onClick={() => setActiveTab("tuition")}
                                        className={`px-5 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === "tuition" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
                                    >
                                        <BookOpen className="w-4 h-4" /> Tuition Tests
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("school")}
                                        className={`px-5 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === "school" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
                                    >
                                        <School className="w-4 h-4" /> School Tests
                                    </button>
                                </div>
                                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                                    <SelectTrigger className="w-44">
                                        <SelectValue placeholder="Filter by subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Subjects</SelectItem>
                                        {subjects.map((s: any) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filtered.length === 0 ? (
                                <div className="py-16 text-center text-muted-foreground">
                                    <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                    <p>No test results found</p>
                                </div>
                            ) : (
                                <div className="rounded-lg border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/40">
                                                <TableHead>Test Name</TableHead>
                                                <TableHead>Subject</TableHead>
                                                <TableHead>Term</TableHead>
                                                <TableHead>Marks</TableHead>
                                                <TableHead>Percentage</TableHead>
                                                <TableHead>Grade</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Remarks</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filtered.map((r: any) => {
                                                const pct = ((r.marksObtained / r.totalMarks) * 100);
                                                return (
                                                    <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                                                        <TableCell className="font-medium">{r.testName}</TableCell>
                                                        <TableCell>{r.subjectName}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="text-xs">{r.term}</Badge>
                                                        </TableCell>
                                                        <TableCell className="font-semibold">{r.marksObtained}/{r.totalMarks}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Progress value={pct} className="w-20 h-2" />
                                                                <span className="text-sm font-medium">{pct.toFixed(0)}%</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={gradeBadgeClass(r.grade)}>{r.grade}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground text-sm">
                                                            {format(new Date(r.testDate), "dd MMM yyyy")}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground text-sm italic">
                                                            {r.remarks || "—"}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
