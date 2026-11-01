import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Scale,
  Truck,
  Layers,
  Check,
  X,
} from "lucide-react";
import ContactLink from "@/components/ContactLink";
import { SITE } from "@/lib/site";
import { USED_REBAR } from "@/lib/used-rebar";
import type { PostMeta } from "@/lib/blog";

const POINT_ICONS = [Layers, Truck, Scale] as const;

export function UsedRebarHero() {
  const { h1, subcopy, points, cta, phoneCta } = USED_REBAR.hero;
  const phone = SITE.footer.regions[0].phone;
  return (
    <section
      id="hero"
      className="silla-subhero"
      aria-label="중고철근 매입 소개"
    >
      <Image
        src="/images/warehouse-rebar.jpg"
        alt="신라철강 창고에 보관 중인 매입 철근"
        fill
        priority
        sizes="100vw"
        className="silla-subhero-image"
      />
      <div className="silla-subhero-shade" />
      <div className="silla-container silla-subhero-content">
        <span className="silla-eyebrow">USED REBAR PURCHASE</span>
        <h1>{h1}</h1>
        <p>{subcopy}</p>
        <div className="silla-hero-actions">
          <ContactLink className="silla-hero-cta silla-hero-cta-primary">
            {cta} <ArrowRight size={20} aria-hidden="true" />
          </ContactLink>
          <a
            className="silla-hero-cta silla-hero-cta-secondary"
            href={`tel:${phone}`}
          >
            {phoneCta} <Phone size={18} aria-hidden="true" />
          </a>
        </div>
        <ul className="silla-subhero-points" aria-label="주요 장점">
          {points.map((point, i) => {
            const Icon = POINT_ICONS[i] ?? Layers;
            return (
              <li key={point.title}>
                <Icon size={22} aria-hidden="true" />
                <div>
                  <strong>{point.title}</strong>
                  <span>{point.desc}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function PurchaseTargets() {
  const { eyebrow, title, lead, items } = USED_REBAR.targets;
  return (
    <section id="targets" className="silla-section silla-targets">
      <div className="silla-container">
        <div className="silla-section-heading">
          <div>
            <span className="silla-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <p>{lead}</p>
        </div>
        <ul className="silla-target-grid">
          {items.map((item, i) => (
            <li key={item.title}>
              <span className="silla-target-index">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PurchaseCriteria() {
  const { eyebrow, title, lead, rows, notice, note } = USED_REBAR.criteria;
  const { target, exclude } = SITE.business.recovery.table;
  return (
    <section id="criteria" className="silla-section silla-criteria">
      <div className="silla-container">
        <div className="silla-section-heading">
          <div>
            <span className="silla-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <p>{lead}</p>
        </div>
        <div className="silla-criteria-grid">
          <div className="silla-criteria-cards">
            <div className="silla-criteria-card is-yes">
              <Check size={20} aria-hidden="true" />
              <div>
                <h3>매입 가능</h3>
                <p>{target}</p>
              </div>
            </div>
            <div className="silla-criteria-card is-no">
              <X size={20} aria-hidden="true" />
              <div>
                <h3>매입 제외</h3>
                <p>{exclude}</p>
              </div>
            </div>
          </div>
          <div>
            <dl className="silla-criteria-table">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="silla-criteria-notice">{notice}</p>
          </div>
        </div>
        <aside className="silla-criteria-note">
          <h3>{note.title}</h3>
          <p>{note.body}</p>
        </aside>
      </div>
    </section>
  );
}

export function PurchaseProcess() {
  const { eyebrow, title, guide, steps } = USED_REBAR.process;
  return (
    <section id="process" className="silla-section silla-process">
      <div className="silla-container">
        <div className="silla-section-heading">
          <div>
            <span className="silla-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
        </div>
        <p className="silla-process-guide">{guide}</p>
        <ol className="silla-process-steps" aria-label={title}>
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className="silla-step-number">0{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PurchaseCases({ posts }: { posts: PostMeta[] }) {
  const { eyebrow, title, lead, more } = USED_REBAR.cases;
  if (!posts.length) return null;
  return (
    <section id="cases" className="silla-section silla-cases">
      <div className="silla-container">
        <div className="silla-section-heading">
          <div>
            <span className="silla-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <Link
            href="/blog?category=%EB%A7%A4%EC%9E%85%20%EA%B8%B0%EC%A4%80"
            className="silla-inline-link"
          >
            {more} <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
        <p className="silla-cases-lead">{lead}</p>
        <div className="silla-case-grid">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="silla-case"
            >
              <div className="silla-case-photo">
                <Image
                  src={post.thumbnail || "/images/facility-truck-wide.jpg"}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                />
              </div>
              <div className="silla-case-meta">
                <span>{post.categories[0] || "수거 사례"}</span>
                <time dateTime={post.date}>
                  {post.date.replaceAll("-", ".")}
                </time>
              </div>
              <h3>{post.title}</h3>
              <span className="silla-case-read">
                자세히 보기 <ArrowRight size={18} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UsedRebarFaq() {
  const { eyebrow, title, items } = USED_REBAR.faq;
  return (
    <section id="faq" className="silla-section silla-faq">
      <div className="silla-container">
        <div className="silla-section-heading">
          <div>
            <span className="silla-eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
        </div>
        <div className="silla-faq-list">
          {items.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary>
                <h3>{item.q}</h3>
                <ArrowRight size={18} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
