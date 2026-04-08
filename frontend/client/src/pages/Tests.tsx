import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTests, useCreateTest } from "@/hooks/use-tests";
import { SUBJECTS } from "./Marks";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Plus, Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";

export default function Tests() {
  const [, setLocation] = useLocation();
  const role = localStorage.getItem("userRole");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: testsData, isLoading, error } = useTests();
  const createTest = useCreateTest();
  
  const [formData, setFormData] = useState({
    name: "",
    subjectId: "",
    standard: "",
    totalMarks: "",
    testDate: format(new Date(), "yyyy-MM-dd"),
    status: "upcoming",
  });

  useEffect(() => {
    if (!role) {
      setLocation("/login");
    }
  }, [role, setLocation]);

  if (!role) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTest.mutateAsync({
        name: formData.name,
        subjectId: formData.subjectId,
        subjectName: SUBJECTS.find(s => s.id === formData.subjectId)?.name || "",
        standard: formData.standard,
        totalMarks: formData.totalMarks,
        testDate: formData.testDate,
        status: formData.status,
      });
      toast({
        title: "Success",
        description: "Test scheduled successfully",
      });
      setDialogOpen(false);
      setFormData({
        name: "",
        subjectId: "",
        standard: "",
        totalMarks: "",
        testDate: format(new Date(), "yyyy-MM-dd"),
        status: "upcoming",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule test",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role={role} />
        <main className="flex-1 ml-64 mt-16 p-8">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar role={role} />
        <main className="flex-1 ml-64 mt-16 p-8">
          <ErrorState message="Failed to load tests" />
        </main>
      </div>
    );
  }

  const upcomingTests = testsData?.filter((test: any) => test.status === "upcoming") || [];
  const completedTests = testsData?.filter((test: any) => test.status === "completed") || [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tests</h1>
              <p className="text-muted-foreground mt-2">Manage test schedules and results</p>
            </div>
            {(role === "admin" || role === "teacher") && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-5 h-5 mr-2" />
                    Schedule Test
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Schedule New Test</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Test Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Unit Test 1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subjectId">Subject</Label>
                      <Select
                        value={formData.subjectId}
                        onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name} <span className="text-xs text-muted-foreground">({subject.detail})</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="standard">Standard/Class</Label>
                      <Input
                        id="standard"
                        value={formData.standard}
                        onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                        placeholder="e.g., 10th"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalMarks">Total Marks</Label>
                      <Input
                        id="totalMarks"
                        type="number"
                        step="0.01"
                        value={formData.totalMarks}
                        onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testDate">Test Date</Label>
                      <Input
                        id="testDate"
                        type="date"
                        value={formData.testDate}
                        onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={createTest.isPending} className="w-full">
                      {createTest.isPending ? "Scheduling..." : "Schedule Test"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {!testsData || testsData.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No Tests Scheduled"
              description="Schedule tests to see them here"
              action={
                role === "admin" || role === "teacher"
                  ? {
                      label: "Schedule Test",
                      onClick: () => setDialogOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary" />
                    Upcoming Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No upcoming tests</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {upcomingTests.map((test: any) => (
                        <Card key={test.id} className="hover:shadow-md transition-all duration-300">
                          <CardContent className="p-6 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="p-2 bg-secondary/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-secondary" />
                              </div>
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                {test.status}
                              </Badge>
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{test.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {test.standard} • {test.totalMarks} marks
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(test.testDate), "MMM dd, yyyy")}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    Completed Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {completedTests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No completed tests</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {completedTests.map((test: any) => (
                        <Card key={test.id} className="hover:shadow-md transition-all duration-300">
                          <CardContent className="p-6 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-green-600" />
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                {test.status}
                              </Badge>
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{test.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {test.standard} • {test.totalMarks} marks
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(test.testDate), "MMM dd, yyyy")}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
