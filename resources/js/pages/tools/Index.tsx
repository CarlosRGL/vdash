import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Copy, ExternalLink, Eye, EyeOff, Heart, KeyRound, Paperclip, Plus, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'tools',
    href: '/tools',
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

interface Tool {
  id: number;
  title: string;
  image: string | null;
  url: string | null;
  login: string | null;
  password: string | null;
  api_key: string | null;
  description: string | null;
  categories: Category[];
  media: Media[];
  favorited_count: number;
  is_favorited: boolean;
  created_at: string;
}

interface ToolsPageProps {
  tools: {
    data: Tool[];
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

interface CredentialFieldProps {
  label: string;
  value: string | null;
  icon: React.ReactNode;
  type?: 'text' | 'password';
}

function CredentialField({ label, value, icon, type = 'text' }: CredentialFieldProps) {
  const [copy, isCopied] = useCopyToClipboard();
  const [isRevealed, setIsRevealed] = useState(false);

  if (!value) return null;

  const displayValue = type === 'password' && !isRevealed ? '••••••••' : value;

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border p-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="text-muted-foreground flex-shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground mb-1 text-xs font-medium">{label}</p>
          <p className="font-mono text-sm break-all">{displayValue}</p>
        </div>
      </div>
      <div className="flex flex-shrink-0 gap-1">
        {type === 'password' && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsRevealed(!isRevealed)} title={isRevealed ? 'Hide' : 'Show'}>
            {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => copy(value)} title={isCopied ? 'Copied!' : 'Copy to clipboard'}>
          {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

interface CredentialsDialogProps {
  tool: Tool;
}

function CredentialsDialog({ tool }: CredentialsDialogProps) {
  const hasCredentials = tool.login || tool.password || tool.api_key;

  if (!hasCredentials) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Credentials
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Credentials for {tool.title}</DialogTitle>
          <DialogDescription>Copy credentials to your clipboard. Click the eye icon to reveal masked fields.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <CredentialField label="Login / Username" value={tool.login} icon={<ShieldCheck className="h-4 w-4" />} />
          <CredentialField label="Password" value={tool.password} icon={<KeyRound className="h-4 w-4" />} type="password" />
          <CredentialField label="API Key" value={tool.api_key} icon={<KeyRound className="h-4 w-4" />} type="password" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Index({ tools, categories, filters }: ToolsPageProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(filters.category);
  const [showFavorites, setShowFavorites] = useState(filters.favorites || false);
  useToast();
  const handleSearch = (value: string) => {
    setSearch(value);
    router.get(
      '/tools',
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
      '/tools',
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
      '/tools',
      { search, category: selectedCategory, favorites: value },
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  const toggleFavorite = (toolId: number) => {
    router.post(
      `/tools/${toolId}/favorite`,
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
        <Head title="Tools" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">tools</h1>
              <p className="text-muted-foreground mt-1">Manage your tools, credentials, and documentation</p>
            </div>
            <Link href="/tools/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add tool
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input placeholder="Search tools..." value={search} onChange={(e) => handleSearch(e.target.value)} className="pl-10" />
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

          {/* tools Grid */}
          {tools.data.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No tools found</p>
                <Link href="/tools/create">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first tool
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {tools.data.map((tool) => (
                <Card key={tool.id} className="flex flex-col">
                  {tool.image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img src={tool.image} alt={tool.title} className="h-full w-full object-cover object-center" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-1 text-lg">{tool.title}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => toggleFavorite(tool.id)} className="h-8 w-8 p-0">
                        <Heart className={`h-4 w-4 ${tool.is_favorited ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                    </div>
                    {tool.description && <CardDescription className="line-clamp-2">{tool.description}</CardDescription>}
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3">
                    {/* Categories */}
                    {tool.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tool.categories.map((category) => (
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
                    {tool.media.length > 0 && (
                      <div className="text-muted-foreground flex items-center text-sm">
                        <Paperclip className="mr-1 h-3 w-3" />
                        {tool.media.length} attachment{tool.media.length !== 1 ? 's' : ''}
                      </div>
                    )}

                    {/* URL */}
                    {tool.url && (
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center text-sm hover:underline">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Visit site
                      </a>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground flex items-center text-sm">
                        <Heart className="mr-1 h-3 w-3" />
                        {tool.favorited_count}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <CredentialsDialog tool={tool} />
                      <Link href={`/tools/${tool.id}/edit`}>
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
          {tools.last_page > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" disabled={tools.current_page === 1} onClick={() => router.get(`/tools?page=${tools.current_page - 1}`)}>
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {tools.current_page} of {tools.last_page}
              </span>
              <Button
                variant="outline"
                disabled={tools.current_page === tools.last_page}
                onClick={() => router.get(`/tools?page=${tools.current_page + 1}`)}
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
