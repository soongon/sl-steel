This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## 코드 유지보수

- `npm run lint` / `npm run typecheck` / `npm test` / `npm run build`: 정적 검사, 회귀 테스트, 배포 빌드.
- `npm run format` / `npm run format:check`: 공통 Prettier 형식 적용·확인.
- 테스트는 Node.js 22.6 이상에서 내장 테스트 러너와 TypeScript strip 모드를 사용합니다. 별도 테스트 프레임워크는 없습니다.
- 랜딩 스타일 진입점은 `app/(landing)/landing.css`이며 `styles/`의 공통·헤더·히어로·본문·절차·문의·푸터 CSS를 순서대로 불러옵니다. 공통 규칙보다 기능별 규칙을 뒤에 유지하세요.
- 문의 안내(`ContactSection`)는 서버 렌더링, 입력·제출(`contact/ContactForm`)과 전화번호 입력(`contact/PhoneInput`)은 클라이언트에서 처리합니다.
- `lib/phone.ts`는 커서 위치를 포함한 번호 편집 함수이며, 자동 대시·삭제·붙여넣기를 테스트합니다.
- 진행 절차 제목·설명은 `SITE.process`의 같은 항목에서 수정합니다.
- `lib/post-validation.ts`, `lib/revalidate-posts.ts`, `lib/cloudinary.ts`에서 슬러그 규칙, 글 변경 후 갱신 대상, 업로드 결과 타입과 이미지 URL 변환을 공통 관리합니다.
