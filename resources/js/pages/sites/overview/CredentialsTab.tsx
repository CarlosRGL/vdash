import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { type Site } from '@/types';
import { Link } from '@inertiajs/react';
import { Copy, Database, ExternalLink, Eye, EyeOff, Key, Server, Shield } from 'lucide-react';

interface CredentialsTabProps {
  site: Site;
  showPasswords: { [key: string]: boolean };
  togglePasswordVisibility: (field: string) => void;
}

export function CredentialsTab({ site, showPasswords, togglePasswordVisibility }: CredentialsTabProps) {
  const [copyToClipboard] = useCopyToClipboard();
  const { toast } = useToast();

  const handleCopy = (value: string, label: string) => {
    copyToClipboard(value).then(() => toast.success(`${label} copied to clipboard`));
  };

  const CredentialField = ({
    label,
    value,
    type = 'text',
    isPassword = false,
    isUrl = false,
  }: {
    label: string;
    value: string;
    type?: string;
    isPassword?: boolean;
    isUrl?: boolean;
  }) => (
    <div className="grid grid-cols-3 items-center gap-3 py-2 text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <div className="col-span-2 flex items-center gap-2">
        {isUrl ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate font-mono text-blue-600 hover:underline dark:text-blue-400"
          >
            {value}
          </a>
        ) : (
          <span className="flex-1 truncate font-mono">{isPassword && !showPasswords[type] ? '••••••••' : value}</span>
        )}
        <div className="flex items-center gap-1">
          {isPassword && (
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => togglePasswordVisibility(type)}>
              {showPasswords[type] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          )}
          {isUrl && (
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
              <a href={value} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleCopy(value, label)}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (!site.credential) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Shield className="text-muted-foreground mb-3 h-10 w-10" />
          <h3 className="mb-2 text-base font-semibold">No credentials found</h3>
          <p className="text-muted-foreground mb-4 text-center text-sm">No credentials have been added for this site yet.</p>
          <Button asChild size="sm">
            <Link href={`/sites/${site.id}/credentials/edit`}>Add Credentials</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const credential = site.credential;
  const hasFtp = credential.ftp_host || credential.ftp_username || credential.ftp_password;
  const hasDb = credential.db_host || credential.db_name || credential.db_username || credential.db_password;
  const hasLogin = credential.login_url || credential.login_username || credential.login_password;

  const SectionHeader = ({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) => (
    <div className="flex items-center gap-2 pt-6 pb-3 first:pt-0">
      <Icon className="text-muted-foreground h-4 w-4" />
      <span className="text-muted-foreground text-sm font-medium">{title}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4" />
          Site Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-border/50 divide-y">
          {/* FTP Credentials */}
          {hasFtp && (
            <>
              <SectionHeader icon={Server} title="FTP Access" />
              {credential.ftp_host && <CredentialField label="Host" value={credential.ftp_host} />}
              {credential.ftp_username && <CredentialField label="Username" value={credential.ftp_username} />}
              {credential.ftp_password && <CredentialField label="Password" value={credential.ftp_password} type="ftp_password" isPassword />}
            </>
          )}

          {/* Database Credentials */}
          {hasDb && (
            <>
              <SectionHeader icon={Database} title="Database Access" />
              {credential.db_host && <CredentialField label="Host" value={credential.db_host} />}
              {credential.db_name && <CredentialField label="Database" value={credential.db_name} />}
              {credential.db_username && <CredentialField label="Username" value={credential.db_username} />}
              {credential.db_password && <CredentialField label="Password" value={credential.db_password} type="db_password" isPassword />}
            </>
          )}

          {/* Login Credentials */}
          {hasLogin && (
            <>
              <SectionHeader icon={Key} title="Login Access" />
              {credential.login_url && <CredentialField label="URL" value={credential.login_url} isUrl />}
              {credential.login_username && <CredentialField label="Username" value={credential.login_username} />}
              {credential.login_password && <CredentialField label="Password" value={credential.login_password} type="login_password" isPassword />}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
