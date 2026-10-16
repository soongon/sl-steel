"use client";
import { useEffect } from "react";
import { captureSourceNow } from "@/lib/source-capture";

/** 페이지가 열릴 때 유입 정보를 sessionStorage 에 남긴다(렌더 없음). root layout 에서 한 번. */
export default function SourceCapture() {
  useEffect(() => {
    captureSourceNow();
  }, []);
  return null;
}
