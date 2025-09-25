import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ToastData {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  description?: string;
}

export function useToast() {
  const page = usePage();
  const flash = page.props.flash as { toast?: ToastData } | undefined;

  useEffect(() => {
    if (flash?.toast) {
      const toastData = flash.toast;
      switch (toastData.type) {
        case 'success':
          toast.success(toastData.message, {
            description: toastData.description,
          });
          break;
        case 'error':
          toast.error(toastData.message, {
            description: toastData.description,
          });
          break;
        case 'warning':
          toast.warning(toastData.message, {
            description: toastData.description,
          });
          break;
        case 'info':
          toast.info(toastData.message, {
            description: toastData.description,
          });
          break;
      }
    }
  }, [flash?.toast]);

  return { toast };
}
