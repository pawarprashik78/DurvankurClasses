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
import { Progress } from "@/components/ui/progress";
import { useFees, useCreateFee, useMyFees } from "@/hooks/use-fees";
import { useStudents } from "@/hooks/use-students";
import { useToast } from "@/hooks/use-toast";

import { DollarSign, Plus, CheckCircle2, Clock, AlertCircle, TrendingUp, CreditCard, User, Calendar } from "lucide-react";
import { format } from "date-fns";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function StatusBadge({ status }: { status: string }) {
  if (status === "paid") return <Badge className="bg-green-100 text-green-800 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3" />Paid</Badge>;
  if (status === "partial") return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1"><Clock className="w-3 h-3" />Partial</Badge>;
  return <Badge className="bg-red-100 text-red-800 border-red-200 gap-1"><AlertCircle className="w-3 h-3" />Pending</Badge>;
}

// ── Admin / Teacher full fee view ─────────────────────────────
function AdminFeesView({ feesData, students, role, dialogOpen, setDialogOpen, formData, setFormData, handleSubmit, createFee }: any) {
  const [studentFilter, setStudentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fees = feesData || [];
  const totalAmt = fees.reduce((s: number, f: any) => s + parseFloat(f.amount), 0);
  const collectedAmt = fees.reduce((s: number, f: any) => s + parseFloat(f.paidAmount), 0);
  const pendingAmt = totalAmt - collectedAmt;
  const paidCount = fees.filter((f: any) => f.status === "paid").length;
  const pendingCount = fees.filter((f: any) => f.status === "pending").length;
  const collPct = totalAmt > 0 ? Math.round((collectedAmt / totalAmt) * 100) : 0;

  const displayed = fees.filter((f: any) => {
    const stuMatch = studentFilter === "all" || f.studentId === parseInt(studentFilter);
    const statMatch = statusFilter === "all" || f.status === statusFilter;
    return stuMatch && statMatch;
  });

  const stuNames: Record<number, string> = { 1: "Aarav Sharma", 2: "Diya Patel", 3: "Arjun Reddy" };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Billed", value: `₹${totalAmt.toLocaleString("en-IN")}`, icon: DollarSign, color: "bg-gradient-to-br from-blue-500 to-blue-700" },
          { label: "Collected", value: `₹${collectedAmt.toLocaleString("en-IN")}`, icon: CheckCircle2, color: "bg-gradient-to-br from-emerald-500 to-emerald-700" },
          { label: "Pending", value: `₹${pendingAmt.toLocaleString("en-IN")}`, icon: AlertCircle, color: "bg-gradient-to-br from-rose-500 to-rose-700" },
          { label: "Collection Rate", value: `${collPct}%`, icon: TrendingUp, color: "bg-gradient-to-br from-violet-500 to-violet-700" },
        ].map((s) => (
          <Card key={s.label} className={`${s.color} text-white border-0 shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white/20 rounded-lg"><s.icon className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Collection Progress */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-foreground">Overall Fee Collection Progress</span>
            <span className="font-bold text-primary">{collPct}%</span>
          </div>
          <Progress value={collPct} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{paidCount} invoices paid</span>
            <span>{pendingCount} pending</span>
          </div>
        </CardContent>
      </Card>

      {/* Per-Student Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(students || [{ id: 1, name: "Aarav Sharma" }, { id: 2, name: "Diya Patel" }, { id: 3, name: "Arjun Reddy" }]).map((stu: any) => {
          const stuFees = fees.filter((f: any) => f.studentId === stu.id);
          const paid = stuFees.filter((f: any) => f.status === "paid").length;
          const pending = stuFees.filter((f: any) => f.status === "pending").length;
          const stuTotal = stuFees.reduce((s: number, f: any) => s + parseFloat(f.amount), 0);
          const stuCollected = stuFees.reduce((s: number, f: any) => s + parseFloat(f.paidAmount), 0);
          const pct = stuTotal > 0 ? Math.round((stuCollected / stuTotal) * 100) : 0;
          return (
            <Card key={stu.id} className="shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {stu.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{stu.name}</p>
                    <p className="text-xs text-muted-foreground">{paid} paid • {pending} pending</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{stuCollected.toLocaleString("en-IN")} / ₹{stuTotal.toLocaleString("en-IN")}</span>
                    <span className="font-bold text-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters + Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="w-5 h-5 text-primary" /> All Fee Records
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Select value={studentFilter} onValueChange={setStudentFilter}>
                <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="All Students" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="1">Aarav Sharma</SelectItem>
                  <SelectItem value="2">Diya Patel</SelectItem>
                  <SelectItem value="3">Arjun Reddy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
              {role === "admin" && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 text-xs"><Plus className="w-3.5 h-3.5 mr-1" />Add Record</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader><DialogTitle>Add Fee Record</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Student</Label>
                        <Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })}>
                          <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                          <SelectContent>
                            {(students || []).map((s: any) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Month</Label>
                          <Select value={formData.month} onValueChange={(v) => setFormData({ ...formData, month: v })}>
                            <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                            <SelectContent>{MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Total Amount (₹)</Label>
                          <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Paid Amount (₹)</Label>
                          <Input type="number" value={formData.paidAmount} onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.status !== "pending" && (
                        <div className="space-y-2">
                          <Label>Payment Date</Label>
                          <Input type="date" value={formData.paymentDate} onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })} />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label>Remarks (Optional)</Label>
                        <Input value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} placeholder="Add notes..." />
                      </div>
                      <Button type="submit" disabled={createFee.isPending} className="w-full">
                        {createFee.isPending ? "Saving..." : "Create Fee Record"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Student</TableHead>
                  <TableHead>Month / Year</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map((fee: any) => {
                  const balance = parseFloat(fee.amount) - parseFloat(fee.paidAmount);
                  return (
                    <TableRow key={fee.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {(stuNames[fee.studentId] || "S").split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <span className="font-medium text-sm">{stuNames[fee.studentId] || `Student #${fee.studentId}`}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{fee.month} {fee.year}</TableCell>
                      <TableCell className="font-semibold">₹{parseFloat(fee.amount).toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-emerald-600 font-semibold">₹{parseFloat(fee.paidAmount).toLocaleString("en-IN")}</TableCell>
                      <TableCell className={balance > 0 ? "text-rose-600 font-semibold" : "text-muted-foreground"}>
                        {balance > 0 ? `₹${balance.toLocaleString("en-IN")}` : "—"}
                      </TableCell>
                      <TableCell><StatusBadge status={fee.status} /></TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {fee.paymentDate ? format(new Date(fee.paymentDate), "dd MMM yyyy") : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Parent fee view ────────────────────────────────────────────
function ParentFeesView({ feesData }: { feesData: any[] }) {
  const fees = feesData || [];
  const total = fees.reduce((s: number, f: any) => s + parseFloat(f.amount), 0);
  const paid = fees.reduce((s: number, f: any) => s + parseFloat(f.paidAmount), 0);
  const pending = total - paid;
  const pct = total > 0 ? Math.round((paid / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-0 shadow-lg">
          <CardContent className="p-5">
            <div className="p-2.5 bg-white/20 rounded-xl w-fit mb-3"><CheckCircle2 className="w-5 h-5" /></div>
            <p className="text-3xl font-extrabold">₹{paid.toLocaleString("en-IN")}</p>
            <p className="text-sm opacity-90">Total Paid</p>
          </CardContent>
        </Card>
        <Card className={`${pending > 0 ? "bg-gradient-to-br from-rose-500 to-rose-700" : "bg-gradient-to-br from-slate-500 to-slate-700"} text-white border-0 shadow-lg`}>
          <CardContent className="p-5">
            <div className="p-2.5 bg-white/20 rounded-xl w-fit mb-3"><AlertCircle className="w-5 h-5" /></div>
            <p className="text-3xl font-extrabold">₹{pending.toLocaleString("en-IN")}</p>
            <p className="text-sm opacity-90">{pending > 0 ? "Amount Due" : "No Dues!"}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg">
          <CardContent className="p-5">
            <div className="p-2.5 bg-white/20 rounded-xl w-fit mb-3"><TrendingUp className="w-5 h-5" /></div>
            <p className="text-3xl font-extrabold">{pct}%</p>
            <p className="text-sm opacity-90">Fees Paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card className="shadow-lg">
        <CardContent className="p-5">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-semibold">Payment Progress — Aarav Sharma</span>
            <span className="font-bold text-primary">{pct}%</span>
          </div>
          <Progress value={pct} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">₹{paid.toLocaleString("en-IN")} paid of ₹{total.toLocaleString("en-IN")} total fees</p>
        </CardContent>
      </Card>

      {/* Monthly Payment Calendar */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-5 h-5 text-primary" /> Monthly Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fees.map((f: any) => (
              <div
                key={f.id}
                className={`rounded-xl border p-4 text-center space-y-1.5 ${f.status === "paid"
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20"
                    : f.status === "partial"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-red-50 border-red-200 dark:bg-red-900/20"
                  }`}
              >
                <p className="text-xs font-bold text-muted-foreground uppercase">{f.month}</p>
                <div className="flex justify-center">
                  {f.status === "paid"
                    ? <CheckCircle2 className="w-7 h-7 text-green-500" />
                    : f.status === "partial"
                      ? <Clock className="w-7 h-7 text-yellow-500" />
                      : <AlertCircle className="w-7 h-7 text-red-500" />}
                </div>
                <p className={`text-sm font-bold capitalize ${f.status === "paid" ? "text-green-700" : f.status === "partial" ? "text-yellow-700" : "text-red-700"}`}>
                  {f.status}
                </p>
                <p className="text-xs text-muted-foreground font-medium">₹{f.amount}</p>
                {f.paymentDate && (
                  <p className="text-xs text-muted-foreground">{format(new Date(f.paymentDate), "dd MMM yyyy")}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Alert */}
      {pending > 0 && (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-red-200 bg-red-50">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Payment Due</p>
            <p className="text-sm text-red-700 mt-0.5">You have ₹{pending.toLocaleString("en-IN")} in pending fees. Please contact the institute to make payment.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function Fees() {
  const [, setLocation] = useLocation();
  const role = localStorage.getItem("userRole");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: feesData, isLoading } = useFees();
  const { data: myFeesData } = useMyFees();
  const { data: students } = useStudents();
  const createFee = useCreateFee();

  const [formData, setFormData] = useState({
    studentId: "", month: "", year: new Date().getFullYear().toString(),
    amount: "1000", paidAmount: "0", status: "pending", paymentDate: "", remarks: "",
  });

  useEffect(() => {
    if (!role) setLocation("/login");
  }, [role, setLocation]);
  if (!role) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFee.mutateAsync({
        studentId: parseInt(formData.studentId), month: formData.month,
        year: parseInt(formData.year), amount: formData.amount,
        paidAmount: formData.paidAmount, status: formData.status,
        paymentDate: formData.paymentDate || undefined, remarks: formData.remarks || undefined,
      });
      toast({ title: "Success", description: "Fee record created successfully" });
      setDialogOpen(false);
      setFormData({ studentId: "", month: "", year: new Date().getFullYear().toString(), amount: "", paidAmount: "0", status: "pending", paymentDate: "", remarks: "" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fees</h1>
            <p className="text-muted-foreground mt-1">
              {role === "parent" ? "Track your child's fee payment history" : "Manage student fee records and payments"}
            </p>
          </div>
          {role === "parent"
            ? <ParentFeesView feesData={myFeesData || []} />
            : <AdminFeesView
              feesData={feesData} students={students} role={role}
              dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}
              formData={formData} setFormData={setFormData}
              handleSubmit={handleSubmit} createFee={createFee}
            />}
        </div>
      </main>
    </div>
  );
}
