import { useEffect } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Trophy, Medal, Star, GraduationCap } from "lucide-react";

function MedalIcon({ rank }: { rank: number }) {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-slate-400" />;
    if (rank === 3) return <Medal className="w-8 h-8 text-amber-600" />;
    return <Star className="w-5 h-5 text-muted-foreground" />;
}

function topCardStyle(rank: number) {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-500 text-yellow-900 border-yellow-300 shadow-yellow-200/60 shadow-xl";
    if (rank === 2) return "bg-gradient-to-br from-slate-300 via-gray-200 to-slate-400 text-slate-900 border-slate-300 shadow-slate-200/60 shadow-xl";
    if (rank === 3) return "bg-gradient-to-br from-amber-500 via-orange-400 to-amber-600 text-amber-900 border-amber-400 shadow-amber-200/60 shadow-xl";
    return "";
}

export default function Achievements() {
    const [, setLocation] = useLocation();
    const role = localStorage.getItem("userRole");
    const achievementsQuery = useQuery({
      queryKey: ["/api/achievements"],
      queryFn: () => api.get<any[]>("/achievements"),
    });

    useEffect(() => {
        if (!role) setLocation("/login");
    }, [role, setLocation]);
    if (!role) return null;

    const all = (achievementsQuery.data as any[]) || [];
    const batches = Array.from(new Set(all.map((a: any) => a.batchYear))).sort().reverse();
    const topThree2425 = all.filter((a: any) => a.batchYear === "2024-25" && a.rank <= 3).sort((a: any, b: any) => a.rank - b.rank);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar role={role} />
            <main className="flex-1 ml-64 mt-16 p-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <Trophy className="w-8 h-8 text-yellow-300" />
                                <h1 className="text-3xl font-bold">Hall of Fame</h1>
                            </div>
                            <p className="text-indigo-100 text-lg">Previous batch toppers & achievements</p>
                        </div>
                        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full" />
                        <div className="absolute -bottom-12 -right-20 w-64 h-64 bg-white/5 rounded-full" />
                    </div>

                    {/* Top 3 Podium - latest batch */}
                    <div>
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" /> Batch 2024-25 Toppers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {topThree2425.map((a: any) => (
                                <div
                                    key={a.id}
                                    className={`rounded-2xl border p-6 flex flex-col items-center text-center gap-3 ${topCardStyle(a.rank)}`}
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-2xl font-bold">
                                        {a.name.split(" ").map((n: string) => n[0]).join("")}
                                    </div>
                                    <MedalIcon rank={a.rank} />
                                    <div>
                                        <p className="text-xl font-bold">{a.name}</p>
                                        <p className="text-sm opacity-80 mt-0.5">Rank #{a.rank} • {a.batchYear}</p>
                                    </div>
                                    <div className="text-3xl font-extrabold">{a.percentage}%</div>
                                    <div className="flex items-center gap-1.5 text-sm mt-1">
                                        <GraduationCap className="w-4 h-4" />
                                        <span className="font-medium">{a.collegeAdmitted}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Full Table - all batches */}
                    {batches.map((batch) => {
                        const achievers = all.filter((a: any) => a.batchYear === batch).sort((a: any, b: any) => a.rank - b.rank);
                        return (
                            <Card key={batch} className="shadow-lg">
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-3 p-5 border-b border-border bg-muted/30 rounded-t-xl">
                                        <Trophy className="w-5 h-5 text-primary" />
                                        <h3 className="text-lg font-semibold text-foreground">Batch {batch} — All Achievers</h3>
                                        <Badge variant="outline">{achievers.length} students</Badge>
                                    </div>
                                    <div className="rounded-b-xl overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/20">
                                                    <TableHead className="w-16">Rank</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Percentage</TableHead>
                                                    <TableHead>Grade</TableHead>
                                                    <TableHead>College Admitted</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {achievers.map((a: any) => (
                                                    <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
                                                        <TableCell className="font-bold text-center">
                                                            {a.rank <= 3 ? <MedalIcon rank={a.rank} /> : `#${a.rank}`}
                                                        </TableCell>
                                                        <TableCell className="font-semibold">{a.name}</TableCell>
                                                        <TableCell>
                                                            <span className="text-lg font-bold text-primary">{a.percentage}%</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={
                                                                a.grade === "A+" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                                                                    "bg-green-100 text-green-800 border-green-300"
                                                            }>{a.grade}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground flex items-center gap-2">
                                                            <GraduationCap className="w-4 h-4 shrink-0" />
                                                            {a.collegeAdmitted}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
