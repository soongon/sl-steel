import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ContactLink from "@/components/ContactLink";
import { SITE } from "@/lib/site";
import type { PostMeta } from "@/lib/blog";

export function CompanyIntro() {
  return (
    <section id="about" className="silla-intro">
      <div className="silla-container silla-intro-grid">
        <span className="silla-eyebrow">SILLA STEEL</span>
        <h2>
          철근이 필요한 곳에도,
          <br />
          철근이 남은 곳에도.
        </h2>
        <p>
          현장 직접 수거부터 안정적인 납품까지.
          <br />
          신라철강이 함께합니다.
        </p>
      </div>
    </section>
  );
}
export function BusinessOverview() {
  return (
    <section id="business" className="silla-section silla-services">
      <div className="silla-container">
        <div className="silla-section-heading">
          <div>
            <span className="silla-eyebrow">OUR BUSINESS</span>
            <h2>현장에 맞는 답을 드립니다.</h2>
          </div>
          <p>
            남은 자재의 수거와 필요한 자재의 공급.
            <br />
            철근의 시작과 다음 쓰임을 함께합니다.
          </p>
        </div>
        <div className="silla-service-grid">
          <article>
            <div className="silla-service-photo">
              <Image
                src="/images/warehouse-rebar.jpg"
                alt="창고에 보관 중인 신라철강 철근"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </div>
            <div className="silla-service-title">
              <span>01</span>
              <h3>잔여 철근 매입</h3>
            </div>
            <p>
              녹이 발생한 철근과 4m 이상 절단 철근.
              <br />
              상태를 확인하고 현장에서 직접 수거합니다.
            </p>
            <dl>
              <div>
                <dt>매입 대상</dt>
                <dd>{SITE.business.recovery.table.target}</dd>
              </div>
              <div>
                <dt>제외 대상</dt>
                <dd>{SITE.business.recovery.table.exclude}</dd>
              </div>
            </dl>
            <ContactLink className="silla-inline-link">
              매입 상담하기 <ArrowUpRight size={20} aria-hidden="true" />
            </ContactLink>
          </article>
          <article>
            <div className="silla-service-photo">
              <Image
                src="/images/warehouse-hbeam.jpg"
                alt="신라철강 창고의 H빔 재고"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </div>
            <div className="silla-service-title">
              <span>02</span>
              <h3>철근·H빔 납품</h3>
            </div>
            <p>
              필요한 규격과 수량, 현장 일정에 맞춰.
              <br />
              재고 확인부터 현장 납품까지 안내합니다.
            </p>
            <dl>
              <div>
                <dt>취급 자재</dt>
                <dd>철근 · H빔</dd>
              </div>
              <div>
                <dt>현장 대응</dt>
                <dd>재고·규격 확인 · 배차 상담 · 현장 직납</dd>
              </div>
            </dl>
            <ContactLink type="납품 문의" className="silla-inline-link">
              납품 문의하기 <ArrowUpRight size={20} aria-hidden="true" />
            </ContactLink>
          </article>
        </div>
      </div>
    </section>
  );
}
export function FieldCases({ posts }: { posts: PostMeta[] }) {
  return (
    <section id="cases" className="silla-section silla-cases">
      <div className="silla-container">
        <div className="silla-section-heading">
          <div>
            <span className="silla-eyebrow">FROM THE FIELD</span>
            <h2>현장에서 쌓아온 신뢰.</h2>
          </div>
          <Link href="/blog" className="silla-inline-link">
            전체 현장 이야기 <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
        {posts.length ? (
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
                    alt={post.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                </div>
                <div className="silla-case-meta">
                  <span>{post.categories[0] || "현장 이야기"}</span>
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
        ) : (
          <p className="silla-case-empty">
            현장의 이야기를 블로그에서 만나보세요.
          </p>
        )}
      </div>
    </section>
  );
}
export function Facilities() {
  return (
    <section id="system" className="silla-section silla-facilities">
      <div className="silla-container silla-facility-grid">
        <div className="silla-facility-photo">
          <Image
            src="/images/facility-truck-wide.jpg"
            alt="신라철강 창고 앞 크레인 카고 트럭"
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
          />
        </div>
        <div className="silla-facility-copy">
          <span className="silla-eyebrow">OUR INFRASTRUCTURE</span>
          <h2>
            직접 갖추고,
            <br />
            직접 움직입니다.
          </h2>
          <p>
            대형 창고와 야적장, 크레인 카고 트럭.
            <br />
            보관부터 상하차·운송까지 직접 대응합니다.
          </p>
          <dl>
            {SITE.system.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
