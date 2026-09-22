export interface UploadResult {
  event: string;
  info: { secure_url: string; resource_type: string };
}
export interface UploadWidget {
  open: () => void;
}
declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: Record<string, unknown>,
        callback: (error: unknown, result: UploadResult) => void,
      ) => UploadWidget;
    };
  }
}

export function optimizedUploadUrl(info: UploadResult["info"]): string {
  return info.resource_type === "video"
    ? info.secure_url
    : info.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
}
