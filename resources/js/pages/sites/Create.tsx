import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sites',
    href: '/sites',
  },
  {
    title: 'Create',
    href: '/sites/create',
  },
];

export default function CreateSite() {
  const { setData, post, processing, errors } = useForm({
    name: '',
    url: '',
    description: '',
    type: 'WordPress',
    team: 'quai13',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('sites.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Site" />
      <div className="px-4">
        <div className="container py-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Site</CardTitle>
              <CardDescription>Add a new site to your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="My Site" onChange={(e) => setData('name', e.target.value)} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  <p className="text-muted-foreground text-sm">The name of your site</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input id="url" placeholder="https://example.com" onChange={(e) => setData('url', e.target.value)} />
                  {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                  <p className="text-muted-foreground text-sm">The URL of your site</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="A brief description of the site"
                    onChange={(e) => setData('description', e.target.value)}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  <p className="text-muted-foreground text-sm">Optional description of your site</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select onValueChange={(value) => setData('type', value)} defaultValue="WordPress">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a site type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WordPress">WordPress</SelectItem>
                        <SelectItem value="Drupal">Drupal</SelectItem>
                        <SelectItem value="SPIP">SPIP</SelectItem>
                        <SelectItem value="Typo3">Typo3</SelectItem>
                        <SelectItem value="laravel">Laravel</SelectItem>
                        <SelectItem value="symfony">Symfony</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                    <p className="text-muted-foreground text-sm">The type of site</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Select onValueChange={(value) => setData('team', value)} defaultValue="quai13">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quai13">Quai13</SelectItem>
                        <SelectItem value="vernalis">Vernalis</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.team && <p className="text-sm text-red-500">{errors.team}</p>}
                    <p className="text-muted-foreground text-sm">The team responsible for the site</p>
                  </div>
                </div>
                {/* api sync */}

                <div className="flex justify-end">
                  <Button type="submit" disabled={processing}>
                    Create Site
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
