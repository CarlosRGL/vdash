import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'tools',
    href: '/tools',
  },
  {
    title: 'Create',
    href: '/tools/create',
  },
];

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string;
}

interface CreatetoolPageProps {
  categories: Category[];
}

export default function Create({ categories }: CreatetoolPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6366f1');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [autoFetchMetadata, setAutoFetchMetadata] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [metadataError, setMetadataError] = useState('');

  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    image: '',
    url: '',
    login: '',
    password: '',
    api_key: '',
    categories: [] as number[],
    media: [] as File[],
  });

  const handleCategorySelect = (category: Category) => {
    if (!selectedCategories.find((c) => c.id === category.id)) {
      const newSelected = [...selectedCategories, category];
      setSelectedCategories(newSelected);
      setData(
        'categories',
        newSelected.map((c) => c.id),
      );
    }
    setOpen(false);
  };

  const handleCategoryRemove = (categoryId: number) => {
    const newSelected = selectedCategories.filter((c) => c.id !== categoryId);
    setSelectedCategories(newSelected);
    setData(
      'categories',
      newSelected.map((c) => c.id),
    );
  };

  const handleFetchMetadata = async () => {
    if (!data.url) {
      setMetadataError('Please enter a URL first');
      return;
    }

    setIsFetchingMetadata(true);
    setMetadataError('');

    try {
      const response = await fetch(route('tools.fetch-metadata'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          url: data.url,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch metadata');
      }

      // Update form with fetched metadata
      if (result.metadata.title) {
        setData('title', result.metadata.title);
      }
      if (result.metadata.description) {
        setData('description', result.metadata.description);
      }
      if (result.metadata.image) {
        setData('image', result.metadata.image);
      }
    } catch (error) {
      setMetadataError(error instanceof Error ? error.message : 'Failed to fetch metadata');
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    setIsCreatingCategory(true);
    setCategoryError('');

    try {
      const response = await fetch(route('categories.store'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription || null,
          color: newCategoryColor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      const { category: newCategory } = await response.json();

      // Add the new category to the selected categories
      const newSelected = [...selectedCategories, newCategory];
      setSelectedCategories(newSelected);
      setData(
        'categories',
        newSelected.map((c) => c.id),
      );

      // Reset form and close dialog
      setDialogOpen(false);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setNewCategoryColor('#6366f1');
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : 'Failed to create category');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setData('media', files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('tools.store'), {
      forceFormData: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Tool" />
      <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 p-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Create Tool</h1>
              <p className="text-muted-foreground mt-1">Add a new tool with credentials and documentation</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>URL & Auto-Fill</CardTitle>
                  <CardDescription>Enter the tool URL and optionally fetch metadata automatically</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      name="url"
                      type="url"
                      value={data.url}
                      onChange={(e) => setData('url', e.target.value)}
                      placeholder="https://example.com"
                      required
                    />
                    {errors.url && <p className="text-destructive text-sm">{errors.url}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-fetch"
                      checked={autoFetchMetadata}
                      onCheckedChange={(checked) => {
                        setAutoFetchMetadata(checked === true);
                        if (checked) {
                          handleFetchMetadata();
                        }
                      }}
                      disabled={!data.url || isFetchingMetadata}
                    />
                    <Label htmlFor="auto-fetch" className="cursor-pointer text-sm font-normal">
                      Automatically fetch title, description, and image from URL
                    </Label>
                  </div>

                  {isFetchingMetadata && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Fetching metadata...</span>
                    </div>
                  )}

                  {metadataError && <p className="text-destructive text-sm">{metadataError}</p>}
                </CardContent>
              </Card>

              {!autoFetchMetadata && (
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the basic details for your tool</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Enter tool title"
                        required
                      />
                      {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Enter tool description"
                        rows={4}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      />
                      {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        name="image"
                        type="url"
                        value={data.image}
                        onChange={(e) => setData('image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors.image && <p className="text-destructive text-sm">{errors.image}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {autoFetchMetadata && (
                <Card>
                  <CardHeader>
                    <CardTitle>Auto-Filled Information</CardTitle>
                    <CardDescription>Information fetched from the URL (you can edit these fields)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Enter tool title"
                        required
                      />
                      {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Enter tool description"
                        rows={4}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      />
                      {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        name="image"
                        type="url"
                        value={data.image}
                        onChange={(e) => setData('image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors.image && <p className="text-destructive text-sm">{errors.image}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Credentials</CardTitle>
                  <CardDescription>Store login credentials and API keys securely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login">Login / Username</Label>
                    <Input
                      id="login"
                      name="login"
                      value={data.login}
                      onChange={(e) => setData('login', e.target.value)}
                      placeholder="Enter login or username"
                    />
                    {errors.login && <p className="text-destructive text-sm">{errors.login}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="Enter password"
                    />
                    {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api_key">API Key</Label>
                    <textarea
                      id="api_key"
                      name="api_key"
                      value={data.api_key}
                      onChange={(e) => setData('api_key', e.target.value)}
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
                  <CardDescription>Select categories or create new ones for this tool</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Categories */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="text-sm"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          <span className="mr-1 h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                          {category.name}
                          <button type="button" onClick={() => handleCategoryRemove(category.id)} className="hover:text-destructive ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Combobox for selecting categories */}
                  <div className="flex gap-2">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="flex-1 justify-between">
                          Select categories...
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Search categories..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories
                                .filter((cat) => !selectedCategories.find((sc) => sc.id === cat.id))
                                .map((category) => (
                                  <CommandItem key={category.id} value={category.name} onSelect={() => handleCategorySelect(category)}>
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedCategories.find((c) => c.id === category.id) ? 'opacity-100' : 'opacity-0',
                                      )}
                                    />
                                    <span className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                                    <div className="flex flex-col">
                                      <span>{category.name}</span>
                                      {category.description && <span className="text-muted-foreground text-xs">{category.description}</span>}
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Dialog for creating new category */}
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Category</DialogTitle>
                          <DialogDescription>Add a new category to organize your tools</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-category-name">Category Name *</Label>
                            <Input
                              id="new-category-name"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="Enter category name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-category-description">Description</Label>
                            <textarea
                              id="new-category-description"
                              value={newCategoryDescription}
                              onChange={(e) => setNewCategoryDescription(e.target.value)}
                              placeholder="Enter category description"
                              rows={3}
                              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-category-color">Color</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="new-category-color"
                                type="color"
                                value={newCategoryColor}
                                onChange={(e) => setNewCategoryColor(e.target.value)}
                                className="h-10 w-20"
                              />
                              <Input
                                type="text"
                                value={newCategoryColor}
                                onChange={(e) => setNewCategoryColor(e.target.value)}
                                placeholder="#6366f1"
                                className="flex-1"
                              />
                            </div>
                          </div>
                          {categoryError && <p className="text-destructive text-sm">{categoryError}</p>}
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isCreatingCategory}>
                            Cancel
                          </Button>
                          <Button type="button" onClick={handleCreateCategory} disabled={!newCategoryName.trim() || isCreatingCategory}>
                            {isCreatingCategory ? 'Creating...' : 'Create Category'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Hidden inputs for form submission */}
                  {selectedCategories.map((category) => (
                    <input key={category.id} type="hidden" name="categories[]" value={category.id} />
                  ))}

                  {errors.categories && <p className="text-destructive text-sm">{errors.categories}</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>Upload files related to this tool (max 10MB per file)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Input id="media" name="media[]" type="file" multiple onChange={handleFileChange} />
                    {data.media.length > 0 && (
                      <div className="mt-2">
                        <p className="text-muted-foreground text-sm">
                          {data.media.length} file{data.media.length !== 1 ? 's' : ''} selected
                        </p>
                      </div>
                    )}
                    {errors.media && <p className="text-destructive text-sm">{errors.media}</p>}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Link href="/tools">
                  <Button type="button" variant="outline" disabled={processing}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Tool'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
