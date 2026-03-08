"use client";

import { useRef } from "react";
import Image from "next/image";
import Script from "next/script";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: { secure_url: string } }) => void
      ) => { open: () => void };
    };
  }
}

export default function MultiImageUpload({ images, onChange }: Props) {
  const widgetRef = useRef<{ open: () => void } | null>(null);

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
        sources: ["local", "url", "camera"],
        multiple: true,
        maxFiles: 10,
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
          onChange([...images, url]);
        }
      }
    );

    widgetRef.current = widget;
    widget.open();
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function setAsThumbnail(index: number) {
    if (index === 0) return;
    const reordered = [...images];
    const [moved] = reordered.splice(index, 1);
    reordered.unshift(moved);
    onChange(reordered);
  }

  return (
    <div>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="lazyOnload"
      />

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {images.map((url, i) => (
            <div key={url} className="group relative">
              <div className={`relative h-28 overflow-hidden rounded-lg border-2 ${
                i === 0 ? "border-accent" : "border-border"
              }`}>
                <Image
                  src={url}
                  alt={`이미지 ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                    썸네일
                  </span>
                )}
              </div>
              <div className="mt-1 flex gap-2">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => setAsThumbnail(i)}
                    className="text-xs text-accent hover:text-accent-dark"
                  >
                    썸네일로
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={openWidget}
        className="w-full rounded-lg border-2 border-dashed border-border px-4 py-6 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
      >
        {images.length > 0 ? "이미지 추가" : "현장 사진 업로드 (여러 장 가능)"}
      </button>

      {images.length > 0 && (
        <p className="mt-2 text-xs text-muted">
          첫 번째 이미지가 썸네일로 사용됩니다. 나머지는 본문에 자동 삽입됩니다.
        </p>
      )}
    </div>
  );
}
