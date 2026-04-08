import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotes, useCreateNote } from "@/hooks/use-notes";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Plus, Download, FileText, Video, Presentation, Upload, ExternalLink } from "lucide-react";
import { SUBJECTS } from "./Marks";

function TypeIcon({ type }: { type: string }) {
  if (type === "video") return <Video className="w-5 h-5 text-red-500" />;
  if (type === "ppt") return <Presentation className="w-5 h-5 text-orange-500" />;
  return <FileText className="w-5 h-5 text-blue-500" />;
}

// Cloudinary unsigned upload using fetch API
async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "durvankar_notes"); // Must be created as unsigned preset in Cloudinary
  formData.append("cloud_name", "dlmmxqmx2");
  
  const res = await fetch("https://api.cloudinary.com/v1_1/dlmmxqmx2/auto/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return data.secure_url as string;
}

export default function Notes() {
  const [, setLocation] = useLocation();
  const role = localStorage.getItem("userRole");
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [activeSubject, setActiveSubject] = useState("all");

  const { data: notesData, isLoading } = useNotes();
  const createNote = useCreateNote();

  const [formData, setFormData] = useState({
    title: "", subjectId: "", standard: "", content: "", type: "pdf",
  });

  useEffect(() => { if (!role) setLocation("/login"); }, [role, setLocation]);
  if (!role) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    // Auto-detect type
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const type = (ext === "mp4" || ext === "mov" || ext === "webm") ? "video"
                : (ext === "ppt" || ext === "pptx") ? "ppt" : "pdf";
    setFormData(f => ({ ...f, type }));
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !uploadedUrl) {
      toast({ title: "No file selected", description: "Please select a file to upload.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      let fileUrl = uploadedUrl;
      if (selectedFile && !uploadedUrl) {
        toast({ title: "Uploading to Cloudinary…", description: "Please wait." });
        fileUrl = await uploadToCloudinary(selectedFile);
        setUploadedUrl(fileUrl);
      }
      await createNote.mutateAsync({
        title: formData.title,
        subjectId: formData.subjectId,
        subjectName: SUBJECTS.find(s => s.id === formData.subjectId)?.name,
        standard: formData.standard,
        content: formData.content,
        type: formData.type,
        fileUrl,
      });
      toast({ title: "✅ Notes Published!", description: "Students can now access this material." });
      setDialogOpen(false);
      setSelectedFile(null);
      setUploadedUrl("");
      setFormData({ title: "", subjectId: "", standard: "", content: "", type: "pdf" });
    } catch (err) {
      toast({ title: "Upload Failed", description: err instanceof Error ? err.message : "Error", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const notes = (notesData || []) as any[];
  const filtered = notes.filter((n: any) => activeSubject === "all" || n.subjectId === activeSubject);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <main className="flex-1 ml-64 mt-16 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Study Notes</h1>
              <p className="text-muted-foreground mt-1">
                {role === "student" || role === "parent"
                  ? "Access PDFs, PPTs, and video lectures uploaded by your teachers"
                  : "Upload and manage study materials for students (PDF, PPT, Video)"}
              </p>
            </div>
            {(role === "admin" || role === "teacher") && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-lg gap-2"><Plus className="w-4 h-4" />Upload Notes</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader><DialogTitle>Upload Study Material</DialogTitle></DialogHeader>
                  <form onSubmit={handleUploadAndSave} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input placeholder="e.g., Algebra Chapter 1 Notes" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject *</Label>
                      <Select value={formData.subjectId} onValueChange={v => setFormData({ ...formData, subjectId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                        <SelectContent>{SUBJECTS.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Standard</Label>
                      <Input placeholder="e.g., 10th" value={formData.standard} onChange={e => setFormData({ ...formData, standard: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input placeholder="Brief description of this material" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Upload File * (PDF, PPT, Video)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors">
                        <input type="file" accept=".pdf,.ppt,.pptx,.mp4,.mov,.webm" className="hidden" id="fileUpload" onChange={handleFileChange} />
                        <label htmlFor="fileUpload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          {selectedFile ? (
                            <p className="text-sm font-medium text-primary">{selectedFile.name}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Click to browse or drag & drop<br /><span className="text-xs">PDF, PPT, MP4 supported</span></p>
                          )}
                        </label>
                      </div>
                    </div>
                    <Button type="submit" disabled={uploading || createNote.isPending || !formData.title || !formData.subjectId} className="w-full">
                      {uploading ? "Uploading to Cloudinary…" : createNote.isPending ? "Saving…" : "Upload & Publish"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Subject Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button variant={activeSubject === "all" ? "default" : "outline"} size="sm" onClick={() => setActiveSubject("all")}>All</Button>
            {SUBJECTS.map(s => (
              <Button key={s.id} variant={activeSubject === s.id ? "default" : "outline"} size="sm" onClick={() => setActiveSubject(s.id)}>{s.name.split(" ")[0]}</Button>
            ))}
          </div>

          {isLoading ? <p className="text-center text-muted-foreground py-10">Loading notes…</p> : (
            filtered.length === 0 ? (
              <Card><CardContent className="p-10 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No study materials available yet.</p>
              </CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((note: any) => (
                  <Card key={note.id} className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <TypeIcon type={note.type} />
                        <span className="text-xs text-muted-foreground uppercase font-medium">{note.type || "pdf"}</span>
                      </div>
                      <CardTitle className="text-base mt-2 leading-snug">{note.title}</CardTitle>
                      <p className="text-xs text-primary font-medium">
                        {SUBJECTS.find(s => s.id === note.subjectId)?.name || note.subjectName || note.subjectId}
                        {note.standard && <> · {note.standard}</>}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {note.content && <p className="text-sm text-muted-foreground mb-3">{note.content}</p>}
                      {note.fileUrl && (
                        <a href={note.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                          <Download className="w-4 h-4" />
                          {note.type === "video" ? "Watch Video" : "Download / View"}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
