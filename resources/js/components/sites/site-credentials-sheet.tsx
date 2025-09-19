import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { type SiteCredential } from '@/types';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface SiteCredentialsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: SiteCredential | null;
  siteName: string;
}

export function SiteCredentialsSheet({ open, onOpenChange, credentials, siteName }: SiteCredentialsSheetProps) {
  const { toast } = useToast();
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

  const handleCopy = async (value: string | null, label: string) => {
    if (!value) return;

    // Fallback for insecure context or unsupported browsers
    const fallbackCopyTextToClipboard = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      let success = false;
      try {
        success = document.execCommand('copy');
      } catch {
        success = false;
      }
      document.body.removeChild(textArea);
      return success;
    };

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        toast.success(`${label} copied to clipboard`);
      } else {
        // Fallback for insecure context or unsupported browsers
        const success = fallbackCopyTextToClipboard(value);
        if (success) {
          toast.success(`${label} copied to clipboard`);
        } else {
          toast.error('Failed to copy');
        }
      }
    } catch {
      toast.error('Failed to copy');
    }
  };

  const toggleVisibility = (fieldKey: string) => {
    setVisibleFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldKey)) {
        newSet.delete(fieldKey);
      } else {
        newSet.add(fieldKey);
      }
      return newSet;
    });
  };

  const CredentialField = ({
    label,
    value,
    fieldKey,
    isPassword = false,
  }: {
    label: string;
    value: string | null;
    fieldKey: string;
    isPassword?: boolean;
  }) => {
    if (!value) return null;

    const isVisible = visibleFields.has(fieldKey);
    const displayValue = isPassword && !isVisible ? '••••••••••••' : value;

    return (
      <div className="space-y-1 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <label className="text-foreground text-sm font-medium">{label}</label>
          <div className="flex items-center gap-1">
            {isPassword && (
              <Button variant="ghost" size="sm" onClick={() => toggleVisibility(fieldKey)} className="h-8 w-8 p-0">
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">
                  {isVisible ? 'Hide' : 'Show'} {label}
                </span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => handleCopy(value, label)} className="h-8 w-8 p-0">
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy {label}</span>
            </Button>
          </div>
        </div>
        <div className="bg-muted rounded-md p-3 py-1">
          <code className="text-muted-foreground font-mono text-xs break-all">{displayValue}</code>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Site Credentials</SheetTitle>
          <SheetDescription>
            Access credentials for <span className="font-medium">{siteName}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {credentials ? (
              <>
                <CredentialField label="Login URL" value={credentials.login_url} fieldKey="login_url" />
                <CredentialField label="Username" value={credentials.login_username} fieldKey="login_username" />
                <CredentialField label="Password" value={credentials.login_password} fieldKey="login_password" isPassword={true} />
                <CredentialField label="FTP Username" value={credentials.ftp_username} fieldKey="ftp_username" />
                <CredentialField label="FTP Password" value={credentials.ftp_password} fieldKey="ftp_password" isPassword={true} />
                <CredentialField label="Database Username" value={credentials.db_username} fieldKey="db_username" />
                <CredentialField label="Database Password" value={credentials.db_password} fieldKey="db_password" isPassword={true} />
                <CredentialField label="Database Host" value={credentials.db_host} fieldKey="db_host" />
              </>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">No credentials available for this site.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
