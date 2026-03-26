"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Script from "next/script";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: { secure_url: string; resource_type: string } }) => void
      ) => { open: () => void };
    };
  }
}

export default function CloudinaryUpload({ value, onChange }: Props) {
  const widgetRef = useRef<{ open: () => void } | null>(null);

  useEffect(() => {
    return () => {
      widgetRef.current = null;
    };
  }, []);

  function openWidget() {
    if (widgetRef.current) {
      widgetRef.current.open();
      return;
    }

    if (!window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
        folder: "blog",
        sources: ["local", "url"],
        multiple: false,
        maxFileSize: 5_000_000,
        cropping: false,
      },
      (error, result) => {
        if (error) return;
        if (result.event === "success") {
          const url = result.info.secure_url.replace(
            "/upload/",
            "/upload/f_auto,q_auto,w_800/"
          );
          onChange(url);
        }
      }
    );

    widgetRef.current = widget;
    widget.open();
  }

  return (
    <div>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="lazyOnload"
      />

      {value ? (
        <div className="relative">
          <div className="relative h-40 w-full overflow-hidden rounded-lg border border-border">
            <Image
              src={value}
              alt="썸네일 미리보기"
              fill
              className="object-cover"
              sizes="400px"
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={openWidget}
              className="text-sm text-accent hover:text-accent-dark"
            >
              변경
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm text-red-500 hover:text-red-600"
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openWidget}
          className="w-full rounded-lg border-2 border-dashed border-border px-4 py-8 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
        >
          이미지 업로드
        </button>
      )}
    </div>
  );
}
