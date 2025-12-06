import { Head } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/layouts/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { CreateTagDialog } from "./_components/CreateTagDialog";
import { ViewTagDialog } from "./_components/ViewTagDialog";
import { EditTagDialog } from "./_components/EditTagDialog";
import { DeleteTagDialog } from "./_components/DeleteTagDialog";

interface Tag {
    id: number;
    tag_text: string;
}

interface Props {
    tags: Tag[];
}

export default function Index({ tags }: Props) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

    const handleView = (tag: Tag) => {
        setSelectedTag(tag);
        setViewDialogOpen(true);
    };

    const handleEdit = (tag: Tag) => {
        setSelectedTag(tag);
        setEditDialogOpen(true);
    };

    const handleDelete = (tag: Tag) => {
        setSelectedTag(tag);
        setDeleteDialogOpen(true);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Tags", href: "/admin/tags" },
            ]}
        >
            <Head title="Tags" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Tags</CardTitle>
                            <Button onClick={() => setCreateDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Tag
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tag Text</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tags.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="text-center"
                                        >
                                            No tags found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tags.map((tag) => (
                                        <TableRow key={tag.id}>
                                            <TableCell>{tag.id}</TableCell>
                                            <TableCell>{tag.tag_text}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleView(tag)
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(tag)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(tag)
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
                    </CardContent>
                </Card>

                <CreateTagDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                />

                <ViewTagDialog
                    open={viewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    tag={selectedTag}
                />

                <EditTagDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    tag={selectedTag}
                />

                <DeleteTagDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    tag={selectedTag}
                />
            </div>
        </AdminLayout>
    );
}

