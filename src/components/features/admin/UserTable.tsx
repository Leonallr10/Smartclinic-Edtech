'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { type ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { roleColors, activeStatusColors } from '@/lib/status-colors';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

type CreateForm = {
  name: string;
  email: string;
  password: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  isActive: boolean;
};

type EditForm = {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
};

const emptyCreate: CreateForm = {
  name: '',
  email: '',
  password: '',
  role: 'PATIENT',
  isActive: true,
};

export default function UserTable({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [createForm, setCreateForm] = useState<CreateForm>(emptyCreate);
  const [editForm, setEditForm] = useState<EditForm>({
    name: '',
    email: '',
    password: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function toggleActive(id: string, currentState: boolean) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentState }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
      toast.success(`User ${!currentState ? 'activated' : 'deactivated'}`);
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || 'Action failed');
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || 'Failed to create user');
      return;
    }
    const created = await res.json();
    setUsers((prev) => [created, ...prev]);
    setCreateOpen(false);
    setCreateForm(emptyCreate);
    toast.success('User created');
    router.refresh();
  }

  function openEdit(user: User) {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      password: '',
      isActive: user.isActive,
    });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    const payload: Record<string, unknown> = {
      name: editForm.name,
      email: editForm.email,
      isActive: editForm.isActive,
    };
    if (editForm.password.trim()) payload.password = editForm.password;

    const res = await fetch(`/api/admin/users/${editUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || 'Failed to update user');
      return;
    }
    const updated = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...updated } : u)));
    setEditUser(null);
    toast.success('User updated');
    router.refresh();
  }

  async function handleDelete(user: User) {
    if (!window.confirm(`Delete ${user.name} (${user.email})? This cannot be undone.`)) {
      return;
    }
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || 'Failed to delete user');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    toast.success('User deleted');
    router.refresh();
  }

  const columns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('email')}</span>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant="secondary" className={roleColors[role]}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge
            variant="secondary"
            className={isActive ? activeStatusColors.active : activeStatusColors.inactive}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => openEdit(user)}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
            <Button
              onClick={() => toggleActive(user.id, user.isActive)}
              variant="outline"
              size="sm"
              className={
                user.isActive
                  ? 'rounded-lg text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30'
                  : 'rounded-lg text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30'
              }
            >
              {user.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              onClick={() => handleDelete(user)}
              variant="outline"
              size="sm"
              className="rounded-lg text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const filtered = filter ? users.filter((u) => u.role === filter) : users;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['', 'PATIENT', 'DOCTOR', 'ADMIN'].map((r) => (
            <Button
              key={r || 'all'}
              onClick={() => setFilter(r)}
              variant={filter === r ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
            >
              {r || 'All'}
            </Button>
          ))}
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="rounded-xl bg-violet-600 hover:bg-violet-500"
        >
          <Plus className="size-4" />
          Add user
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pageSize={10}
        searchKey="name"
        searchPlaceholder="Search by name..."
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>Add a patient, doctor, or admin account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Name</Label>
              <Input
                id="create-name"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                required
                minLength={6}
                value={createForm.password}
                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(value: 'PATIENT' | 'DOCTOR' | 'ADMIN') =>
                  setCreateForm((f) => ({ ...f, role: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PATIENT">Patient</SelectItem>
                  <SelectItem value="DOCTOR">Doctor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-500">
                {saving ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>Update profile details or reset password.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                required
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">New password (optional)</Label>
              <Input
                id="edit-password"
                type="password"
                minLength={6}
                placeholder="Leave blank to keep current"
                value={editForm.password}
                onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editForm.isActive ? 'active' : 'inactive'}
                onValueChange={(value) =>
                  setEditForm((f) => ({ ...f, isActive: value === 'active' }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-500">
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
