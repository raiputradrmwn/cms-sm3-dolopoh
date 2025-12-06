"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Admin, CreateAdminInput } from "@/lib/admin/types";
import { useCreateAdmin, useUpdateAdmin } from "@/lib/admin/hooks";
import { Loader2 } from "lucide-react";

interface AdminDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    adminToEdit?: Admin | null;
}

export function AdminDialog({ open, onOpenChange, adminToEdit }: AdminDialogProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"SUPER_ADMIN" | "ADMIN">("ADMIN");

    const createMutation = useCreateAdmin();
    const updateMutation = useUpdateAdmin();

    const isEditing = !!adminToEdit;
    const isLoading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (adminToEdit) {
            setName(adminToEdit.name);
            setEmail(adminToEdit.email);
            setRole(adminToEdit.role);
            setPassword(""); // Password usually distinct on update
        } else {
            setName("");
            setEmail("");
            setRole("ADMIN");
            setPassword("");
        }
    }, [adminToEdit, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && adminToEdit) {
            // Update
            // Only include password if it's set
            const payload: { name: string; email: string; role: "SUPER_ADMIN" | "ADMIN"; password?: string } = { name, email, role };
            if (password) payload.password = password;

            await updateMutation.mutateAsync({ id: adminToEdit.id, data: payload });
        } else {
            // Create
            await createMutation.mutateAsync({ name, email, password, role });
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Admin" : "Tambah Admin Baru"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Ubah informasi admin di sini. Kosongkan password jika tidak ingin mengganti."
                            : "Masukkan detail untuk membuat akun admin baru."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            placeholder="Joko Widodo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@smk.sch.id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={isEditing ? "biarkan kosong jika tetap" : "••••••••"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!isEditing}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select
                            value={role}
                            onValueChange={(val) => setRole(val as "SUPER_ADMIN" | "ADMIN")}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Simpan Perubahan" : "Buat Admin"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
