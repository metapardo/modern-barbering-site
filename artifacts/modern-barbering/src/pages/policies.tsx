import { useEffect } from 'react';
import { Footer, Header } from '@/components/site-navigation';

const TITLE = 'Policies | Modern Barbering NYC';
const DESCRIPTION =
  'Clear policies for appointments, mobile barbering, events, and group bookings with Modern Barbering NYC.';

const policies = [
  {
    title: 'Booking & Card on File',
    copy: 'A valid card is required to reserve any appointment, in the salon or on location. Your card is stored securely through Square and is not charged at booking. It is used only for your completed service or, if needed, the fees outlined below.',
  },
  {
    title: 'Payment & Processing',
    copy: 'All payments are processed through Square. Card payments include a processing fee of [X%], reflecting what Square charges us for each transaction. The full price, including this fee, is shown before you pay. Debit cards [and cash, if accepted] carry no processing fee.',
  },
  {
    title: 'Cancellations & Rescheduling',
    copy: 'Plans change. We ask for at least [24] hours’ notice to cancel or reschedule. Cancellations made within [24] hours of your appointment are charged [50%] of the service price. Rescheduling with proper notice is always free.',
  },
  {
    title: 'Late Arrivals & No-Shows',
    copy: 'We hold your chair for [10] minutes. After that, your service may be shortened or rescheduled so the next guest isn’t kept waiting. Missed appointments without notice are charged [100%] of the service price.',
  },
  {
    title: 'Mobile Service Area',
    copy: 'The mobile chair currently serves Manhattan only. For locations outside Manhattan, including events, reach out before booking and we’ll let you know what’s possible.',
  },
  {
    title: 'Events & Group Bookings',
    copy: 'Weddings, celebrations, and group appointments are arranged by inquiry and confirmed with a non-refundable deposit of [X%], applied to your final balance. Event cancellations require [14] days’ notice. Changes to headcount should be shared at least [72] hours before the event so we can adjust the schedule.',
  },
  {
    title: 'Returning Guests',
    copy: 'Guests who have been with us keep their rate. Loyalty is something we honor, not something we reprice.',
  },
  {
    title: 'Health & Safety',
    copy: 'Tools are cleaned and sanitized between every guest. If you’re feeling unwell, let us know and we’ll reschedule without a fee. We may do the same if Ryon is unwell, with as much notice as possible.',
  },
  {
    title: 'Young Guests',
    copy: 'Guests under 18 must be accompanied by a parent or guardian for the duration of the service.',
  },
  {
    title: 'Gratuity',
    copy: 'Gratuity is never expected and always appreciated. It can be added through Square at checkout.',
  },
  {
    title: 'Photography & Privacy',
    copy: 'We’ll always ask before photographing or sharing your cut. Your payment and contact details are handled through Square and are never sold or shared.',
  },
  {
    title: 'Delays & Weather',
    copy: 'New York traffic and weather are part of the work. If we’re running behind on a mobile visit, you’ll hear from us right away. In severe weather, we’ll reschedule at no charge.',
  },
];

export default function Policies() {
  const goToBooking = () => window.location.assign(`${import.meta.env.BASE_URL}#booking`);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    const previous = {
      description: description?.content,
      ogTitle: ogTitle?.content,
      ogDescription: ogDescription?.content,
      twitterTitle: twitterTitle?.content,
      twitterDescription: twitterDescription?.content,
    };

    document.title = TITLE;
    if (description) description.content = DESCRIPTION;
    if (ogTitle) ogTitle.content = TITLE;
    if (ogDescription) ogDescription.content = DESCRIPTION;
    if (twitterTitle) twitterTitle.content = TITLE;
    if (twitterDescription) twitterDescription.content = DESCRIPTION;

    return () => {
      document.title = previousTitle;
      if (description && previous.description !== undefined) description.content = previous.description;
      if (ogTitle && previous.ogTitle !== undefined) ogTitle.content = previous.ogTitle;
      if (ogDescription && previous.ogDescription !== undefined) ogDescription.content = previous.ogDescription;
      if (twitterTitle && previous.twitterTitle !== undefined) twitterTitle.content = previous.twitterTitle;
      if (twitterDescription && previous.twitterDescription !== undefined) twitterDescription.content = previous.twitterDescription;
    };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-[#0B0B0C] text-[#F4F1EA] selection:bg-primary selection:text-[#F4F1EA]">
      <Header activePolicies onBook={goToBooking} />
      <main className="section-dark min-h-[100dvh] px-6 pb-24 pt-32 sm:pt-36">
        <header className="mx-auto max-w-4xl">
          <p className="eyebrow mb-5 text-center text-[#F4F1EA]/45">Policies</p>
          <h1 className="text-center font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            The details,<br />handled up front.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-[1.8] text-[#F4F1EA]/70 sm:text-lg">
            Every appointment is time reserved for you alone. These policies protect that time, for you and for every guest who sits in the chair after you.
          </p>
          <p role="note" className="mx-auto mt-8 max-w-2xl border border-[#F4F1EA]/20 bg-[#F4F1EA]/5 px-5 py-4 text-sm leading-relaxed text-[#F4F1EA]/75" data-testid="notice-policy-draft">
            Draft: bracketed policy terms are placeholders pending confirmation.
          </p>
        </header>

        <div className="mx-auto mt-14 max-w-4xl border-t border-[#F4F1EA]/20 sm:mt-20">
          {policies.map((policy, index) => (
            <details
              key={policy.title}
              className="group border-b border-[#F4F1EA]/20"
              open={index === 0}
              data-testid={`details-policy-${index + 1}`}
            >
              <summary className="flex min-h-[76px] cursor-pointer list-none items-center justify-between gap-6 py-5 text-left marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-4 sm:gap-7">
                  <span className="font-serif text-xl text-[#F4F1EA]/40 sm:text-2xl">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm uppercase tracking-[0.12em] text-[#F4F1EA] sm:text-base">{policy.title}</span>
                </span>
                <span aria-hidden="true" className="font-serif text-2xl text-[#F4F1EA]/50 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pb-7 pl-12 text-[0.98rem] leading-[1.85] text-[#F4F1EA]/65 sm:pl-[4.25rem] sm:text-base">
                {policy.copy}
              </p>
            </details>
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-4xl border-t border-[#F4F1EA]/20 pt-10 sm:mt-20 sm:pt-14">
          <p className="max-w-3xl font-serif text-3xl leading-snug text-[#F4F1EA] sm:text-4xl">
            Questions about any of this? Ask before you book. We’d rather you sit down certain.
          </p>
          <button
            type="button"
            onClick={goToBooking}
            data-testid="button-policies-book-now"
            className="mt-8 inline-flex min-h-12 items-center border border-[#F4F1EA]/50 px-7 text-xs uppercase tracking-[0.17em] text-[#F4F1EA] transition-colors hover:bg-[#F4F1EA] hover:text-[#0B0B0C]"
          >
            Book Now
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
