import { useForm, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    SubjectNotesReadOnly,
    type SubjectNoteRow,
} from "@/components/subject-notes/SubjectNotesReadOnly";

export type { SubjectNoteRow };

interface SubjectNotesSectionProps {
    subjectId: number;
    notes: SubjectNoteRow[];
}

export function SubjectNotesSection({
    subjectId,
    notes,
}: SubjectNotesSectionProps) {
    const form = useForm<{ file: File | null }>({ file: null });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        form.setData("file", f);
        e.target.value = "";
    };

    const submitUpload = () => {
        if (!form.data.file) {
            toast.error("Choose a file first.");
            return;
        }
        form.post(route("admin.subjects.notes.store", subjectId), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                toast.success("Note uploaded.");
            },
            onError: (errors) => {
                const msg =
                    (errors.file as string) ||
                    Object.values(errors)[0] ||
                    "Upload failed.";
                toast.error(String(msg));
            },
        });
    };

    const handleDelete = (note: SubjectNoteRow) => {
        router.delete(
            route("admin.subjects.notes.destroy", {
                subject: subjectId,
                note: note.id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Note removed."),
                onError: () => toast.error("Could not remove note."),
            }
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload note</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        PDF, plain text, Word, Excel, and PowerPoint (max 20
                        MB). Office previews use Microsoft Office Online when
                        your app URL is reachable from the internet.
                    </p>
                </CardHeader>
                <CardContent className="flex flex-wrap items-end gap-3">
                    <div className="space-y-2">
                        <label
                            htmlFor="subject-note-file"
                            className="text-sm font-medium"
                        >
                            File
                        </label>
                        <input
                            id="subject-note-file"
                            type="file"
                            accept=".pdf,.txt,.csv,.md,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            className="block w-full max-w-md text-sm"
                            onChange={handleFileChange}
                            disabled={form.processing}
                        />
                    </div>
                    <Button
                        type="button"
                        disabled={form.processing || !form.data.file}
                        onClick={submitUpload}
                    >
                        <FileUp className="mr-2 h-4 w-4" />
                        {form.processing ? "Uploading…" : "Upload"}
                    </Button>
                </CardContent>
            </Card>

            <SubjectNotesReadOnly
                subjectId={subjectId}
                notes={notes}
                routeScope="admin"
                renderExtraActions={(note) => (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(note)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                )}
            />
        </div>
    );
}
