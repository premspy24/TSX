import Link from "next/link";
import {
  ShieldCheck,
  BadgeCheck,
  Lock,
  HeadphonesIcon,
} from "lucide-react";

const productLinks = [
  { href: "/discover", label: "Discover" },
  { href: "/sell", label: "Sell" },
  { href: "/exchange", label: "Exchange" },
  { href: "/pricing", label: "Pricing" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
  { href: "/press", label: "Press" },
];

const supportLinks = [
  { href: "/help", label: "Help Center" },
  { href: "/contact", label: "Contact Us" },
  { href: "/disputes", label: "Dispute Resolution" },
  { href: "/report", label: "Report Issue" },
];

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/refunds", label: "Refund Policy" },
];

const socials = [
  { label: "Twitter", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Verified Platform" },
  { icon: BadgeCheck, label: "Buyer Protection" },
  { icon: Lock, label: "Secure Payments" },
  { icon: HeadphonesIcon, label: "24/7 Support" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-white/10 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 sm:col-span-4 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="relative flex size-9 items-center justify-center rounded-xl gradient-primary">
                  <span className="text-lg font-black text-white leading-none">X</span>
                  <div className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-secondary" />
                </div>
                <span className="text-lg font-bold text-white">TicketSwapX</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                The trusted marketplace for buying, selling, and exchanging event tickets.
              </p>
            </div>

            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Company" links={companyLinks} />
            <FooterColumn title="Support" links={supportLinks} />
            <FooterColumn title="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="border-b border-white/10 py-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Icon className="size-4 text-primary-light" />
                </div>
                <span className="text-sm font-medium text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TicketSwapX. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="text-sm text-slate-500 transition-colors hover:text-white"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
