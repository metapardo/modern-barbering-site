import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import heroImage from '@assets/np_New_York_city_skyline_at_sunset_0PJag4_large_1787701674333.jpg';
import salonImage from '@assets/generated_images/salon.jpg';
import mobileImage from '@assets/generated_images/mobile.jpg';
import { cn } from '@/lib/utils';

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-1000 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
        className
      )}
    >
      {children}
    </div>
  );
}

function Header({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700 border-b',
        scrolled 
          ? 'bg-[#0B0B0C] border-[#F4F1EA]/10 py-4' 
          : 'bg-transparent border-transparent py-6'
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-serif text-xl tracking-wide text-[#F4F1EA] hover:opacity-70 transition-opacity"
        >
          MODERN BARBERING
        </button>
        
        <nav className="hidden md:flex items-center gap-8">
          {['protocol', 'moments', 'locations', 'philosophy'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-[#F4F1EA] text-xs tracking-widest uppercase hover:text-primary transition-colors"
            >
              {item}
            </button>
          ))}
          <Button 
            variant="default" 
            size="sm" 
            onClick={onBook}
          >
            Book Now
          </Button>
        </nav>

        {/* Mobile booking button always visible */}
        <div className="md:hidden">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onBook}
          >
            Book
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative w-full h-[100dvh] flex items-center pt-24 overflow-hidden section-dark">
      {/* Background with parallax effect */}
      <div 
        className="hero-background absolute inset-0 z-0 bg-center bg-no-repeat transition-transform duration-[10000ms] ease-out hover:scale-105 scale-100"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundColor: '#0B0B0C',
        }}
      />
      {/* Heavy black scrim */}
      <div className="absolute inset-0 z-10 bg-[#0B0B0C]/80" />
      
      <div className="container relative z-20 mx-auto px-6 md:px-12 h-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <span className="eyebrow text-[#F4F1EA]/70 font-semibold">Modern Barbering</span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 select-none text-[clamp(4rem,9vw,9rem)] font-sans font-bold uppercase leading-[0.8] tracking-[-0.08em] text-[#F4F1EA]/10 [writing-mode:vertical-rl] rotate-180 lg:block"
        >
          Modern Barbering
        </div>
        
        <h1 className="headline-huge text-[#F4F1EA] mb-12 max-w-4xl">
          One chair.<br />
          Or none at all.
        </h1>
        
        <div className="max-w-md ml-0 lg:ml-24">
          <p className="text-lg md:text-xl text-[#F4F1EA]/80 mb-10 leading-relaxed font-light">
            Get ready — on the move, or in the salon. Modern Barbering prepares you for the future ahead.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Button size="lg" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
              Book Your Moment
            </Button>
            <button 
              onClick={() => document.getElementById('protocol')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs tracking-widest uppercase text-[#F4F1EA]/70 hover:text-[#F4F1EA] transition-colors border-b border-transparent hover:border-[#F4F1EA] pb-1"
            >
              The Protocol
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 md:left-12 z-20 flex flex-col items-center gap-4">
        <div className="w-[1px] h-12 bg-[#F4F1EA]/30" />
      </div>
    </section>
  );
}

function WhyItMatters() {
  return (
    <section className="py-[140px] lg:py-[200px] section-light">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal>
          <span className="eyebrow text-[#0B0B0C]/50">Why It Matters</span>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-8">
              <h2 className="headline-large text-[#0B0B0C]">
                Not a haircut in the abstract.<br />
                One chair. One version of you.
              </h2>
            </div>
            
            <div className="lg:col-span-4 flex flex-col justify-end pt-8 lg:pt-0">
              <p className="text-lg text-[#0B0B0C]/70 leading-relaxed font-light">
                The interview, the flight out, the stage, the first date, the day you needed to look like you meant it. We prepare you for the moments that require your absolute best.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowYouArrive() {
  return (
    <section className="w-full section-dark" id="locations">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Panel I: The Salon */}
        <div className="relative h-[80vh] lg:h-[120vh] group overflow-hidden border-b lg:border-b-0 lg:border-r border-[#F4F1EA]/20">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${salonImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/40 to-transparent" />
          
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between">
            <span className="font-serif text-6xl text-[#F4F1EA]/30">I</span>
            
            <div>
              <span className="eyebrow text-[#F4F1EA]/70 mb-4">The Salon</span>
              <p className="text-2xl md:text-3xl text-[#F4F1EA] max-w-sm leading-snug">
                In the heart of Manhattan. A room built for the work.
              </p>
            </div>
          </div>
        </div>

        {/* Panel II: The Mobile Chair */}
        <div className="relative h-[80vh] lg:h-[120vh] group overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${mobileImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/40 to-transparent" />
          
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between">
            <span className="font-serif text-6xl text-[#F4F1EA]/30">II</span>
            
            <div>
              <span className="eyebrow text-[#F4F1EA]/70 mb-4">The Mobile Chair</span>
              <p className="text-2xl md:text-3xl text-[#F4F1EA] max-w-sm leading-snug">
                We drive to you. The chair finds the moment, wherever it's happening.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Protocol() {
  const steps = [
    {
      num: "01",
      title: "Consultation",
      desc: "Your face, your week, your reason for being in the chair."
    },
    {
      num: "02",
      title: "The Cut",
      desc: "Precision first. Craft second. Neither rushed."
    },
    {
      num: "03",
      title: "The Finish",
      desc: "You leave ready — not just groomed."
    }
  ];

  return (
    <section className="py-[140px] lg:py-[200px] section-dark" id="protocol">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal>
          <span className="eyebrow text-[#F4F1EA]/50">The Process</span>
          <h2 className="headline-large text-[#F4F1EA] mb-24">
            The Modern Barbering Protocol.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, idx) => (
            <Reveal 
              key={step.num}
              className={cn(
                "p-8 lg:p-16 border-t md:border-t-0 border-[#F4F1EA]/20 h-full",
                idx !== 0 && "md:border-l"
              )}
            >
              <div className="font-serif text-6xl md:text-8xl text-primary mb-12">
                {step.num}
              </div>
              <h3 className="text-xl tracking-widest uppercase mb-4 text-[#F4F1EA]">
                {step.title}
              </h3>
              <p className="text-[#F4F1EA]/60 font-light leading-relaxed">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MomentsSupported() {
  const moments = [
    "The Interview",
    "The Flight Out",
    "The Big Presentation",
    "The First Date",
    "The Wedding",
    "The Return"
  ];

  return (
    <section className="py-[140px] lg:py-[200px] section-light" id="moments">
      <div className="container mx-auto px-6 md:px-12 mb-24">
        <span className="eyebrow text-[#0B0B0C]/50">Moments Supported</span>
        <h2 className="headline-large text-[#0B0B0C] max-w-4xl">
          One date. One chair. A protocol built around it.
        </h2>
      </div>

      <div className="w-full flex flex-col border-t border-[#0B0B0C]/10">
        {moments.map((moment, idx) => (
          <div 
            key={idx}
            className="group w-full flex items-center justify-between px-6 md:px-12 py-8 md:py-12 border-b border-[#0B0B0C]/10 hover:bg-[#0B0B0C] hover:text-[#F4F1EA] transition-colors duration-500 cursor-default"
          >
            <span className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-tight transition-transform duration-500 group-hover:translate-x-4">
              {moment}
            </span>
            <span className="text-xs tracking-widest opacity-30 group-hover:opacity-100 transition-opacity duration-500 font-mono">
              0{idx + 1}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section id="philosophy" className="py-[200px] lg:py-[300px] section-dark flex items-center justify-center text-center px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <blockquote className="font-serif text-4xl md:text-6xl lg:text-7xl italic leading-tight text-[#F4F1EA] mb-12">
            "They don't see the cut. They see the person who was ready."
          </blockquote>
          <p className="text-sm md:text-base tracking-[0.2em] uppercase text-[#F4F1EA]/50 max-w-2xl mx-auto leading-relaxed">
            Confidence isn't styled on top of you. It's revealed underneath — that's the work.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee() {
  const words = [
    "Founders", "Executives", "Grooms", "Actors", "Athletes", 
    "Fathers", "Travelers", "Board Members", "Public Speakers"
  ];
  
  return (
    <section className="py-24 border-y border-[#0B0B0C]/10 section-light overflow-hidden flex flex-col items-center">
      <span className="eyebrow text-[#0B0B0C]/50 mb-12 text-center w-full">Who We've Prepared</span>
      
      <div className="relative w-full flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...words, ...words, ...words].map((word, idx) => (
            <div key={idx} className="flex items-center">
              <span className="text-4xl md:text-6xl font-serif text-[#0B0B0C] px-8">
                {word}
              </span>
              <span className="text-primary text-2xl mx-4">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhereWeWork() {
  return (
    <section className="py-[140px] lg:py-[200px] section-light">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="pb-16 md:pb-0 md:pr-16 lg:pr-24 border-b md:border-b-0 md:border-r border-[#0B0B0C]/10 flex flex-col justify-between">
            <Reveal>
              <span className="eyebrow text-[#0B0B0C]/50">The Flagship</span>
              <h3 className="headline-medium text-[#0B0B0C] mb-8">
                Manhattan
              </h3>
              <p className="text-lg text-[#0B0B0C]/70 font-light mb-4">
                120 West 24th Street<br />
                New York, NY 10011
              </p>
              <p className="text-sm tracking-widest uppercase text-[#0B0B0C]/50 mb-12">
                By Appointment Only
              </p>
            </Reveal>
          </div>
          
          <div className="pt-16 md:pt-0 md:pl-16 lg:pl-24 flex flex-col justify-between">
            <Reveal>
              <span className="eyebrow text-[#0B0B0C]/50">The Mobile Service</span>
              <h3 className="headline-medium text-[#0B0B0C] mb-8">
                On Location
              </h3>
              <p className="text-lg text-[#0B0B0C]/70 font-light mb-4 max-w-sm">
                Manhattan, Brooklyn, and beyond. Tell us where you'll be.
              </p>
              <p className="text-sm tracking-widest uppercase text-[#0B0B0C]/50 mb-12">
                Home · Office · Hotel · Set
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing({ onBook }: { onBook: () => void }) {
  return (
    <section className="py-[140px] lg:py-[200px] section-dark" id="booking">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <Reveal className="flex flex-col items-center">
          <h2 className="headline-large text-[#F4F1EA] mb-8">
            You have a moment ahead.<br />
            We have the chair for it.
          </h2>
          <p className="text-xl text-[#F4F1EA]/70 font-light mb-16">
            Tell us where you'll be — the salon, or wherever you are.
          </p>
          <Button size="lg" className="w-full sm:w-auto" onClick={onBook}>
            Book Now
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 section-dark border-t border-[#F4F1EA]/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="font-serif text-2xl tracking-widest text-[#F4F1EA]">
            MODERN BARBERING
          </div>
          <div className="flex items-center gap-8 text-xs tracking-widest uppercase text-[#F4F1EA]/50">
            <a href="#protocol" className="hover:text-[#F4F1EA] transition-colors">Protocol</a>
            <a href="#moments" className="hover:text-[#F4F1EA] transition-colors">Moments</a>
            <a href="#locations" className="hover:text-[#F4F1EA] transition-colors">Locations</a>
            <a href="#booking" className="hover:text-[#F4F1EA] transition-colors">Contact</a>
          </div>
        </div>
        <div className="h-px w-full bg-[#F4F1EA]/10 mb-8" />
        <div className="text-xs tracking-widest text-[#F4F1EA]/30 text-center md:text-left">
          © {new Date().getFullYear()} MODERN BARBERING
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);

  const openBooking = () => {
    setBookingSent(false);
    setBookingOpen(true);
  };

  const closeBooking = () => setBookingOpen(false);

  const handleBookingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingSent(true);
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0C] text-[#F4F1EA] selection:bg-primary selection:text-[#F4F1EA]">
      <Header onBook={openBooking} />
      <main>
        <Hero />
        <WhyItMatters />
        <HowYouArrive />
        <Protocol />
        <MomentsSupported />
        <Philosophy />
        <Marquee />
        <WhereWeWork />
        <Closing onBook={openBooking} />
      </main>
      <Footer />
      {bookingOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0B0B0C]/80 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeBooking();
          }}
        >
          <div className="relative w-full max-w-xl border border-[#F4F1EA]/15 bg-[#F4F1EA] p-7 text-[#0B0B0C] shadow-2xl sm:p-12">
            <button
              type="button"
              aria-label="Close booking form"
              onClick={closeBooking}
              className="absolute right-5 top-5 text-2xl font-light leading-none text-[#0B0B0C]/50 transition-colors hover:text-[#0B0B0C]"
            >
              ×
            </button>
            {bookingSent ? (
              <div className="py-8 sm:py-12">
                <span className="eyebrow text-[#0B0B0C]/50">Request received</span>
                <h2 id="booking-title" className="mt-5 font-serif text-5xl leading-none sm:text-6xl">
                  We’ll find the chair.
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-[#0B0B0C]/65">
                  Thank you. Our team will be in touch shortly to find the right moment and setting for your visit.
                </p>
                <Button type="button" size="lg" className="mt-10" onClick={closeBooking}>
                  Done
                </Button>
              </div>
            ) : (
              <>
                <span className="eyebrow text-[#0B0B0C]/50">Book your moment</span>
                <h2 id="booking-title" className="mt-5 max-w-md font-serif text-5xl leading-none sm:text-6xl">
                  Tell us where you’ll be.
                </h2>
                <form onSubmit={handleBookingSubmit} className="mt-10 space-y-5">
                  <label className="block">
                    <span className="sr-only">Your name</span>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full border-0 border-b border-[#0B0B0C]/20 bg-transparent px-0 py-3 text-base outline-none placeholder:text-[#0B0B0C]/40 focus:border-[#5D1612]"
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Email address</span>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="Email address"
                      className="w-full border-0 border-b border-[#0B0B0C]/20 bg-transparent px-0 py-3 text-base outline-none placeholder:text-[#0B0B0C]/40 focus:border-[#5D1612]"
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Where will you be?</span>
                    <select
                      required
                      name="location"
                      defaultValue=""
                      className="w-full border-0 border-b border-[#0B0B0C]/20 bg-transparent px-0 py-3 text-base text-[#0B0B0C]/60 outline-none focus:border-[#5D1612]"
                    >
                      <option value="" disabled>Choose a setting</option>
                      <option value="salon">The Manhattan salon</option>
                      <option value="mobile">The mobile chair</option>
                    </select>
                  </label>
                  <Button type="submit" size="lg" className="mt-4 w-full sm:w-auto">
                    Request an appointment
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
