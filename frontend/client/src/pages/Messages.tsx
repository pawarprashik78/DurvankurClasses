import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMessages, useCreateMessage } from "@/hooks/use-messages";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Plus, Send, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Messages() {
  const [, setLocation] = useLocation();
  const role = localStorage.getItem("userRole");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: messagesData, isLoading } = useMessages();
  const createMessage = useCreateMessage();

  const [formData, setFormData] = useState({
    subject: "", content: "", targetRole: "all",
  });

  useEffect(() => { if (!role) setLocation("/login"); }, [role, setLocation]);
  if (!role) return null;

  const canCompose = role === "admin" || role === "teacher";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMessage.mutateAsync({
        subject: formData.subject,
        content: formData.content,
        senderType: role,
        receiverType: formData.targetRole,
      });
      toast({ title: "✅ Message Sent", description: "Your announcement has been posted." });
      setDialogOpen(false);
      setFormData({ subject: "", content: "", targetRole: "all" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    }
  };

  const messages = (messagesData || []) as any[];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Messages</h1>
              <p className="text-muted-foreground mt-1">
                {canCompose ? "Post announcements and communicate with students & parents" : "Announcements and messages from your teachers"}
              </p>
            </div>
            {canCompose && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-lg gap-2"><Plus className="w-4 h-4" />New Message</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader><DialogTitle>Compose Message</DialogTitle></DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Subject *</Label>
                      <Input placeholder="e.g., Holiday Notice, Exam Schedule" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Message *</Label>
                      <Textarea placeholder="Write your message or announcement…" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required className="min-h-[120px]" />
                    </div>
                    <Button type="submit" disabled={createMessage.isPending} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      {createMessage.isPending ? "Sending…" : "Send to All Students & Parents"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground py-10">Loading messages…</p>
          ) : messages.length === 0 ? (
            <Card><CardContent className="p-10 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold text-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                {canCompose ? "Post your first announcement using the button above." : "Check back later for announcements from your teachers."}
              </p>
            </CardContent></Card>
          ) : (
            <div className="space-y-4">
              {messages.map((msg: any) => (
                <Card key={msg.id} className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{msg.subject}</CardTitle>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                        <Clock className="w-3 h-3" />
                        {msg.createdAt ? format(new Date(msg.createdAt), "dd MMM yyyy, h:mm a") : "—"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        From: {msg.senderName || msg.senderType || "Teacher"}
                      </Badge>
                      {!msg.isRead && <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
