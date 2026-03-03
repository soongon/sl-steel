import type { InquiryType } from "@/lib/site";

/**
 * contact 섹션으로 스크롤하면서 inquiry 탭을 동기화합니다.
 * - history.replaceState: 브라우저 자동 스크롤(id 불일치) 없이 hash만 업데이트
 * - hashchange 이벤트 수동 dispatch: ContactSection 리스너가 탭을 전환
 * - scrollIntoView: 부드러운 스크롤
 */
export function scrollToContact(type: InquiryType) {
  const newHash = `contact?type=${encodeURIComponent(type)}`;
  const oldURL = window.location.href;                       // replaceState 전에 캡처
  history.replaceState(null, "", `#${newHash}`);
  window.dispatchEvent(
    new HashChangeEvent("hashchange", {
      oldURL,
      newURL: `${window.location.origin}${window.location.pathname}#${newHash}`,
      bubbles: true,
    })
  );
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}