import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Loader2, GraduationCap, Briefcase, ShieldAlert, Users } from "lucide-react";
import { login } from "@/lib/api";

const ROLE_MAP: Record<string, string[]> = {
  student: ["student"],
  parent:  ["parent"],
  teacher: ["teacher"],
  admin:   ["admin"],
};

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const data = await login(email, password);
      const allowed = ROLE_MAP[activeTab] || [];
      if (!allowed.includes(data.role)) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("linkedId");
        throw new Error(`Wrong portal. This is the ${activeTab} portal. Your account role is "${data.role}".`);
      }
      toast({ title: `Welcome back, ${data.name}!`, description: `Logged in as ${data.role}` });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { value: "student", label: "Student",  icon: GraduationCap },
    { value: "parent",  label: "Parent",   icon: Users },
    { value: "teacher", label: "Teacher",  icon: Briefcase },
    { value: "admin",   label: "Admin",    icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto animate-slide-up">
          <Card className="shadow-2xl">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="inline-flex p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-2">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Select your portal to sign in securely</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setEmail(""); setPassword(""); }} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-4 h-11">
                  {tabs.map(t => (
                    <TabsTrigger key={t.value} value={t.value} className="text-xs sm:text-sm flex items-center gap-1">
                      <t.icon className="w-3.5 h-3.5 hidden sm:block" />
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {activeTab === "student" ? "Student Email" :
                     activeTab === "parent"  ? "Parent Email" :
                     activeTab === "teacher" ? "Teacher Email" : "Admin Email"}
                  </Label>
                  <Input id="email" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required className="h-12" />
                </div>
                <Button type="submit" disabled={loading || !email || !password}
                  className="w-full h-12 shadow-lg hover:shadow-xl transition-all duration-300">
                  {loading
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                    : `Login as ${tabs.find(t => t.value === activeTab)?.label}`}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  New to Durvankur Classes?{" "}
                  <a href="/register" className="text-primary hover:underline font-medium">Register here</a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
