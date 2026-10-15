import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Footer, Header } from '@/components/site-navigation';
import heroImage from '@assets/np_New_York_city_skyline_at_sunset_0PJag4_large_1787701674333.jpg';
import salonImage from '@assets/Agent_Image_-_Convert_this_photograph_to_black_and_white_clean_1791911057096.png';
import mobileImage from '@assets/Agent_Image_-_Convert_this_photograph_to_black_and_white_with__1791909001531.png';
import { cn } from '@/lib/utils';
import { useCreateEventRequest } from '@workspace/api-client-react';
import type { EventRequestInput } from '@workspace/api-client-react';

type VisitMode = 'salon' | 'mobile';

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

function Hero({ onChoose }: { onChoose: (mode: VisitMode) => void }) {
  return (
    <section className="relative w-full min-h-[100dvh] h-auto flex items-center pt-32 pb-24 md:pt-36 overflow-hidden section-dark">
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
      <div className="container relative z-20 mx-auto px-6 md:px-12 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 select-none text-[clamp(4rem,9vw,9rem)] font-sans font-bold uppercase leading-[0.8] tracking-[-0.08em] text-[#F4F1EA]/10 [writing-mode:vertical-rl] rotate-180 lg:block"
        >
          Modern Barbering NYC
        </div>
        
        <h1 className="headline-huge text-[#F4F1EA] mb-8 max-w-5xl">
          One chair<br />
          for all your moments.
        </h1>
        
          <div className="max-w-2xl ml-0 lg:ml-24">
          <p className="text-[1.0125rem] md:text-[1.125rem] text-[#F4F1EA]/80 mb-10 leading-relaxed font-light">
            Get ready — on the move, or in the salon. Modern Barbering NYC prepares you for the future ahead.
          </p>
          
          <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => onChoose('salon')}
              className="group min-h-[132px] border border-[#F4F1EA]/35 bg-[#F4F1EA]/5 p-4 text-left transition-colors hover:border-[#F4F1EA] hover:bg-[#F4F1EA] hover:text-[#0B0B0C] sm:p-5"
            >
              <span className="block text-xs font-medium uppercase tracking-[0.18em]">The salon</span>
              <span className="mt-2 block font-serif text-2xl leading-none">50 West 17th</span>
              <span className="mt-3 block text-xs uppercase tracking-[0.14em] opacity-60 group-hover:opacity-70">Choose this chair</span>
            </button>
            <button
              type="button"
              onClick={() => onChoose('mobile')}
              className="group min-h-[132px] border border-[#F4F1EA]/35 bg-[#F4F1EA]/5 p-4 text-left transition-colors hover:border-[#F4F1EA] hover:bg-[#F4F1EA] hover:text-[#0B0B0C] sm:p-5"
            >
              <span className="block text-xs font-medium uppercase tracking-[0.18em]">On the go</span>
              <span className="mt-2 block font-serif text-2xl leading-none">We come to you</span>
              <span className="mt-3 block text-xs uppercase tracking-[0.14em] opacity-60 group-hover:opacity-70">Choose your location</span>
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('event-request')?.scrollIntoView({ behavior: 'smooth' })}
              className="group min-h-[132px] border border-[#F4F1EA]/35 bg-[#F4F1EA]/5 p-4 text-left transition-colors hover:border-[#F4F1EA] hover:bg-[#F4F1EA] hover:text-[#0B0B0C] sm:p-5"
              data-testid="button-hero-events"
            >
              <span className="block text-xs font-medium uppercase tracking-[0.18em]">Events</span>
              <span className="mt-2 block font-serif text-2xl leading-none">Wedding &amp; group</span>
              <span className="mt-3 block text-xs uppercase tracking-[0.14em] opacity-60 group-hover:opacity-70">Request an event</span>
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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <h2 className="headline-large text-[#0B0B0C]">
                Not a haircut in the abstract.<br />
                One chair. One version of you.
              </h2>
            </div>
            
            <div className="lg:col-span-4 lg:pt-4">
              <p className="max-w-md text-[1.35rem] text-[#0B0B0C]/70 leading-relaxed font-light">
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
                50 West 17th Street. A room built for the work.
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

