/**
 * Site-wide settings (SITE-SPEC §13.2). Owned by scaffold.
 *
 * Values that need Simon's approval stay at their safe defaults:
 *  - contactEmail: null until Simon supplies the address to publish. While null, the contact page
 *    omits the email block and `npm run check:prelaunch` fails, which blocks deploy.
 *  - abn, linkedin: null (hidden).
 *  - products: [] (no product names on the site in v1).
 *  - showAcknowledgement: false.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface Product {
  name: string;
  url: string;
}

export interface SiteConfig {
  name: string;
  descriptor: string;
  footerDescriptor: string;
  operatingLine: string;
  location: string;
  founder: string;
  contactEmail: string | null;
  abn: string | null;
  linkedin: string | null;
  nav: NavItem[];
  headerCta: NavItem;
  footerNav: {
    work: NavItem[];
    company: NavItem[];
  };
  products: Product[];
  showAcknowledgement: boolean;
}

export const site: SiteConfig = {
  name: 'BEMA Labs',
  descriptor: 'Practical automation and software for operations teams.',
  footerDescriptor:
    'Practical automation and software for operations teams in Bathurst and the Central West.',
  operatingLine: 'Build. Experiment. Measure. Adapt.',
  location: 'Bathurst, NSW',
  founder: 'Simon Tan',
  contactEmail: null,
  abn: null,
  linkedin: null,
  nav: [
    { label: 'Services', href: '/services/' },
    { label: 'How we work', href: '/how-we-work/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],
  headerCta: { label: 'Arrange a walkthrough', href: '/contact/' },
  footerNav: {
    work: [
      { label: 'Services', href: '/services/' },
      { label: 'How we work', href: '/how-we-work/' },
      { label: 'Contact', href: '/contact/' },
    ],
    company: [
      { label: 'About', href: '/about/' },
      { label: 'Labs', href: '/labs/' },
      { label: 'Privacy', href: '/privacy/' },
    ],
  },
  products: [],
  showAcknowledgement: false,
};

/** mailto template (COPY §5.2). */
export const mailtoSubject = 'Walkthrough request';

export const mailtoBodyLines: string[] = [
  'Business name:',
  'Your name and role:',
  "The process you'd like to improve:",
  'Roughly how often it happens:',
  'Systems involved (for example Microsoft 365, accounting or job software):',
  'Best way and time to reach you:',
  'How did you hear about BEMA Labs?',
];

/**
 * The mailto: href for the contact page, or null while no contact email is set.
 * Subject and body are encoded with encodeURIComponent; line breaks become %0D%0A.
 */
export function mailtoHref(): string | null {
  if (!site.contactEmail) return null;
  const subject = encodeURIComponent(mailtoSubject);
  const body = encodeURIComponent(mailtoBodyLines.join('\r\n'));
  return `mailto:${site.contactEmail}?subject=${subject}&body=${body}`;
}
