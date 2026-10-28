import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Footer, Header } from '@/components/site-navigation';
import heroImage from '@assets/nyc-skyline-hero.jpg';
import salonImage from '@assets/salon-chair.jpg';
import mobileImage from '@assets/mobile-chair.jpg';
import { cn } from '@/lib/utils';
import { useCreateEventRequest } from '@workspace/api-client-react';
import { SQUARE_BOOKING_URLS } from '@/lib/booking';
import type { EventRequestInput } from '@workspace/api-client-react';


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

function Hero() {
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
            Get ready on the move or in the salon. Modern Barbering NYC is a Manhattan barber with a private salon suite on West 17th Street and a mobile barber service that comes to your home, office, or event.
          </p>
          
          <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={SQUARE_BOOKING_URLS.salon}
              target="_blank"
              rel="noopener"
              className="group min-h-[132px] border border-[#F4F1EA]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0C] bg-[#F4F1EA]/5 p-4 text-left transition-colors hover:border-[#F4F1EA] hover:bg-[#F4F1EA] hover:text-[#0B0B0C] sm:p-5"
            >
              <span className="block text-xs font-medium uppercase tracking-[0.18em]">The salon</span>
              <span className="mt-2 block font-serif text-2xl leading-none">50 West 17th</span>
              <span className="mt-3 block text-xs uppercase tracking-[0.14em] opacity-60 group-hover:opacity-70">Book the salon</span>
              <span className="sr-only"> (opens Square booking in a new tab)</span>
            </a>
            <a
              href={SQUARE_BOOKING_URLS.mobile}
              target="_blank"
              rel="noopener"
              className="group min-h-[132px] border border-[#F4F1EA]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0C] bg-[#F4F1EA]/5 p-4 text-left transition-colors hover:border-[#F4F1EA] hover:bg-[#F4F1EA] hover:text-[#0B0B0C] sm:p-5"
            >
              <span className="block text-xs font-medium uppercase tracking-[0.18em]">On the go</span>
              <span className="mt-2 block font-serif text-2xl leading-none">We come to you</span>
              <span className="mt-3 block text-xs uppercase tracking-[0.14em] opacity-60 group-hover:opacity-70">Book a mobile visit</span>
              <span className="sr-only"> (opens Square booking in a new tab)</span>
            </a>
            <button
              type="button"
              onClick={() => document.getElementById('event-request')?.scrollIntoView({ behavior: 'smooth' })}
              className="group min-h-[132px] border border-[#F4F1EA]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0C] bg-[#F4F1EA]/5 p-4 text-left transition-colors hover:border-[#F4F1EA] hover:bg-[#F4F1EA] hover:text-[#0B0B0C] sm:p-5"
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
                The interview, the flight out, the stage, the first date, the day you needed to look like you meant it. We prepare you for the moments that require your absolute best. Precision haircuts, fades, and beard work, done with the time and attention of a private appointment.
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
                50 West 17th Street, between Fifth and Sixth. A private barber suite built for the work.
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
                We drive to you: home, office, or hotel, anywhere in Manhattan. The chair finds the moment, wherever it's happening.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChooseYourChair() {
  const actionClass = 'inline-flex min-h-12 w-full items-center justify-center border border-[#0B0B0C]/25 px-4 py-4 text-xs font-medium uppercase tracking-[0.12em] text-[#0B0B0C] transition-colors hover:border-primary hover:bg-primary hover:text-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4';
  const steps = [
    ['01', 'Choose your chair', 'Head to 50 West 17th, or have the chair arrive at your door.'],
    ['02', 'Tell us the moment', 'Share the date and your location.'],
    ['03', 'Events', 'Wedding barber for grooms and groomsmen, celebrations, photo shoots, and group appointments, arranged around your day.'],
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
                  <a
                    href={index === 0 ? SQUARE_BOOKING_URLS.salon : SQUARE_BOOKING_URLS.mobile}
                    target="_blank"
                    rel="noopener"
                    className={actionClass}
                    data-testid={index === 0 ? 'link-choices-salon' : 'link-choices-mobile'}
                  >
                    {index === 0 ? 'Book Salon' : 'Book Mobile'}
                    <span className="sr-only"> (opens Square booking in a new tab)</span>
                  </a>
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
            Confidence isn't styled on top of you. It's revealed underneath. That's the work.
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
              <p className="text-lg text-[#0B0B0C]/70 font-light mb-4 max-w-sm">
                A private salon suite in Flatiron, near Union Square. One client at a time.
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
                Mobile barber service across Manhattan: homes, offices, hotels, and sets. Events outside Manhattan by inquiry.
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

function eventRequestError(
  error: unknown,
  fallback = 'We couldn’t send your inquiry just now. Your details are still here, so please try again.',
): string {
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
  return fallback;
}

function eventRequestFieldErrors(error: unknown): Record<string, string> {
  if (error && typeof error === 'object') {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === 'object') {
      const fieldErrors = (data as { fieldErrors?: unknown }).fieldErrors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const result: Record<string, string> = {};
        for (const [key, value] of Object.entries(fieldErrors as Record<string, unknown>)) {
          if (typeof value === 'string') result[key] = value;
        }
        return result;
      }
    }
  }
  return {};
}

