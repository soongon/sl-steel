import type { MDXComponents } from "mdx/types";

/** MDX 본문에서 사용할 커스텀 컴포넌트 (블로그 + 어드민 미리보기 공유) */
export const mdxComponents: MDXComponents = {
  video: (props) => (
    <video controls playsInline preload="metadata" {...props} />
  ),
};
