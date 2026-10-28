import { useEffect } from 'react';

// The public domain search engines should credit, even when the site is opened on a vercel.app URL.
export const SITE_URL = 'https://modernbarberingnyc.com';

const metaSelectors = {
  description: ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'],
  title: ['meta[property="og:title"]', 'meta[name="twitter:title"]'],
  url: ['meta[property="og:url"]'],
};

// Sets the page title, description and canonical URL for one route, and puts back the previous values on leave.
export function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousTitle = document.title;
    const previousCanonical = canonical?.href;
    const restore: Array<() => void> = [];

    const set = (selectors: string[], value: string) => {
      for (const selector of selectors) {
        const element = document.querySelector<HTMLMetaElement>(selector);
        if (!element) continue;
        const previous = element.content;
        element.content = value;
        restore.push(() => {
          element.content = previous;
        });
      }
    };

    document.title = title;
    set(metaSelectors.title, title);
    set(metaSelectors.description, description);
    set(metaSelectors.url, url);
    if (canonical) canonical.href = url;

    return () => {
      document.title = previousTitle;
      restore.forEach((undo) => undo());
      if (canonical && previousCanonical) canonical.href = previousCanonical;
    };
  }, [title, description, path]);
}