// Hidden spam trap. Real visitors never see or fill it; the server silently discards submissions that do.
function HoneypotField() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

function EventRequest() {
  const createRequest = useCreateEventRequest();
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);
  const [receipt, setReceipt] = useState<{ reference: string; status: 'received' } | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const fieldErrors = createRequest.isError ? eventRequestFieldErrors(createRequest.error) : {};
  const fieldError = (name: string) =>
    fieldErrors[name] ? (
      <span id={`event-error-${name}`} className="mt-2 block text-sm normal-case tracking-normal text-[#5D1612]">
        {fieldErrors[name]}
      </span>
    ) : null;
  const invalidProps = (name: string) =>
    fieldErrors[name] ? { 'aria-invalid': true as const, 'aria-describedby': `event-error-${name}` } : {};

  useEffect(() => {
    if (receipt) receiptRef.current?.focus();
  }, [receipt]);

  useEffect(() => {
    if (createRequest.isError) errorRef.current?.focus();
  }, [createRequest.isError, createRequest.error]);
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
      website: String(fields.get('website') ?? '') || undefined,
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
            <span className="eyebrow text-[#0B0B0C]/50">Weddings &amp; Events · By inquiry</span>
            <h2 className="headline-large text-[#0B0B0C]">A good day starts before the first guest arrives.</h2>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-[#0B0B0C]/65">
              On-location grooming for weddings, groomsmen, corporate events, and shoots in New York City. Tell us what you’re planning, and Ryon will follow up to discuss the timing, location, and services. This is an inquiry, not a confirmed booking.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[#0B0B0C]/45">New York time · Event locations outside Manhattan by inquiry</p>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          {receipt ? (
            <div ref={receiptRef} tabIndex={-1} className="border-y border-[#0B0B0C]/20 py-8 outline-none" role="status" data-testid="status-event-request-received">
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
            <form ref={formRef} onSubmit={submitEventRequest} className="relative space-y-7" data-testid="form-event-request">
              <HoneypotField />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className={labelClass}>
                  Contact name
                  <input required maxLength={120} name="contactName" autoComplete="name" className={fieldClass} data-testid="input-event-contact-name" {...invalidProps('contactName')} />
                  {fieldError('contactName')}
                </label>
                <label className={labelClass}>
                  Email
                  <input required type="email" maxLength={254} name="contactEmail" autoComplete="email" className={fieldClass} data-testid="input-event-contact-email" {...invalidProps('contactEmail')} />
                  {fieldError('contactEmail')}
                </label>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className={labelClass}>
                  Event type
                  <input required maxLength={120} name="eventType" placeholder="Wedding, celebration, group…" className={fieldClass} data-testid="input-event-type" {...invalidProps('eventType')} />
                  {fieldError('eventType')}
                </label>
                <label className={labelClass}>
                  Number of guests
                  <input required type="number" min={1} max={1000} step={1} name="numberOfGuests" className={fieldClass} data-testid="input-event-guests" {...invalidProps('numberOfGuests')} />
                  {fieldError('numberOfGuests')}
                </label>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className={labelClass}>
                  Date
                  <input required type="date" min={today} name="date" className={fieldClass} data-testid="input-event-date" {...invalidProps('date')} />
                  {fieldError('date')}
                </label>
                <label className={labelClass}>
                  Ready-by time <span className="normal-case tracking-normal">(New York time)</span>
                  <input required type="time" name="readyByTime" className={fieldClass} data-testid="input-event-ready-by-time" {...invalidProps('readyByTime')} />
                  {fieldError('readyByTime')}
                </label>
              </div>
              <label className={labelClass}>
                Location <span className="normal-case tracking-normal">(address or venue)</span>
                <input required maxLength={500} name="location" placeholder="Street address or venue name" className={fieldClass} data-testid="input-event-location" {...invalidProps('location')} />
                  {fieldError('location')}
              </label>
              <label className={labelClass}>
                Services needed
                <textarea required maxLength={2000} name="servicesNeeded" rows={3} placeholder="Tell us what services you have in mind." className={cn(fieldClass, 'resize-y')} data-testid="input-event-services" {...invalidProps('servicesNeeded')} />
                  {fieldError('servicesNeeded')}
              </label>
              <label className={labelClass}>
                Anything we should know? <span className="normal-case tracking-normal">(optional)</span>
                <textarea maxLength={4000} name="notes" rows={3} placeholder="Schedule, access, or other details." className={cn(fieldClass, 'resize-y')} data-testid="input-event-notes" {...invalidProps('notes')} />
                  {fieldError('notes')}
              </label>
              {createRequest.isError && (
                <p ref={errorRef} tabIndex={-1} role="alert" className="border-l-2 border-[#5D1612] pl-4 text-sm leading-relaxed text-[#5D1612] outline-none" data-testid="error-event-request">
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

const services = [
  ['Haircut', 'Precision cuts and fades, finished with a clean line-up.'],
  ['Beard trim & line-up', 'Shape, detail, and edge work for any beard length.'],
  ['Haircut + beard', 'The full appointment, in one sitting.'],
  ['Mobile visit', 'The chair comes to your home, office, or hotel anywhere in Manhattan.'],
  ['Groom & groomsmen', 'Wedding-morning grooming for the whole party, on location.'],
  ['Corporate in-office days', 'Book a day of cuts for your team at your office.'],
] as const;

const faqs = [
  ['Can a barber come to my home or hotel in NYC?', 'Yes. The mobile chair serves all of Manhattan, including homes, offices, hotels, and sets. Book “On the Go” and add your address in Square.'],
  ['How much does a mobile barber cost?', 'Prices for the salon and mobile visits are listed in Square when you book, before you pay anything.'],
  ['Do you do wedding and groomsmen haircuts?', 'Yes. Ryon grooms the groom and groomsmen on the wedding morning, at your hotel or venue. Send an event inquiry with your date and location.'],
  ['Can you come to our office?', 'Yes. In-office days work well for teams. Send an event inquiry with your group size and preferred date.'],
  ['Where is the salon?', 'Our private suite is at 50 West 17th Street, New York, NY 10011, in Flatiron near Union Square. Appointments only.'],
] as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

function ServicesAndFaq() {
  return (
    <section id="services" className="section-light scroll-mt-24 border-t border-[#0B0B0C]/10 py-24 sm:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container mx-auto grid grid-cols-1 gap-16 px-6 md:px-12 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <span className="eyebrow text-[#0B0B0C]/50">Services</span>
          <h2 className="headline-medium mt-4 text-[#0B0B0C]">In the salon, or on location.</h2>
          <ul className="mt-10 border-t border-[#0B0B0C]/15">
            {services.map(([name, copy]) => (
              <li key={name} className="border-b border-[#0B0B0C]/15 py-5">
                <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-[#0B0B0C]">{name}</h3>
                <p className="mt-2 leading-relaxed text-[#0B0B0C]/65">{copy}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[#0B0B0C]/45">Prices are shown in Square when you book</p>
        </Reveal>
        <Reveal>
          <span className="eyebrow text-[#0B0B0C]/50">Questions</span>
          <h2 className="headline-medium mt-4 text-[#0B0B0C]">Before you book.</h2>
          <div className="mt-10 border-t border-[#0B0B0C]/15">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group border-b border-[#0B0B0C]/15 py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-[#0B0B0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                  <span className="font-serif text-xl leading-snug">{question}</span>
                  <span aria-hidden="true" className="text-2xl font-light text-[#0B0B0C]/50 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-lg leading-relaxed text-[#0B0B0C]/65">{answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
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
            Tell us where you'll be: the salon, or wherever you are.
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
  const bookingDialogRef = useRef<HTMLDivElement>(null);

  const openBooking = () => setBookingOpen(true);

  const closeBooking = () => setBookingOpen(false);

  // Book Now on /about and /policies links here as /#booking; open the chooser straight away.
  useEffect(() => {
    if (window.location.hash === '#booking') setBookingOpen(true);
  }, []);

  // Keep keyboard focus inside the booking chooser while it's open, and return it afterwards.
  useEffect(() => {
    if (!bookingOpen) return;
    const dialog = bookingDialogRef.current;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusables().find((el) => el.tagName === 'A')?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setBookingOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [bookingOpen]);

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0C] text-[#F4F1EA] selection:bg-primary selection:text-[#F4F1EA]">
      <Header onBook={openBooking} />
      <main>
        <Hero />
        <WhyItMatters />
        <HowYouArrive />
        <ChooseYourChair />
        <Philosophy />
        <WhereWeWork />
        <ServicesAndFaq />
        <Closing onBook={openBooking} />
        <EventRequest />
      </main>
      <Footer onBook={openBooking} />
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
          <div ref={bookingDialogRef} className="relative w-full max-w-xl border border-[#F4F1EA]/15 bg-[#F4F1EA] p-7 text-[#0B0B0C] shadow-2xl sm:p-12">
            <button
              type="button"
              aria-label="Close booking options"
              onClick={closeBooking}
              className="absolute right-5 top-5 text-2xl font-light leading-none text-[#0B0B0C]/50 transition-colors hover:text-[#0B0B0C]"
            >
              ×
            </button>
            <span className="eyebrow text-[#0B0B0C]/50">Book your moment</span>
            <h2 id="booking-title" className="mt-5 max-w-md font-serif text-5xl leading-none sm:text-6xl">
              Choose where the chair meets you.
            </h2>
            <div className="mt-10">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#0B0B0C]/55">
                Start with a setting
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={SQUARE_BOOKING_URLS.salon}
                  target="_blank"
                  rel="noopener"
                  onClick={closeBooking}
                  className="border border-[#0B0B0C]/20 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D1612] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F1EA] transition-colors hover:border-[#5D1612] hover:bg-[#5D1612] hover:text-[#F4F1EA]"
                  data-testid="link-book-salon"
                >
                  <span className="block text-xs font-medium uppercase tracking-[0.16em]">The salon</span>
                  <span className="mt-2 block font-serif text-2xl leading-none">50 West 17th</span>
                  <span className="sr-only"> (opens Square booking in a new tab)</span>
                </a>
                <a
                  href={SQUARE_BOOKING_URLS.mobile}
                  target="_blank"
                  rel="noopener"
                  onClick={closeBooking}
                  className="border border-[#0B0B0C]/20 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D1612] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F1EA] transition-colors hover:border-[#5D1612] hover:bg-[#5D1612] hover:text-[#F4F1EA]"
                  data-testid="link-book-mobile"
                >
                  <span className="block text-xs font-medium uppercase tracking-[0.16em]">On the go</span>
                  <span className="mt-2 block font-serif text-2xl leading-none">We come to you</span>
                  <span className="sr-only"> (opens Square booking in a new tab)</span>
                </a>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#0B0B0C]/60">
                Booking opens in Square, where you can see the price list and reserve your appointment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
