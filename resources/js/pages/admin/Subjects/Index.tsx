import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { CreateSubjectDialog } from "./_components/CreateSubjectDialog";
import { ViewSubjectDialog } from "./_components/ViewSubjectDialog";
import { EditSubjectDialog } from "./_components/EditSubjectDialog";
import { DeleteSubjectDialog } from "./_components/DeleteSubjectDialog";
import { SmartPagination } from "@/components/common/SmartPagination";

interface Subject {
    id: number;
    name: string;
}

interface Props {
    subjects: {
        data: Subject[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        total?: number;
        per_page?: number;
        from?: number;
        to?: number;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ subjects, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                "/admin/subjects",
                { search },
                { preserveState: true, replace: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
        null
    );
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const handleView = (subject: Subject) => {
        setSelectedSubject(subject);
        setViewDialogOpen(true);
    };

    const handleEdit = (subject: Subject) => {
        setSelectedSubject(subject);
        setEditDialogOpen(true);
    };

    const handleDelete = (subject: Subject) => {
        setSelectedSubject(subject);
        setDeleteDialogOpen(true);
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === subjects.data.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(subjects.data.map((s: Subject) => s.id)));
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;

        if (
            confirm(
                `Are you sure you want to delete ${selectedIds.size} subject(s)?`
            )
        ) {
            router.delete(route("admin.subjects.bulkDestroy"), {
                data: { ids: Array.from(selectedIds) },
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds(new Set());
                    router.reload({ only: ["subjects"] });
                },
            });
        }
    };

    const goToPage = (url: string | null) => {
        if (url) router.get(url);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Subjects", href: "/admin/subjects" },
            ]}
        >
            <Head title="Subjects" />

            <div className="p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Subjects</CardTitle>
                            <div className="flex items-center gap-4">
                                {selectedIds.size > 0 && (
                                    <>
                                        <span className="text-sm text-muted-foreground">
                                            {selectedIds.size} selected
                                        </span>
                                        <Button
                                            variant="destructive"
                                            onClick={handleBulkDelete}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete Selected
                                        </Button>
                                    </>
                                )}
                                <Button
                                    onClick={() => setCreateDialogOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Subject
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Search */}
                        <div className="mb-4 flex w-[220px] gap-2">
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border px-2 py-1 rounded w-full mb-4"
                            />
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={
                                                subjects.data.length > 0 &&
                                                selectedIds.size ===
                                                    subjects.data.length
                                            }
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subjects.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell className="w-12"></TableCell>
                                        <TableCell
                                            colSpan={3}
                                            className="text-center"
                                        >
                                            No subjects found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subjects.data.map((subject) => (
                                        <TableRow key={subject.id}>
                                            <TableCell className="w-12">
                                                <Checkbox
                                                    checked={selectedIds.has(
                                                        subject.id
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleSelect(subject.id)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{subject.id}</TableCell>
                                            <TableCell>
                                                {subject.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleView(subject)
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(subject)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                subject
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <SmartPagination
                            currentPage={subjects.current_page}
                            totalPages={subjects.last_page}
                            onPageChange={() => {}}
                            prevPageUrl={subjects.prev_page_url}
                            nextPageUrl={subjects.next_page_url}
                            onUrlChange={goToPage}
                            buildUrl={(page) => `/admin/subjects?page=${page}`}
                        />
                        {subjects && (
                            <div className="text-center mt-4 text-sm text-muted-foreground">
                                Total: {subjects.total || subjects.data.length}{" "}
                                subject(s)
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialogs */}
                <CreateSubjectDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                />
                <ViewSubjectDialog
                    open={viewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    subject={selectedSubject}
                />
                <EditSubjectDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    subject={selectedSubject}
                />
                <DeleteSubjectDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    subject={selectedSubject}
                />
            </div>
        </AdminLayout>
    );
}
