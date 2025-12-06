"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Plus, AlertCircleIcon } from "lucide-react";
import { useAdmins, useDeleteAdmin } from "@/lib/admin/hooks";
import { Admin } from "@/lib/admin/types";
import { AdminsTable } from "./components/AdminsTable";
import { AdminDialog } from "./components/AdminDialog";
import { Skeleton } from "@/components/ui/skeleton";


export default function AdminsPage() {
    const { data: admins = [], isLoading, isError } = useAdmins();
    const deleteMutation = useDeleteAdmin();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const handleCreate = () => {
        setEditingAdmin(null);
        setDialogOpen(true);
    };

    const handleEdit = (admin: Admin) => {
        setEditingAdmin(admin);
        setDialogOpen(true);
    };

    const handleDeleteRequest = (id: string) => {
        setDeleteId(id);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
            setConfirmDeleteOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-teal-600" />
                        Manajemen Admin
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola akun administrator sistem. Hanya Super Admin yang dapat mengakses halaman ini.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Admin
                </Button>
            </div>

            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : isError ? (
                <div className="text-center py-10 text-destructive">Gagal memuat data admin.</div>
            ) : (
                <AdminsTable
                    data={admins}
                    onEdit={handleEdit}
                    onDelete={handleDeleteRequest}
                    isDeletingId={deleteMutation.isPending ? deleteId : null}
                />
            )}

            {/* Dialog Create/Edit */}
            <AdminDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                adminToEdit={editingAdmin}
            />

            {/* Confirmation Alert Delete */}
            <div className={confirmDeleteOpen ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" : "hidden"}>
                {confirmDeleteOpen && (
                    <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
                        <div className="flex items-start gap-4">
                            <AlertCircleIcon className="h-6 w-6 text-destructive mt-1" />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Hapus Admin?</h3>
                                <p className="text-muted-foreground">
                                    Tindakan ini tidak dapat dibatalkan. Admin yang dihapus tidak akan bisa login lagi.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
