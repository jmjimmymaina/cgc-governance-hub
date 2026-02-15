import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, Users, MapPin, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminTeamApi } from "@/services/adminApi";
import type { AdminTeamMember } from "@/types/admin";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const emptyMember: Omit<AdminTeamMember, "id"> = {
  name: "", position: "", department: "", location: "Kenya",
  image: "", shortDescription: "", fullDescription: "",
  email: "", phone: "",
};

const TeamManager = () => {
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTeamMember | null>(null);
  const [form, setForm] = useState<Omit<AdminTeamMember, "id">>(emptyMember);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    setLoading(true);
    try {
      setMembers(await adminTeamApi.getAll());
    } catch {
      toast({ title: "Error loading team", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyMember);
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (m: AdminTeamMember) => {
    setEditing(m);
    setForm({
      name: m.name, position: m.position, department: m.department,
      location: m.location, image: m.image, shortDescription: m.shortDescription,
      fullDescription: m.fullDescription, email: m.email, phone: m.phone,
    });
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.position.trim()) {
      toast({ title: "Name and Position are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing?.id) {
        await adminTeamApi.update(editing.id, form, imageFile || undefined);
        toast({ title: "Team member updated" });
      } else {
        await adminTeamApi.create(form, imageFile || undefined);
        toast({ title: "Team member added" });
      }
      setDialogOpen(false);
      fetchMembers();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await adminTeamApi.delete(id);
      toast({ title: "Team member deleted" });
      fetchMembers();
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const getImageSrc = (member: AdminTeamMember) => {
    if (member.image?.startsWith("http")) return member.image;
    if (member.image) return `${BASE_URL}/uploads/${member.image}`;
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team</h2>
          <p className="text-sm text-muted-foreground">Manage team members displayed on the website.</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} className="mr-1" /> Add Member</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-lg" />)}
        </div>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No team members yet</p>
            <p className="text-sm">Add your first team member.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => (
            <Card key={member.id} className="group overflow-hidden">
              <div className="aspect-[3/4] relative bg-muted">
                {member.image && (
                  <img
                    src={getImageSrc(member)}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-2">
                  <Button
                    variant="outline" size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 h-9 w-9"
                    onClick={() => openEdit(member)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="destructive" size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9"
                    onClick={() => member.id && handleDelete(member.id)}
                    disabled={deleting === member.id}
                  >
                    {deleting === member.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.position}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <MapPin size={10} className="text-primary" />
                  <span>{member.location}</span>
                </div>
                {member.shortDescription && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.shortDescription}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Image Upload */}
            <div className="grid gap-2">
              <Label>Photo</Label>
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById("team-image-input")?.click()}
              >
                {imageFile ? (
                  <div className="space-y-2">
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="max-h-24 mx-auto rounded" />
                    <p className="text-xs text-muted-foreground">{imageFile.name}</p>
                  </div>
                ) : editing?.image ? (
                  <div className="space-y-2">
                    <img src={getImageSrc(editing)} alt="Current" className="max-h-24 mx-auto rounded" />
                    <p className="text-xs text-muted-foreground">Click to replace</p>
                  </div>
                ) : (
                  <>
                    <Upload size={24} className="mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Click to upload photo</p>
                  </>
                )}
                <input
                  id="team-image-input" type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) setImageFile(f); }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Full name" />
              </div>
              <div className="grid gap-2">
                <Label>Position *</Label>
                <Input value={form.position} onChange={e => setForm(f => ({...f, position: e.target.value}))} placeholder="e.g. CEO" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Department</Label>
                <Input value={form.department} onChange={e => setForm(f => ({...f, department: e.target.value}))} placeholder="e.g. Leadership" />
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="e.g. Kenya" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Short Description</Label>
              <Textarea value={form.shortDescription} onChange={e => setForm(f => ({...f, shortDescription: e.target.value}))} placeholder="Brief intro (shown on card)" rows={2} />
            </div>
            <div className="grid gap-2">
              <Label>Full Description</Label>
              <Textarea value={form.fullDescription} onChange={e => setForm(f => ({...f, fullDescription: e.target.value}))} placeholder="Full bio (shown in detail view)" rows={4} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="email@example.com" />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+254 700 000 000" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 size={14} className="mr-1 animate-spin" /> Saving...</> : editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManager;
