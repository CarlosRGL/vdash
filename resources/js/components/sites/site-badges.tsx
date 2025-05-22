import { Badge } from '@/components/ui/badge';

interface SiteTypeBadgeProps {
  type: string;
}

interface SiteTeamBadgeProps {
  team: string;
}

export function SiteTypeBadge({ type }: SiteTypeBadgeProps) {
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'WordPress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Drupal':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'SPIP':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Typo3':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'laravel':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'symfony':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'other':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return <Badge className={getTypeBadgeColor(type)}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
}

export function SiteTeamBadge({ team }: SiteTeamBadgeProps) {
  const getTeamBadgeColor = (team: string) => {
    switch (team) {
      case 'quai13':
        return 'bg-[#FE6213]/10 text-[#FE6213] border border-[#FE6213]/30 dark:bg-[#FE6213]/20 dark:text-[#FE6213] dark:border-[#FE6213]/50';
      case 'vernalis':
        return 'bg-[#01BB9D]/10 text-[#01BB9D] border border-[#01BB9D]/30 dark:bg-[#01BB9D]/20 dark:text-[#01BB9D] dark:border-[#01BB9D]/50';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  return <Badge className={getTeamBadgeColor(team)}>{team.charAt(0).toUpperCase() + team.slice(1)}</Badge>;
}
