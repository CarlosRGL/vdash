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
        return 'bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Drupal':
        return 'bg-teal-50 border border-teal-200 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'SPIP':
        return 'bg-orange-50 border border-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Typo3':
        return 'bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'laravel':
        return 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'symfony':
        return 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'other':
        return 'bg-purple-50 border border-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-50 border border-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  return <Badge className={getTypeBadgeColor(type)}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
}

export function SiteTeamBadge({ team }: SiteTeamBadgeProps) {
  const getTeamBadgeColor = (team: string) => {
    switch (team) {
      case 'Q13':
        return 'bg-[#FE6213]/10 text-xs px-2  text-[#FE6213] border border-[#FE6213]/30 dark:bg-[#FE6213]/20 dark:text-[#FE6213] dark:border-[#FE6213]/50';
      case 'V':
        return 'bg-[#01BB9D]/10 text-xs px-2  text-[#01BB9D] border border-[#01BB9D]/30 dark:bg-[#01BB9D]/20 dark:text-[#01BB9D] dark:border-[#01BB9D]/50';
      default:
        return ' text-xs px-2 bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  return <Badge className={getTeamBadgeColor(team)}>{team.charAt(0).toUpperCase() + team.slice(1)}</Badge>;
}
