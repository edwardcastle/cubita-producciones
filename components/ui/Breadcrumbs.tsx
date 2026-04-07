import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark';
}

export default function Breadcrumbs({ items, variant = 'light' }: BreadcrumbsProps) {
  const textColor = variant === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const activeColor = variant === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const hoverColor = variant === 'dark' ? 'hover:text-white' : 'hover:text-amber-600';
  const chevronColor = variant === 'dark' ? 'text-gray-600' : 'text-gray-400';

  return (
    <nav aria-label="Breadcrumb" className="text-xs md:text-sm">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className={`w-3 h-3 md:w-4 md:h-4 ${chevronColor}`} />}
              {isLast || !item.href ? (
                <span className={isLast ? activeColor : textColor}>{item.label}</span>
              ) : (
                <Link href={item.href} className={`${textColor} ${hoverColor} transition-colors`}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
