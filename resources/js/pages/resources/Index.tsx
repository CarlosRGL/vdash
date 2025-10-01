import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink, Heart, Paperclip, Plus, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Resources',
    href: '/resources',
  },
];

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string;
}

interface Media {
  id: number;
  name: string;
  url: string;
  size: number;
}

interface Resource {
  id: number;
  title: string;
  image: string | null;
  url: string | null;
  description: string | null;
  categories: Category[];
  media: Media[];
  favorited_count: number;
  is_favorited: boolean;
  created_at: string;
}

interface ResourcesPageProps {
  resources: {
    data: Resource[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  categories: Category[];
  filters: {
    search?: string;
    category?: number;
    favorites?: boolean;
  };
}

export default function Index({ resources, categories, filters }: ResourcesPageProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(filters.category);
  const [showFavorites, setShowFavorites] = useState(filters.favorites || false);

  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(
      '/resources',
      { search: value, category: selectedCategory, favorites: showFavorites },
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleCategoryFilter = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    router.get(
      '/resources',
      { search, category: categoryId, favorites: showFavorites },
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleFavoritesFilter = (value: boolean) => {
    setShowFavorites(value);
    router.get(
      '/resources',
      { search, category: selectedCategory, favorites: value },
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  const toggleFavorite = (resourceId: number) => {
    router.post(
      `/resources/${resourceId}/favorite`,
      {},
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="mx-auto flex h-full w-full max-w-[1920px] flex-1 flex-col gap-4 p-4">
        <Head title="Resources" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Resources</h1>
              <p className="text-muted-foreground mt-1">Manage your resources, credentials, and documentation</p>
            </div>
            <Link href="/resources/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input placeholder="Search resources..." value={search} onChange={(e) => handleSearch(e.target.value)} className="pl-10" />
            </div>

            <div className="flex gap-2">
              <Button variant={showFavorites ? 'default' : 'outline'} onClick={() => handleFavoritesFilter(!showFavorites)}>
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </Button>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2">
            <Button variant={selectedCategory === undefined ? 'default' : 'outline'} size="sm" onClick={() => handleCategoryFilter(undefined)}>
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryFilter(category.id)}
              >
                <span className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                {category.name}
              </Button>
            ))}
          </div>

          {/* Resources Grid */}
          {resources.data.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No resources found</p>
                <Link href="/resources/create">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first resource
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.data.map((resource) => (
                <Card key={resource.id} className="flex flex-col">
                  {resource.image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img src={resource.image} alt={resource.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-1">{resource.title}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => toggleFavorite(resource.id)} className="h-8 w-8 p-0">
                        <Heart className={`h-4 w-4 ${resource.is_favorited ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                    </div>
                    {resource.description && <CardDescription className="line-clamp-2">{resource.description}</CardDescription>}
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3">
                    {/* Categories */}
                    {resource.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {resource.categories.map((category) => (
                          <Badge
                            key={category.id}
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${category.color}20`,
                              color: category.color,
                            }}
                          >
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Media Count */}
                    {resource.media.length > 0 && (
                      <div className="text-muted-foreground flex items-center text-sm">
                        <Paperclip className="mr-1 h-3 w-3" />
                        {resource.media.length} attachment{resource.media.length !== 1 ? 's' : ''}
                      </div>
                    )}

                    {/* URL */}
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary flex items-center text-sm hover:underline"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Visit site
                      </a>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <div className="text-muted-foreground flex items-center text-sm">
                      <Heart className="mr-1 h-3 w-3" />
                      {resource.favorited_count}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/resources/${resource.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/resources/${resource.id}/edit`}>
                        <Button variant="default" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {resources.last_page > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={resources.current_page === 1}
                onClick={() => router.get(`/resources?page=${resources.current_page - 1}`)}
              >
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {resources.current_page} of {resources.last_page}
              </span>
              <Button
                variant="outline"
                disabled={resources.current_page === resources.last_page}
                onClick={() => router.get(`/resources?page=${resources.current_page + 1}`)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
