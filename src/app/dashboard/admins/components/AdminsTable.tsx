"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Admin } from "@/lib/admin/types";
import { Badge } from "@/components/ui/badge";

interface AdminsTableProps {
    data: Admin[];
    onEdit: (admin: Admin) => void;
    onDelete: (id: string) => void;
    isDeletingId?: string | null;
}

export function AdminsTable({ data, onEdit, onDelete, isDeletingId }: AdminsTableProps) {
    return (
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                Tidak ada data admin.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>
                                    <Badge variant={item.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                                        {item.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(item)}
                                        title="Edit"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => onDelete(item.id)}
                                        disabled={isDeletingId === item.id}
                                        title="Hapus"
                                    >
                                        {isDeletingId === item.id ? (
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
