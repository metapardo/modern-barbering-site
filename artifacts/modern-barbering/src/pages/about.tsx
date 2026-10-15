import { useEffect } from 'react';
import portrait from '@assets/Agent_Image_-_Convert_this_photograph_to_black_and_white_clean_1792005020781.png';
import { Footer, Header } from '@/components/site-navigation';

const ABOUT_TITLE = 'Ryon — About | Modern Barbering NYC';
const ABOUT_DESCRIPTION =
  'Meet Ryon, founder of Modern Barbering NYC. More than 25 years of barbering, building relationships in the salon, at home, and at the office.';

export default function About() {
  const goToBooking = () => window.location.assign(`${import.meta.env.BASE_URL}#booking`);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const title = document.title;
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

    document.title = ABOUT_TITLE;
    if (description) description.content = ABOUT_DESCRIPTION;
    if (ogTitle) ogTitle.content = ABOUT_TITLE;
    if (ogDescription) ogDescription.content = ABOUT_DESCRIPTION;
    if (twitterTitle) twitterTitle.content = ABOUT_TITLE;
    if (twitterDescription) twitterDescription.content = ABOUT_DESCRIPTION;

    return () => {
      document.title = title;
      if (description && previous.description !== undefined) description.content = previous.description;
      if (ogTitle && previous.ogTitle !== undefined) ogTitle.content = previous.ogTitle;
      if (ogDescription && previous.ogDescription !== undefined) ogDescription.content = previous.ogDescription;
      if (twitterTitle && previous.twitterTitle !== undefined) twitterTitle.content = previous.twitterTitle;
      if (twitterDescription && previous.twitterDescription !== undefined) twitterDescription.content = previous.twitterDescription;
    };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-[#0B0B0C] text-[#F4F1EA] selection:bg-primary selection:text-[#F4F1EA]">
      <Header activeAbout onBook={goToBooking} />
      <main className="section-dark min-h-[100dvh] px-6 pb-24 pt-32 sm:pt-36">
        <header className="mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-4 text-[#F4F1EA]/45">A little about the chair</p>
          <h1 data-testid="text-about-name" className="font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            Ryon
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#F4F1EA]/60 sm:text-sm">
            Founder, Modern Barbering NYC
          </p>
          <figure className="mx-auto mt-10 w-full max-w-[360px] sm:mt-14">
            <img
              src={portrait}
              alt="Ryon cutting a client's hair at Modern Barbering NYC"
              data-testid="img-ryon-portrait"
              className="aspect-[3/4] w-full object-cover object-center"
            />
            <figcaption className="mt-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#F4F1EA]/35">
              The person behind the chair
            </figcaption>
          </figure>
        </header>

        <article className="mx-auto mt-12 max-w-[760px] space-y-7 text-[1rem] leading-[1.9] text-[#F4F1EA]/75 sm:mt-16 sm:text-[1.0625rem]">
          <p>
            What started as a passion for barbering has grown into a career spanning more than 25 years. Since moving from Guyana to the United States 12 years ago, I’ve spent much of that time working in New York City and building lasting relationships through my craft.
          </p>
          <p>
            Just before the pandemic, I started Modern Barbering NYC as an independent business. In 2020, I began offering mobile barbering services, bringing the experience directly to my clients.
          </p>
          <p>
            Today, I continue to do what I’ve always loved, whether it’s in the salon, at a client’s home, or at their office. For me, barbering has always been about the craft, building relationships, and taking pride in the work I do.
          </p>
        </article>

        <div className="mx-auto mt-12 max-w-[760px] border-t border-[#F4F1EA]/15 pt-8 sm:mt-16">
          <p className="font-serif text-2xl leading-snug text-[#F4F1EA] sm:text-3xl">
            One chair. Wherever the moment finds you.
          </p>
          <button
            type="button"
            onClick={goToBooking}
            data-testid="button-about-book"
            className="mt-7 inline-flex min-h-12 items-center border border-[#F4F1EA]/50 px-6 text-xs uppercase tracking-[0.17em] text-[#F4F1EA] transition-colors hover:bg-[#F4F1EA] hover:text-[#0B0B0C]"
          >
            Book an appointment
          </button>
        </div>
      </main>
      <Footer onBook={goToBooking} />
    </div>
  );
}
