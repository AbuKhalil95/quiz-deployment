import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Download, Eye } from "lucide-react";
import { useState, type ReactNode } from "react";

export interface SubjectNoteRow {
    id: number;
    original_name: string;
    mime_type: string;
    size_bytes: number;
    preview_kind: "pdf" | "text" | "office";
    created_at: string | null;
}

function formatBytes(n: number): string {
    if (n < 1024) {
        return `${n} B`;
    }
    if (n < 1024 * 1024) {
        return `${(n / 1024).toFixed(1)} KB`;
    }
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

type NotesRouteScope = "admin" | "student";

function previewUrl(
    scope: NotesRouteScope,
    subjectId: number,
    note: SubjectNoteRow
): string {
    const params = { subject: subjectId, note: note.id };
    if (note.preview_kind === "office") {
        return scope === "admin"
            ? route("admin.subjects.notes.officeFrame", params)
            : route("student.subjects.notes.officeFrame", params);
    }
    return scope === "admin"
        ? route("admin.subjects.notes.preview", params)
        : route("student.subjects.notes.preview", params);
}

function downloadUrl(scope: NotesRouteScope, subjectId: number, noteId: number) {
    const params = { subject: subjectId, note: noteId };
    return scope === "admin"
        ? route("admin.subjects.notes.download", params)
        : route("student.subjects.notes.download", params);
}

interface SubjectNotesReadOnlyProps {
    subjectId: number;
    notes: SubjectNoteRow[];
    routeScope: NotesRouteScope;
    title?: string;
    description?: string | null;
    emptyMessage?: string;
    renderExtraActions?: (note: SubjectNoteRow) => ReactNode;
}

export function SubjectNotesReadOnly({
    subjectId,
    notes,
    routeScope,
    title = "Subject notes",
    description = null,
    emptyMessage = "No notes for this subject yet.",
    renderExtraActions,
}: SubjectNotesReadOnlyProps) {
    const [previewNote, setPreviewNote] = useState<SubjectNoteRow | null>(
        null
    );

    if (notes.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {emptyMessage}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {notes.map((note) => (
                                <TableRow key={note.id}>
                                    <TableCell className="font-medium max-w-[200px] truncate">
                                        {note.original_name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {note.preview_kind}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatBytes(note.size_bytes)}
                                    </TableCell>
                                    <TableCell className="text-right space-x-1 whitespace-nowrap">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setPreviewNote(note)
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={downloadUrl(
                                                    routeScope,
                                                    subjectId,
                                                    note.id
                                                )}
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        {renderExtraActions?.(note)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog
                open={!!previewNote}
                onOpenChange={(open) => !open && setPreviewNote(null)}
            >
                <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="truncate pr-8">
                            {previewNote?.original_name ?? "Preview"}
                        </DialogTitle>
                    </DialogHeader>
                    {previewNote && (
                        <iframe
                            title="Note preview"
                            src={previewUrl(
                                routeScope,
                                subjectId,
                                previewNote
                            )}
                            className="flex-1 w-full min-h-0 rounded-md border bg-muted"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
