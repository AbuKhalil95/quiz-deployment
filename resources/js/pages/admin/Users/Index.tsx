import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
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
import { Plus, Eye, Trash2, Pencil } from "lucide-react";
import { CreateUserDialog } from "./_components/CreateUserDialog";
import { ViewUserDialog } from "./_components/ViewUserDialog";
import { DeleteUserDialog } from "./_components/DeleteUserDialog";
import { EditUserRoleDialog } from "./_components/EditUserRoleDialog";
import { SmartPagination } from "@/components/common/SmartPagination";

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{ id: number; name: string }>;
}
interface Role {
    id: number;
    name: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        roles: Role[];
    };
}

export default function Index({ users, filters }: any) {
    const [search, setSearch] = useState(filters.search || "");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                "/admin/users",
                { search },
                { preserveState: true, replace: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const goToPage = (url: string | null) => {
        if (url) router.get(url);
    };

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editRoleOpen, setEditRoleOpen] = useState(false);
    const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(
        null
    );

    const handleView = (user: User) => {
        setSelectedUser(user);
        setViewDialogOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteSuccess = () => {
        setSelectedUser(null);
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: "Dashboard", href: "/admin" },
                { title: "Users", href: "/admin/users" },
            ]}
        >
            <Head title="Users" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Users</CardTitle>
                            <Button onClick={() => setCreateDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
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
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Roles</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center"
                                        >
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.roles
                                                    .map((role) => role.name)
                                                    .join(", ") || "No roles"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleView(user)
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUserForRole(
                                                                user
                                                            );
                                                            setEditRoleOpen(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    {!user.roles.some(
                                                        (role) =>
                                                            role.name ===
                                                            "admin"
                                                    ) && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <SmartPagination
                            currentPage={users.current_page}
                            totalPages={users.last_page}
                            onPageChange={() => {}}
                            prevPageUrl={users.prev_page_url}
                            nextPageUrl={users.next_page_url}
                            onUrlChange={goToPage}
                            buildUrl={(page) => `/admin/users?page=${page}`}
                        />
                    </CardContent>
                </Card>

                {/* Page-specific dialogs */}
                <EditUserRoleDialog
                    open={editRoleOpen}
                    onOpenChange={setEditRoleOpen}
                    user={selectedUserForRole}
                />
                <CreateUserDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                />
                <ViewUserDialog
                    open={viewDialogOpen}
                    onOpenChange={setViewDialogOpen}
                    user={selectedUser}
                />
                <DeleteUserDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    user={selectedUser}
                    onSuccess={handleDeleteSuccess}
                />
            </div>
        </AdminLayout>
    );
}
