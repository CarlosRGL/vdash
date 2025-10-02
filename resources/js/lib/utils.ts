import { type ClassValue, clsx } from 'clsx';
import { isValid, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getMonthsLeft = (endDate: string | null) => {
  if (!endDate) return null;

  try {
    const end = parseISO(endDate);
    const now = new Date();

    if (!isValid(end)) return null;

    if (end < now) return 0; // Contract already ended

    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 30) {
      return `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
    }

    const monthsLeft = Math.ceil(daysLeft / 30.44); // Average days per month
    return `${monthsLeft} month${monthsLeft === 1 ? '' : 's'} left`;
  } catch {
    return null;
  }
};

export const parseStorageValue = (value: string | null): number | null => {
  if (!value) return null;
  // Extract numeric value and convert to MB
  const match = value.match(/([0-9,.]+)\s*(GB|MB|KB|B)?/i);
  if (!match) return null;

  const num = parseFloat(match[1].replace(',', ''));
  const unit = match[2]?.toUpperCase() || 'MB';

  switch (unit) {
    case 'GB':
      return num * 1024;
    case 'MB':
      return num;
    case 'KB':
      return num / 1024;
    case 'B':
      return num / (1024 * 1024);
    default:
      return num;
  }
};

export const formatStorage = (usage: string | null, limit: string | null) => {
  if (!usage && !limit) return 'N/A';
  if (!usage) return `0 / ${limit || 'N/A'}`;
  if (!limit) return usage;
  return `${usage} GB / ${limit} GB`;
};

export const getStoragePercentage = (usage: string | null, limit: string | null): number => {
  const usageValue = parseStorageValue(usage);
  const limitValue = parseStorageValue(limit);

  if (!usageValue || !limitValue || limitValue === 0) return 0;
  return Math.min(Math.round((usageValue / limitValue) * 100), 100);
};

export const getContractStatus = (startDate: string | null, endDate: string | null) => {
  if (!startDate || !endDate) return { status: 'unknown', color: 'bg-gray-400' };

  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const now = new Date();

    if (!isValid(start) || !isValid(end)) return { status: 'unknown', color: 'bg-gray-400' };

    if (now < start) return { status: 'upcoming', color: 'bg-blue-400' };
    if (now > end) return { status: 'expired', color: 'bg-red-400' };

    // Check if contract expires within 30 days
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'bg-orange-400' };

    return { status: 'active', color: 'bg-green-400' };
  } catch {
    return { status: 'unknown', color: 'bg-gray-400' };
  }
};

export const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-destructive';
  if (percentage >= 75) return 'bg-orange-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getPagespeedProgressColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-500';
  if (percentage >= 75) return 'bg-yellow-500';
  if (percentage >= 50) return 'bg-orange-500';
  return 'bg-red-500';
};
