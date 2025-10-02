import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FlashMessageProps {
  message: string;
  type?: 'success' | 'error';
}

export function FlashMessage({ message, type = 'success' }: FlashMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) {
    return null;
  }

  return (
    <Alert className={`mb-4 ${type === 'success' ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800'}`}>
      {type === 'success' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
      <AlertTitle className="ml-2 font-medium">{type === 'success' ? 'Success' : 'Error'}</AlertTitle>
      <AlertDescription className="ml-2">{message}</AlertDescription>
    </Alert>
  );
}
