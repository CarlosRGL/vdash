import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Trash2, Upload } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile',
  },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth } = usePage<SharedData>().props;
  const getInitials = useInitials();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(auth.user.avatar || null);

  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    name: auth.user.name,
    email: auth.user.email,
    avatar: null as File | null,
    _method: 'patch',
  });

  const { delete: deleteAvatar, processing: deletingAvatar } = useForm({});

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
    deleteAvatar(route('profile.avatar.delete'), {
      preserveScroll: true,
      onSuccess: () => {
        setAvatarPreview(null);
        setData('avatar', null);
      },
    });
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('profile.update'), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        setAvatarPreview(auth.user.avatar || null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Profile information" description="Update your name and email address" />

          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview || undefined} alt={auth.user.name} />
                  <AvatarFallback className="bg-neutral-200 text-2xl text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(auth.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                    {avatarPreview && (
                      <Button type="button" variant="outline" size="sm" onClick={removeAvatar} disabled={deletingAvatar}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingAvatar ? 'Removing...' : 'Remove'}
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
                  <InputError className="mt-1" message={errors.avatar} />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>

              <Input
                id="name"
                className="mt-1 block w-full"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                autoComplete="name"
                placeholder="Full name"
              />

              <InputError className="mt-2" message={errors.name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>

              <Input
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                autoComplete="username"
                placeholder="Email address"
              />

              <InputError className="mt-2" message={errors.email} />
            </div>

            {mustVerifyEmail && auth.user.email_verified_at === null && (
              <div>
                <p className="text-muted-foreground -mt-4 text-sm">
                  Your email address is unverified.{' '}
                  <Link
                    href={route('verification.send')}
                    method="post"
                    as="button"
                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                  >
                    Click here to resend the verification email.
                  </Link>
                </p>

                {status === 'verification-link-sent' && (
                  <div className="mt-2 text-sm font-medium text-green-600">A new verification link has been sent to your email address.</div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button disabled={processing}>Save</Button>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">Saved</p>
              </Transition>
            </div>
          </form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
