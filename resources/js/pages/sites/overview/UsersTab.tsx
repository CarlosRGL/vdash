import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Site } from '@/types';
import { Link } from '@inertiajs/react';
import { Users } from 'lucide-react';

interface UsersTabProps {
  site: Site;
}

export default function UsersTab({ site }: UsersTabProps) {
  return (
    <div className="space-y-6">
      {site.user ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Site Owner
            </CardTitle>
            <CardDescription>User who owns this site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold dark:bg-gray-600">
                {site.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{site.user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{site.user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No user assigned</h3>
            <p className="mb-4 text-center text-gray-600 dark:text-gray-400">No user has been assigned to this site yet.</p>
            <Button asChild>
              <Link href={`/sites/${site.id}/users/assign`}>Assign User</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
