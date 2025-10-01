import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role, type User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Trash2, Upload } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface EditUserProps {
  user: User;
  roles: Role[];
}

export default function EditUser({ user, roles }: EditUserProps) {
  const getInitials = useInitials();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Users',
      href: '/users',
    },
    {
      title: `Edit User: ${user.name}`,
      href: `/users/${user.id}/edit`,
    },
  ];

  // Get the first role ID as a string if available
  const initialRoleId = user.roles && user.roles.length > 0 ? user.roles[0].id.toString() : '';

  const { data, setData, post, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    roles: initialRoleId ? [initialRoleId] : [],
    avatar: null as File | null,
    _method: 'put',
  });
  const { delete: destroy, processing: deleteProcessing } = useForm({});
  const [confirmEmail, setConfirmEmail] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setData('avatar', null);
    setAvatarPreview(user.avatar || null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post(route('users.update', { user: user.id }), {
      forceFormData: true,
    });
  };

  const handleRoleChange = (roleId: string) => {
    setData('roles', [roleId]);
  };

  const handleDeleteUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (confirmEmail !== user.email) {
      return;
    }

    destroy(route('users.destroy', { user: user.id }), {
      preserveScroll: true,
      onFinish: () => setConfirmEmail(''),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit User: ${user.name}`} />
      <div className="container mx-auto py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
              <CardDescription>Update user information</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarPreview || undefined} alt={user.name} />
                      <AvatarFallback className="bg-neutral-200 text-2xl text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Photo
                        </Button>
                        {avatarPreview && (
                          <Button type="button" variant="outline" size="sm" onClick={removeAvatar}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">JPG, PNG or GIF. Max size 2MB.</p>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      {errors.avatar && <p className="text-sm text-red-500">{errors.avatar}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password (leave blank to keep current)</Label>
                  <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirm Password</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={handleRoleChange} value={data.roles[0] ?? undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.roles && <p className="text-sm text-red-500">{errors.roles}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" type="button" asChild>
                  <Link href={route('users.index')}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  Update User
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete User</CardTitle>
              <CardDescription>Permanently remove this user and all of their data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="space-y-0.5 text-red-600 dark:text-red-100">
                  <p className="font-medium">Warning</p>
                  <p className="text-sm">This action cannot be undone.</p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete user</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Delete {user.name}</DialogTitle>
                    <DialogDescription>
                      Once this user is deleted, all of their associated resources and data will be permanently removed. Please confirm by typing
                      their email address.
                    </DialogDescription>
                    <form className="space-y-6" onSubmit={handleDeleteUser}>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-email">Email confirmation</Label>
                        <Input
                          id="confirm-email"
                          type="email"
                          value={confirmEmail}
                          onChange={(event) => setConfirmEmail(event.target.value)}
                          placeholder={user.email}
                          autoFocus
                        />
                        <p className="text-muted-foreground text-sm">
                          Type <span className="font-semibold">{user.email}</span> to confirm.
                        </p>
                        {confirmEmail && confirmEmail !== user.email && (
                          <p className="text-sm text-red-500">The email you entered does not match this user.</p>
                        )}
                      </div>

                      <DialogFooter className="gap-2">
                        <DialogClose asChild>
                          <Button variant="secondary" type="button">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button variant="destructive" type="submit" disabled={deleteProcessing || confirmEmail !== user.email}>
                          {deleteProcessing ? 'Deleting...' : 'Delete user'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
