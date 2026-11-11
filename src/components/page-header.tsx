import Link from "next/link";

export default function PageHeader({
  crumbs,
  eyebrow,
  title,
  sub,
}: {
  crumbs: Array<[string, string]>;
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-forest-ink text-oat">
      <div className="bg-dotgrid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-[11px] font-medium uppercase tracking-[0.16em] text-sage-mist/70">
          {crumbs.map(([label, href], i) => (
            <span key={href + i}>
              {i > 0 && <span className="mx-2 text-amber">›</span>}
              <Link href={href} className="transition-colors hover:text-oat">{label}</Link>
            </span>
          ))}
        </nav>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">{sub}</p>}
      </div>
    </section>
  );
}
