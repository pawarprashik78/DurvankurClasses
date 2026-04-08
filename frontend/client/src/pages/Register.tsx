import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Loader2, GraduationCap, Briefcase, ShieldAlert, Users } from "lucide-react";
import { registerStudent, registerTeacher, registerAdmin, registerParent } from "@/lib/api";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  /* ── Form states ── */
  const [studentData, setStudentData] = useState({
    name: "", email: "", phone: "", standard: "", rollNumber: "",
    parentName: "", parentPhone: "", parentEmail: "",
    dateOfBirth: "", address: "", password: "",
  });

  const [parentData, setParentData] = useState({
    name: "", email: "", phone: "",
    studentRollNumber: "",   // used to link parent → student
    password: "",
  });

  const [teacherData, setTeacherData] = useState({
    name: "", email: "", phone: "", specialization: "", qualifications: "", password: "",
  });

  const [adminData, setAdminData] = useState({
    username: "", email: "", password: "",
  });

  /* ── Submit handlers ── */
  const wrap = (fn: () => Promise<void>) => async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fn();
      toast({ title: "🎉 Registration Successful!", description: "You are now logged in." });
      setLocation("/dashboard");
    } catch (err) {
      toast({ title: "Registration Failed", description: err instanceof Error ? err.message : "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = wrap(() => registerStudent(studentData));
  const handleParentSubmit  = wrap(() => registerParent(parentData));
  const handleTeacherSubmit = wrap(() => registerTeacher(teacherData));
  const handleAdminSubmit   = wrap(() => registerAdmin(adminData));

  const inputCls = "h-11";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto animate-slide-up">
          <Card className="shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="inline-flex p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-2">
                <UserPlus className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Portal Registration</CardTitle>
              <CardDescription>Select your role to create an account</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 h-12">
                  <TabsTrigger value="student" className="text-xs sm:text-sm">
                    <GraduationCap className="w-4 h-4 mr-1 hidden sm:block" /> Student
                  </TabsTrigger>
                  <TabsTrigger value="parent" className="text-xs sm:text-sm">
                    <Users className="w-4 h-4 mr-1 hidden sm:block" /> Parent
                  </TabsTrigger>
                  <TabsTrigger value="teacher" className="text-xs sm:text-sm">
                    <Briefcase className="w-4 h-4 mr-1 hidden sm:block" /> Teacher
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="text-xs sm:text-sm">
                    <ShieldAlert className="w-4 h-4 mr-1 hidden sm:block" /> Admin
                  </TabsTrigger>
                </TabsList>

                {/* ── STUDENT TAB ── */}
                <TabsContent value="student">
                  <form onSubmit={handleStudentSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-base text-foreground bg-primary/5 p-2 rounded-md flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Student Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label>Full Name *</Label><Input className={inputCls} value={studentData.name} onChange={e => setStudentData({...studentData, name: e.target.value})} required /></div>
                        <div className="space-y-1.5"><Label>Email *</Label><Input className={inputCls} type="email" value={studentData.email} onChange={e => setStudentData({...studentData, email: e.target.value})} required /></div>
                        <div className="space-y-1.5"><Label>Phone *</Label><Input className={inputCls} value={studentData.phone} onChange={e => setStudentData({...studentData, phone: e.target.value})} required /></div>
                        <div className="space-y-1.5"><Label>Date of Birth *</Label><Input className={inputCls} type="date" value={studentData.dateOfBirth} onChange={e => setStudentData({...studentData, dateOfBirth: e.target.value})} required /></div>
                        <div className="space-y-1.5"><Label>Standard / Class *</Label><Input className={inputCls} placeholder="e.g., 10th" value={studentData.standard} onChange={e => setStudentData({...studentData, standard: e.target.value})} required /></div>
                        <div className="space-y-1.5"><Label>Roll Number *</Label><Input className={inputCls} value={studentData.rollNumber} onChange={e => setStudentData({...studentData, rollNumber: e.target.value})} required /></div>
                      </div>
                      <div className="space-y-1.5"><Label>Address *</Label><Textarea className="min-h-[80px]" value={studentData.address} onChange={e => setStudentData({...studentData, address: e.target.value})} required /></div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-base text-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" /> Parent Information
                        <span className="text-xs font-normal text-muted-foreground ml-1">(Parent account auto-created — use your roll no. to set password via Parent tab)</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label>Parent Name *</Label><Input className={inputCls} value={studentData.parentName} onChange={e => setStudentData({...studentData, parentName: e.target.value})} required /></div>
                        <div className="space-y-1.5"><Label>Parent Email *</Label><Input className={inputCls} type="email" placeholder="Used for absence alerts" value={studentData.parentEmail} onChange={e => setStudentData({...studentData, parentEmail: e.target.value})} required /></div>
                        <div className="space-y-1.5 sm:col-span-2"><Label>Parent Phone *</Label><Input className={inputCls} value={studentData.parentPhone} onChange={e => setStudentData({...studentData, parentPhone: e.target.value})} required /></div>
                      </div>
                    </div>

                    <div className="space-y-1.5"><Label>Account Password *</Label><Input className={inputCls} type="password" value={studentData.password} onChange={e => setStudentData({...studentData, password: e.target.value})} required /></div>
                    <Button type="submit" disabled={loading} className="w-full h-12 shadow-lg">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registering...</> : "Complete Student Registration"}
                    </Button>
                  </form>
                </TabsContent>

                {/* ── PARENT TAB ── */}
                <TabsContent value="parent">
                  <form onSubmit={handleParentSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 rounded-lg text-sm text-blue-800 dark:text-blue-300 flex items-start gap-3">
                      <Users className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Parent Registration</p>
                        <p className="mt-0.5 text-xs opacity-80">Enter your child's roll number to link your account. If your account was auto-created during student registration, use the same parent email — this will set your login password.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label>Full Name *</Label><Input className={inputCls} value={parentData.name} onChange={e => setParentData({...parentData, name: e.target.value})} required /></div>
                        <div className="space-y-1.5"><Label>Email *</Label><Input className={inputCls} type="email" placeholder="Same email as used in student registration" value={parentData.email} onChange={e => setParentData({...parentData, email: e.target.value})} required /></div>
                        <div className="space-y-1.5"><Label>Phone *</Label><Input className={inputCls} value={parentData.phone} onChange={e => setParentData({...parentData, phone: e.target.value})} required /></div>
                        <div className="space-y-1.5">
                          <Label>Child's Roll Number *</Label>
                          <Input className={inputCls} placeholder="e.g., DUR-2024-001" value={parentData.studentRollNumber} onChange={e => setParentData({...parentData, studentRollNumber: e.target.value})} required />
                        </div>
                      </div>
                      <div className="space-y-1.5"><Label>Set Your Password *</Label><Input className={inputCls} type="password" value={parentData.password} onChange={e => setParentData({...parentData, password: e.target.value})} required /></div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-12 shadow-lg bg-blue-600 hover:bg-blue-700 text-white">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registering...</> : "Complete Parent Registration"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Already registered? <a href="/login" className="text-primary hover:underline font-medium">Login as Parent</a>
                    </p>
                  </form>
                </TabsContent>

                {/* ── TEACHER TAB ── */}
                <TabsContent value="teacher">
                  <form onSubmit={handleTeacherSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="font-semibold text-base text-foreground bg-primary/5 p-2 rounded-md flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Teacher Profile
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label>Full Name *</Label><Input className={inputCls} value={teacherData.name} onChange={e => setTeacherData({...teacherData, name: e.target.value})} required /></div>
                      <div className="space-y-1.5"><Label>Email *</Label><Input className={inputCls} type="email" value={teacherData.email} onChange={e => setTeacherData({...teacherData, email: e.target.value})} required /></div>
                      <div className="space-y-1.5 sm:col-span-2"><Label>Phone *</Label><Input className={inputCls} value={teacherData.phone} onChange={e => setTeacherData({...teacherData, phone: e.target.value})} required /></div>
                      <div className="space-y-1.5"><Label>Specialization (Subject) *</Label><Input className={inputCls} placeholder="e.g., Mathematics" value={teacherData.specialization} onChange={e => setTeacherData({...teacherData, specialization: e.target.value})} required /></div>
                      <div className="space-y-1.5"><Label>Highest Qualification *</Label><Input className={inputCls} placeholder="e.g., M.Sc B.Ed" value={teacherData.qualifications} onChange={e => setTeacherData({...teacherData, qualifications: e.target.value})} required /></div>
                    </div>
                    <div className="space-y-1.5"><Label>Account Password *</Label><Input className={inputCls} type="password" value={teacherData.password} onChange={e => setTeacherData({...teacherData, password: e.target.value})} required /></div>
                    <Button type="submit" disabled={loading} className="w-full h-12 shadow-lg">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registering...</> : "Complete Teacher Registration"}
                    </Button>
                  </form>
                </TabsContent>

                {/* ── ADMIN TAB ── */}
                <TabsContent value="admin">
                  <form onSubmit={handleAdminSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-lg text-sm text-red-800 dark:text-red-400 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                      <p><strong>Testing Mode:</strong> Admin registration is restricted in production. This grants root-level access to the portal.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5"><Label>Admin Username *</Label><Input className={inputCls} placeholder="admin_user" value={adminData.username} onChange={e => setAdminData({...adminData, username: e.target.value})} required /></div>
                      <div className="space-y-1.5"><Label>Authorized Email *</Label><Input className={inputCls} type="email" value={adminData.email} onChange={e => setAdminData({...adminData, email: e.target.value})} required /></div>
                      <div className="space-y-1.5"><Label>Master Password *</Label><Input className={inputCls} type="password" value={adminData.password} onChange={e => setAdminData({...adminData, password: e.target.value})} required /></div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-12 shadow-lg bg-red-600 hover:bg-red-700 text-white">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registering...</> : "Register Admin Account"}
                    </Button>
                  </form>
                </TabsContent>

              </Tabs>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline font-medium">Sign in here</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
