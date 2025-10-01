import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Resources',
    href: '/resources',
  },
  {
    title: 'Create',
    href: '/resources/create',
  },
];

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string;
}

interface CreateResourcePageProps {
  categories: Category[];
}

export default function Create({ categories }: CreateResourcePageProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Resource" />
      <div className="mx-auto flex h-full w-full max-w-[1920px] flex-1 flex-col gap-4 p-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Create Resource</h1>
              <p className="text-muted-foreground mt-1">Add a new resource with credentials and documentation</p>
            </div>
          </div>

          {/* Form */}
          <Form action="/resources" method="post" encType="multipart/form-data">
            {({ errors, processing }) => (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the basic details for your resource</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input id="title" name="title" placeholder="Enter resource title" required />
                      {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter resource description"
                        rows={4}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      />
                      {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" name="image" type="url" placeholder="https://example.com/image.jpg" />
                      {errors.image && <p className="text-destructive text-sm">{errors.image}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input id="url" name="url" type="url" placeholder="https://example.com" />
                      {errors.url && <p className="text-destructive text-sm">{errors.url}</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Credentials</CardTitle>
                    <CardDescription>Store login credentials and API keys securely</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login">Login / Username</Label>
                      <Input id="login" name="login" placeholder="Enter login or username" />
                      {errors.login && <p className="text-destructive text-sm">{errors.login}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" placeholder="Enter password" />
                      {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api_key">API Key</Label>
                      <textarea
                        id="api_key"
                        name="api_key"
                        placeholder="Enter API key"
                        rows={3}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      />
                      {errors.api_key && <p className="text-destructive text-sm">{errors.api_key}</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Select one or more categories for this resource</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`category-${category.id}`}
                            name="categories[]"
                            value={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`category-${category.id}`}
                              className="flex items-center text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              <span className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                              {category.name}
                            </label>
                            {category.description && <p className="text-muted-foreground text-sm">{category.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.categories && <p className="text-destructive mt-2 text-sm">{errors.categories}</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                    <CardDescription>Upload files related to this resource (max 10MB per file)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Input id="media" name="media[]" type="file" multiple onChange={handleFileChange} />
                      {mediaFiles.length > 0 && (
                        <div className="mt-2">
                          <p className="text-muted-foreground text-sm">
                            {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} selected
                          </p>
                        </div>
                      )}
                      {errors.media && <p className="text-destructive text-sm">{errors.media}</p>}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Link href="/resources">
                    <Button type="button" variant="outline" disabled={processing}>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Creating...' : 'Create Resource'}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
    </AppLayout>
  );
}
