import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Site } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Copy, Database, ExternalLink, Eye, EyeOff, Globe, HardDrive, Key, Monitor, Server, Shield, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
  site: Site;
}

function Show({ site }: Props) {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You might want to add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStoragePercentage = () => {
    if (!site.contract?.contract_storage_usage || !site.contract?.contract_storage_limit) {
      return 0;
    }
    const usage = parseFloat(site.contract.contract_storage_usage);
    const limit = parseFloat(site.contract.contract_storage_limit);
    return isNaN(usage) || isNaN(limit) || limit === 0 ? 0 : (usage / limit) * 100;
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Sites',
      href: '/sites',
    },
    {
      title: site.name,
      href: `/sites/${site.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${site.name} - Site Details`} />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold">{site.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {site.url && (
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Globe className="h-4 w-4" />
                    {site.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {site.type && <Badge variant="secondary">{site.type}</Badge>}
                {site.team && <Badge variant="outline">{site.team}</Badge>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/sites/${site.id}/edit`}>Edit Site</Link>
              </Button>
              <Button asChild>
                <Link href="/sites">Back to Sites</Link>
              </Button>
            </div>
          </div>

          {site.description && (
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300">{site.description}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="server">Server Info</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Site URL</CardTitle>
                  <Globe className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {site.url ? (
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                        {site.url}
                      </a>
                    ) : (
                      <span className="text-gray-500">Not set</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Site Type</CardTitle>
                  <Monitor className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{site.type || <span className="text-gray-500">Not specified</span>}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team</CardTitle>
                  <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{site.team || <span className="text-gray-500">Not assigned</span>}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
                <CardDescription>Basic details about this site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                    <p className="text-sm">{formatDate(site.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                    <p className="text-sm">{formatDate(site.updated_at)}</p>
                  </div>
                </div>
                {site.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                    <p className="mt-1 text-sm">{site.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="space-y-6">
            {site.credential ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* FTP Credentials */}
                {(site.credential.ftp_host || site.credential.ftp_username) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        FTP Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {site.credential.ftp_host && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Host:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{site.credential.ftp_host}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.ftp_host!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {site.credential.ftp_username && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Username:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{site.credential.ftp_username}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.ftp_username!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {site.credential.ftp_password && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Password:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{showPasswords.ftp_password ? site.credential.ftp_password : '••••••••'}</span>
                            <Button size="sm" variant="ghost" onClick={() => togglePasswordVisibility('ftp_password')}>
                              {showPasswords.ftp_password ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.ftp_password!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Database Credentials */}
                {(site.credential.db_host || site.credential.db_name) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Database Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {site.credential.db_host && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Host:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{site.credential.db_host}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.db_host!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {site.credential.db_name && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Database:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{site.credential.db_name}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.db_name!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {site.credential.db_username && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Username:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{site.credential.db_username}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.db_username!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {site.credential.db_password && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Password:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{showPasswords.db_password ? site.credential.db_password : '••••••••'}</span>
                            <Button size="sm" variant="ghost" onClick={() => togglePasswordVisibility('db_password')}>
                              {showPasswords.db_password ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.db_password!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Login Credentials */}
                {(site.credential.login_url || site.credential.login_username) && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Login Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {site.credential.login_url && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Login URL:</span>
                          <div className="flex items-center gap-2">
                            <a
                              href={site.credential.login_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-sm text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {site.credential.login_url}
                            </a>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.login_url!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {site.credential.login_username && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Username:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{site.credential.login_username}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.login_username!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {site.credential.login_password && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Password:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{showPasswords.login_password ? site.credential.login_password : '••••••••'}</span>
                            <Button size="sm" variant="ghost" onClick={() => togglePasswordVisibility('login_password')}>
                              {showPasswords.login_password ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.login_password!)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Shield className="mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No credentials found</h3>
                  <p className="mb-4 text-center text-gray-600 dark:text-gray-400">No credentials have been added for this site yet.</p>
                  <Button asChild>
                    <Link href={`/sites/${site.id}/credentials/create`}>Add Credentials</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Server Info Tab */}
          <TabsContent value="server" className="space-y-6">
            {site.server_info ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      PHP Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {site.server_info.php_version && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">PHP Version:</span>
                        <Badge variant="secondary">{site.server_info.php_version}</Badge>
                      </div>
                    )}
                    {site.server_info.php_memory_limit && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Memory Limit:</span>
                        <span className="text-sm">{site.server_info.php_memory_limit}</span>
                      </div>
                    )}
                    {site.server_info.php_max_execution_time && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Max Execution Time:</span>
                        <span className="text-sm">{site.server_info.php_max_execution_time}s</span>
                      </div>
                    )}
                    {site.server_info.php_post_max_size && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Post Max Size:</span>
                        <span className="text-sm">{site.server_info.php_post_max_size}</span>
                      </div>
                    )}
                    {site.server_info.php_upload_max_filesize && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Upload Max Filesize:</span>
                        <span className="text-sm">{site.server_info.php_upload_max_filesize}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Database Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {site.server_info.mysql_version && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">MySQL Version:</span>
                        <Badge variant="secondary">{site.server_info.mysql_version}</Badge>
                      </div>
                    )}
                    {site.server_info.mysql_server_info && (
                      <div>
                        <span className="text-sm font-medium">Server Info:</span>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{site.server_info.mysql_server_info}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Server Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {site.server_info.server_ip && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Server IP:</span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-sm">{site.server_info.server_ip}</span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.server_info!.server_ip!)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {site.server_info.server_hostname && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Hostname:</span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-sm">{site.server_info.server_hostname}</span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.server_info!.server_hostname!)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Server className="mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No server information found</h3>
                  <p className="mb-4 text-center text-gray-600 dark:text-gray-400">Server information has not been added for this site yet.</p>
                  <Button asChild>
                    <Link href={`/sites/${site.id}/server-info/create`}>Add Server Info</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contract Tab */}
          <TabsContent value="contract" className="space-y-6">
            {site.contract ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Contract Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {site.contract.contract_start_date && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date:</span>
                        <p className="text-lg font-semibold">{formatDate(site.contract.contract_start_date)}</p>
                      </div>
                    )}
                    {site.contract.contract_end_date && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date:</span>
                        <p className="text-lg font-semibold">{formatDate(site.contract.contract_end_date)}</p>
                      </div>
                    )}
                    {site.contract.contract_capacity && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity:</span>
                        <p className="text-lg font-semibold">{site.contract.contract_capacity}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5" />
                      Storage Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {site.contract.contract_storage_usage !== null && site.contract.contract_storage_limit !== null && (
                      <>
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Used:</span>
                            <p className="text-lg font-semibold">{site.contract.contract_storage_usage} GB</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Limit:</span>
                            <p className="text-lg font-semibold">{site.contract.contract_storage_limit} GB</p>
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-sm">
                            <span>Usage</span>
                            <span>{getStoragePercentage().toFixed(1)}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-2 rounded-full ${
                                getStoragePercentage() > 90 ? 'bg-red-500' : getStoragePercentage() > 75 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No contract information found</h3>
                  <p className="mb-4 text-center text-gray-600 dark:text-gray-400">Contract details have not been added for this site yet.</p>
                  <Button asChild>
                    <Link href={`/sites/${site.id}/contract/create`}>Add Contract Info</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

export default Show;
