import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SiteLayout from '@/layouts/sites/layout';
import { type BreadcrumbItem, type Site } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface EditSiteProps {
  site: Site;
}

type SiteType = 'WordPress' | 'Drupal' | 'SPIP' | 'Typo3' | 'laravel' | 'symfony' | 'other';
type SiteTeam = 'quai13' | 'vernalis';

export default function EditSite({ site }: EditSiteProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Sites',
      href: '/sites',
    },
    {
      title: site.name,
      href: `/sites/${site.id}`,
    },
    {
      title: 'Edit',
      href: `/sites/${site.id}/edit`,
    },
  ];

  const { setData, data, put, processing, errors } = useForm({
    name: site.name,
    url: site.url,
    description: site.description || '',
    type: site.type as SiteType,
    team: site.team as SiteTeam,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('sites.update', site.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Site: ${site.name}`} />
      <SiteLayout siteId={site.id} siteName={site.name}>
        <Card>
          <CardHeader>
            <CardTitle>Site Details</CardTitle>
            <CardDescription>Update basic site information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="My Site" defaultValue={data.name} onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                <p className="text-muted-foreground text-sm">The name of your site</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" placeholder="https://example.com" defaultValue={data.url} onChange={(e) => setData('url', e.target.value)} />
                {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                <p className="text-muted-foreground text-sm">The URL of your site</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="A brief description of the site"
                  defaultValue={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                <p className="text-muted-foreground text-sm">Optional description of your site</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select onValueChange={(value: SiteType) => setData('type', value)} defaultValue={data.type}>
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
                  <Select onValueChange={(value: SiteTeam) => setData('team', value)} defaultValue={data.team}>
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

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  Update Site
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SiteLayout>
    </AppLayout>
  );
}