function ChooseYourChair({ onChoose }: { onChoose: (mode: VisitMode) => void }) {
  const actionClass = 'inline-flex min-h-12 w-full items-center justify-center border border-[#0B0B0C]/25 px-4 py-4 text-xs font-medium uppercase tracking-[0.12em] text-[#0B0B0C] transition-colors hover:border-primary hover:bg-primary hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4';
  const steps = [
    ['01', 'Choose your chair', 'Head to 50 West 17th, or have the chair arrive at your door.'],
    ['02', 'Tell us the moment', 'Share the date and your location.'],
    ['03', 'Events', 'Wedding mornings, celebrations, and group appointments arranged around your day.'],
  ];

  return (
    <section id="choices" className="section-light py-[120px] lg:py-[170px]">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal>
          <span className="eyebrow text-[#0B0B0C]/50">A simple choice</span>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            <h2 className="headline-large lg:col-span-8 text-[#0B0B0C]">
              Decide where the chair meets you.
            </h2>
            <p className="max-w-sm self-end text-lg leading-relaxed text-[#0B0B0C]/70 font-light lg:col-span-4">
              Start with the setting that makes the most sense for your day. We’ll take it from there.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 border-y border-[#0B0B0C]/15 md:grid-cols-3">
          {steps.map(([number, title, copy], index) => (
            <Reveal key={number} className={cn('flex h-full flex-col p-8 md:p-6 lg:p-12', index > 0 && 'border-t border-[#0B0B0C]/15 md:border-l md:border-t-0')}>
              <span className="font-serif text-5xl text-primary">{number}</span>
              <h3 className="mt-10 text-sm font-medium uppercase tracking-[0.16em] text-[#0B0B0C]">{title}</h3>
              <p className="mt-4 max-w-xs leading-relaxed text-[#0B0B0C]/65">{copy}</p>
              <div className="mt-auto pt-8">
                {index === 2 ? (
                  <a href="#event-request" className={actionClass} data-testid="link-request-event">
                    Request Event
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onChoose(index === 0 ? 'salon' : 'mobile')}
                    className={actionClass}
                    data-testid={index === 0 ? 'button-choices-salon' : 'button-choices-mobile'}
                  >
                    {index === 0 ? 'Book Salon' : 'Book Mobile'}
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>

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
                50 West 17th Street<br />
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
                The mobile chair serves Manhattan. Outside-area events are available by inquiry.
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

function eventRequestError(error: unknown): string {
  if (error && typeof error === 'object') {
    const value = error as { message?: unknown; data?: unknown; body?: unknown };
    for (const source of [value.data, value.body]) {
      if (source && typeof source === 'object') {
        const details = source as { message?: unknown; error?: unknown };
        if (typeof details.message === 'string') return details.message;
        if (typeof details.error === 'string') return details.error;
      }
    }
    if (typeof value.message === 'string' && value.message.trim()) return value.message;
  }
  return 'We couldn’t send your inquiry just now. Your details are still here—please try again.';
}

function EventRequest() {
  const createRequest = useCreateEventRequest();
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const [receipt, setReceipt] = useState<{ reference: string; status: 'received' } | null>(null);
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());

  const submitEventRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const payload: EventRequestInput = {
      contactName: String(fields.get('contactName') ?? '').trim(),
      contactEmail: String(fields.get('contactEmail') ?? '').trim(),
      eventType: String(fields.get('eventType') ?? '').trim(),
      date: String(fields.get('date') ?? ''),
      readyByTime: String(fields.get('readyByTime') ?? ''),
      numberOfGuests: Number(fields.get('numberOfGuests')),
      location: String(fields.get('location') ?? '').trim(),
      servicesNeeded: String(fields.get('servicesNeeded') ?? '').trim(),
      notes: String(fields.get('notes') ?? '').trim() || undefined,
    };
    submittingRef.current = true;
    createRequest.mutate(
      { data: payload },
      {
        onSuccess: (response) => {
          submittingRef.current = false;
          setReceipt(response);
          formRef.current?.reset();
        },
        onError: () => {
          submittingRef.current = false;
        },
      },
    );
  };

  const fieldClass =
    'mt-2 w-full border border-[#0B0B0C]/20 bg-transparent px-4 py-3 text-base text-[#0B0B0C] outline-none transition-colors placeholder:text-[#0B0B0C]/35 focus:border-[#5D1612]';
  const labelClass = 'block text-xs font-medium uppercase tracking-[0.13em] text-[#0B0B0C]/65';

  return (
    <section id="event-request" className="section-light scroll-mt-24 border-t border-[#0B0B0C]/10 py-24 sm:py-32">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-12">
        <div className="md:col-span-5">
          <Reveal>
            <span className="eyebrow text-[#0B0B0C]/50">Events · By inquiry</span>
            <h2 className="headline-large text-[#0B0B0C]">A good day starts before the first guest arrives.</h2>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-[#0B0B0C]/65">
              Tell us what you’re planning. Ryon will follow up to discuss the timing, location, and services. This is an inquiry, not a confirmed booking.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[#0B0B0C]/45">New York time · Event locations outside Manhattan by inquiry</p>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          {receipt ? (
            <div className="border-y border-[#0B0B0C]/20 py-8" role="status" data-testid="status-event-request-received">
              <span className="eyebrow mb-5 text-[#0B0B0C]/50">Inquiry received</span>
              <h3 className="font-serif text-4xl leading-none text-[#0B0B0C] sm:text-5xl">Thank you. We’ll be in touch.</h3>
              <p className="mt-5 leading-relaxed text-[#0B0B0C]/65">
                Status: <strong className="font-medium text-[#0B0B0C]">{receipt.status}</strong>. Reference:{' '}
                <strong className="font-medium text-[#0B0B0C]">{receipt.reference}</strong>. This is not a booking confirmation; your date is not reserved until details are discussed and confirmed.
              </p>
              <button
                type="button"
                className="mt-7 border border-[#0B0B0C]/25 px-6 py-3 text-xs uppercase tracking-[0.16em] transition-colors hover:bg-[#0B0B0C] hover:text-[#F4F1EA]"
                onClick={() => setReceipt(null)}
                data-testid="button-another-event-inquiry"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={submitEventRequest} className="space-y-7" data-testid="form-event-request">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className={labelClass}>
                  Contact name
                  <input required maxLength={120} name="contactName" autoComplete="name" className={fieldClass} data-testid="input-event-contact-name" />
                </label>
                <label className={labelClass}>
                  Email
                  <input required type="email" maxLength={254} name="contactEmail" autoComplete="email" className={fieldClass} data-testid="input-event-contact-email" />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className={labelClass}>
                  Event type
                  <input required maxLength={120} name="eventType" placeholder="Wedding, celebration, group…" className={fieldClass} data-testid="input-event-type" />
                </label>
                <label className={labelClass}>
                  Number of guests
                  <input required type="number" min={1} max={1000} step={1} name="numberOfGuests" className={fieldClass} data-testid="input-event-guests" />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className={labelClass}>
                  Date
                  <input required type="date" min={today} name="date" className={fieldClass} data-testid="input-event-date" />
                </label>
                <label className={labelClass}>
                  Ready-by time <span className="normal-case tracking-normal">(New York time)</span>
                  <input required type="time" name="readyByTime" className={fieldClass} data-testid="input-event-ready-by-time" />
                </label>
              </div>
              <label className={labelClass}>
                Location <span className="normal-case tracking-normal">(address or venue)</span>
                <input required maxLength={500} name="location" placeholder="Street address or venue name" className={fieldClass} data-testid="input-event-location" />
              </label>
              <label className={labelClass}>
                Services needed
                <textarea required maxLength={2000} name="servicesNeeded" rows={3} placeholder="Tell us what services you have in mind." className={cn(fieldClass, 'resize-y')} data-testid="input-event-services" />
              </label>
              <label className={labelClass}>
                Anything we should know? <span className="normal-case tracking-normal">(optional)</span>
                <textarea maxLength={4000} name="notes" rows={3} placeholder="Schedule, access, or other details." className={cn(fieldClass, 'resize-y')} data-testid="input-event-notes" />
              </label>
              {createRequest.isError && (
                <p role="alert" className="border-l-2 border-[#5D1612] pl-4 text-sm leading-relaxed text-[#5D1612]" data-testid="error-event-request">
                  {eventRequestError(createRequest.error)}
                </p>
              )}
              <div className="flex flex-col items-start gap-3 pt-2">
                <Button type="submit" size="lg" disabled={createRequest.isPending} data-testid="button-submit-event-request">
                  {createRequest.isPending ? 'Sending inquiry…' : 'Send event inquiry'}
                </Button>
                <p className="text-xs leading-relaxed text-[#0B0B0C]/50">Submitting this form does not reserve a date or confirm an event booking.</p>
              </div>
            </form>
          )}
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

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingMode, setBookingMode] = useState<VisitMode | null>(null);

  const openBooking = (mode?: VisitMode) => {
    setBookingSent(false);
    setBookingMode(mode ?? null);
    setBookingOpen(true);
  };

  const closeBooking = () => setBookingOpen(false);

  const handleBookingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bookingMode) return;
    setBookingSent(true);
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0C] text-[#F4F1EA] selection:bg-primary selection:text-[#F4F1EA]">
      <Header onBook={openBooking} />
      <main>
        <Hero onChoose={openBooking} />
        <WhyItMatters />
        <HowYouArrive />
        <ChooseYourChair onChoose={openBooking} />
        <Philosophy />
        <WhereWeWork />
        <Closing onBook={openBooking} />
        <EventRequest />
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
                  Choose where the chair meets you.
                </h2>
                <form onSubmit={handleBookingSubmit} className="mt-10 space-y-5">
                  <fieldset>
                    <legend className="text-xs font-medium uppercase tracking-[0.16em] text-[#0B0B0C]/55">
                      Start with a setting
                    </legend>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        aria-pressed={bookingMode === 'salon'}
                        onClick={() => setBookingMode('salon')}
                        className={cn(
                          'border p-5 text-left transition-colors',
                          bookingMode === 'salon'
                            ? 'border-[#5D1612] bg-[#5D1612] text-[#F4F1EA]'
                            : 'border-[#0B0B0C]/20 hover:border-[#0B0B0C]',
                        )}
                      >
                        <span className="block text-xs font-medium uppercase tracking-[0.16em]">The salon</span>
                        <span className="mt-2 block font-serif text-2xl leading-none">50 West 17th</span>
                      </button>
                      <button
                        type="button"
                        aria-pressed={bookingMode === 'mobile'}
                        onClick={() => setBookingMode('mobile')}
                        className={cn(
                          'border p-5 text-left transition-colors',
                          bookingMode === 'mobile'
                            ? 'border-[#5D1612] bg-[#5D1612] text-[#F4F1EA]'
                            : 'border-[#0B0B0C]/20 hover:border-[#0B0B0C]',
                        )}
                      >
                        <span className="block text-xs font-medium uppercase tracking-[0.16em]">On the go</span>
                        <span className="mt-2 block font-serif text-2xl leading-none">We come to you</span>
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#0B0B0C]/60">
                      {bookingMode === 'salon'
                        ? 'Your appointment will be at our Manhattan salon on West 17th Street.'
                        : bookingMode === 'mobile'
                          ? 'We’ll confirm the address and timing for your mobile visit.'
                          : 'Choose your setting to continue.'}
                    </p>
                    <input type="hidden" name="location" value={bookingMode ?? ''} />
                  </fieldset>
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
                  <Button type="submit" size="lg" disabled={!bookingMode} className="mt-4 w-full sm:w-auto">
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
