import Link from "next/link";
import { InstagramIcon, FacebookIcon } from "@/components/social-icons";
import { Reveal } from "@/components/reveal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { footer, common } = dict;

  return (
    <footer className="bg-elevated">
      <div className="filetto" />
      <Reveal className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-cream">
              Tortellino <span className="italic text-gold">d&rsquo;Oro</span>
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted">
              {footer.tagline}
            </p>
            <address className="mt-6 space-y-1 text-sm not-italic leading-relaxed text-cream-muted">
              <p>{common.address}</p>
              <p>
                <a
                  href={`tel:${common.phoneHref}`}
                  className="transition-colors hover:text-gold-bright"
                >
                  {common.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${common.email}`}
                  className="transition-colors hover:text-gold-bright"
                >
                  {common.email}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h2 className="eyebrow">{footer.hoursTitle}</h2>
            <dl className="mt-6 space-y-2 text-sm">
              {common.hours.map((row) => (
                <div key={row.days} className="flex justify-between gap-6">
                  <dt className="text-cream-muted">{row.days}</dt>
                  <dd className="text-right text-cream">{row.times}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="eyebrow">{footer.socialTitle}</h2>
            <div className="mt-6 flex gap-5">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-gold transition-colors hover:text-gold-bright"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="text-gold transition-colors hover:text-gold-bright"
              >
                <FacebookIcon size={20} />
              </a>
            </div>
            <p className="mt-8">
              <Link
                href={`/${locale}/contatti`}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted underline decoration-gold/40 underline-offset-4 transition-colors hover:text-cream"
              >
                {dict.nav.contact} →
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line/60 pt-6 text-xs text-cream-muted/70 sm:flex-row sm:justify-between">
          <p>{footer.legal}</p>
          <p>{footer.credits}</p>
        </div>
      </Reveal>
    </footer>
  );
}
