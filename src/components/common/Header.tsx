
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePlan } from '@/hooks/use-plan';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { hasPlan, clearPlan } = usePlan();

  const showNewPlanButton = pathname === '/' && hasPlan;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasPlan) {
      e.preventDefault();
      clearPlan();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="mr-6 flex items-center space-x-2 cursor-pointer"
        >
          <Logo />
          <span className="hidden font-bold sm:inline-block text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            GymGenius
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {showNewPlanButton && (
             <Button variant="ghost" size="sm" onClick={clearPlan}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Plan
             </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
