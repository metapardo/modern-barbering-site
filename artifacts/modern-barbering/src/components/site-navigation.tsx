import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type HeaderProps = {
  onBook: () => void;
  activeAbout?: boolean;
};

export function Header({ onBook, activeAbout = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: '/#choices', label: 'How it works' },
    { href: '/#locations', label: 'Locations' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-500',
        scrolled || menuOpen
          ? 'bg-[#0B0B0C]/95 backdrop-blur-md border-[#F4F1EA]/15'
          : 'bg-[#0B0B0C]/20 border-[#F4F1EA]/10',
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-5 md:px-12">
        <Link
          href="/"
          onClick={() => {
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          data-testid="link-home-logo"
          className="shrink-0 text-left font-serif text-lg leading-none tracking-wide text-[#F4F1EA] transition-opacity hover:opacity-70 sm:text-xl"
        >
          Modern Barbering NYC
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {links.map((item) => (
            <a
              key={item.href}
              href={`${import.meta.env.BASE_URL}${item.href.slice(1)}`}
              data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              className="flex min-h-11 items-center whitespace-nowrap border-b border-transparent text-xs uppercase tracking-widest text-[#F4F1EA]/80 transition-colors hover:border-[#F4F1EA]/60 hover:text-[#F4F1EA]"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/about"
            aria-current={activeAbout ? 'page' : undefined}
            data-testid="link-nav-about"
            className={cn(
              'flex min-h-11 items-center whitespace-nowrap border-b text-xs uppercase tracking-widest transition-colors hover:border-[#F4F1EA]/60 hover:text-[#F4F1EA]',
              activeAbout
                ? 'border-[#F4F1EA] text-[#F4F1EA]'
                : 'border-transparent text-[#F4F1EA]/80',
            )}
          >
            About
          </Link>
          <Button variant="default" size="sm" onClick={onBook} data-testid="button-book-now">
            Book Now
          </Button>
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setMenuOpen(false);
              onBook();
            }}
            data-testid="button-book-mobile"
          >
            Book
          </Button>
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-toggle-navigation"
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 text-[#F4F1EA]"
          >
            <span className={cn('h-px w-5 bg-current transition-transform', menuOpen && 'translate-y-1 rotate-45')} />
            <span className={cn('h-px w-5 bg-current transition-transform', menuOpen && '-translate-y-1 -rotate-45')} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[#F4F1EA]/15 px-6 pb-6 pt-3 lg:hidden">
          {links.map((item) => (
            <a
              key={item.href}
              href={`${import.meta.env.BASE_URL}${item.href.slice(1)}`}
              onClick={() => setMenuOpen(false)}
              data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              className="block border-b border-[#F4F1EA]/10 py-5 text-sm uppercase tracking-[0.16em] text-[#F4F1EA] hover:text-[#F4F1EA]/70"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/about"
            aria-current={activeAbout ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
            data-testid="link-mobile-about"
            className={cn(
              'block border-b border-[#F4F1EA]/10 py-5 text-sm uppercase tracking-[0.16em] hover:text-[#F4F1EA]/70',
              activeAbout ? 'text-[#F4F1EA]' : 'text-[#F4F1EA]/75',
            )}
          >
            About
          </Link>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const links = [
    { href: '/#choices', label: 'How it works' },
    { href: '/#locations', label: 'Locations' },
    { href: '/#philosophy', label: 'Philosophy' },
    { href: '/about', label: 'About' },
    { href: '/#booking', label: 'Contact' },
  ];

  return (
    <footer className="border-t border-[#F4F1EA]/10 py-12 section-dark">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
          <Link
            href="/"
            data-testid="link-footer-logo"
            className="font-serif text-2xl tracking-widest text-[#F4F1EA] transition-opacity hover:opacity-70"
          >
            Modern Barbering NYC
          </Link>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs uppercase tracking-widest text-[#F4F1EA]/50">
            {links.map((item) => (
              <a
                key={item.href}
                href={`${import.meta.env.BASE_URL}${item.href.slice(1)}`}
                data-testid={`link-footer-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                className="transition-colors hover:text-[#F4F1EA]"
              >
                {item.label}
              </a>
            ))}
        </nav>
        </div>
        <div className="mb-8 h-px w-full bg-[#F4F1EA]/10" />
        <div className="text-center text-xs tracking-widest text-[#F4F1EA]/30 md:text-left">
          © {new Date().getFullYear()} Modern Barbering NYC
        </div>
      </div>
    </footer>
  );
}
