/**
 * Brand marks for certification providers (Devicon / Simple Icons CDN).
 */
const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const si = (slug: string, hex: string) => `https://cdn.simpleicons.org/${slug}/${hex}`;

export type CertProviderId =
  | 'meta'
  | 'google'
  | 'coursera'
  | 'deeplearning'
  | 'aws'
  | 'michigan'
  | 'letsupgrade';

/** Default logo URL per provider; `null` → render initials from org name */
export const CERT_PROVIDER_LOGO: Record<CertProviderId, string | null> = {
  meta: si('meta', '0668E1'),
  google: `${D}/google/google-original.svg`,
  coursera: si('coursera', '0056D2'),
  deeplearning: `${D}/tensorflow/tensorflow-original.svg`,
  aws: `${D}/amazonwebservices/amazonwebservices-original-wordmark.svg`,
  michigan: `${D}/python/python-original.svg`,
  letsupgrade: null,
};
