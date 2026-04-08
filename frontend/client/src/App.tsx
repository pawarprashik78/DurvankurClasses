import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Attendance from "@/pages/Attendance";
import Marks from "@/pages/Marks";
import Fees from "@/pages/Fees";
import Tests from "@/pages/Tests";
import ProgressPage from "@/pages/Progress";
import Notes from "@/pages/Notes";
import Messages from "@/pages/Messages";
import ParentTestResults from "@/pages/ParentTestResults";
import Achievements from "@/pages/Achievements";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/marks" component={Marks} />
      <Route path="/fees" component={Fees} />
      <Route path="/tests" component={Tests} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/notes" component={Notes} />
      <Route path="/messages" component={Messages} />
      <Route path="/test-results" component={ParentTestResults} />
      <Route path="/achievements" component={Achievements} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
