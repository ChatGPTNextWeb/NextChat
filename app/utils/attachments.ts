import { ApiPath } from "@/app/constant";
import type {
  Attachment,
  AttachmentUploadResponse,
} from "@/app/types/attachment";

export const ATTACHMENT_UPLOAD_URL = `${ApiPath.Attachments}/upload`;
export const ATTACHMENT_GENERATE_URL = `${ApiPath.Attachments}/generate`;

export async function uploadAttachment(file: File): Promise<Attachment> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(ATTACHMENT_UPLOAD_URL, {
    method: "POST",
    body,
    mode: "cors",
    credentials: "include",
  });
  const json = (await res.json()) as AttachmentUploadResponse;
  if (json?.code === 0 && json?.data) {
    return json.data;
  }
  throw new Error(json?.msg || `upload attachment failed: ${res.status}`);
}

export async function generateAttachment(
  name: string,
  content: string,
  contentType?: string,
): Promise<Attachment> {
  const res = await fetch(ATTACHMENT_GENERATE_URL, {
    method: "POST",
    body: JSON.stringify({ name, content, contentType }),
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "include",
  });
  const json = (await res.json()) as AttachmentUploadResponse;
  if (json?.code === 0 && json?.data) {
    return json.data;
  }
  throw new Error(json?.msg || `generate attachment failed: ${res.status}`);
}

export async function removeAttachment(attachment?: Attachment) {
  if (!attachment?.id) return;
  await fetch(`${ApiPath.Attachments}/${attachment.id}`, {
    method: "DELETE",
    mode: "cors",
    credentials: "include",
  });
}

export function formatFileSize(size: number) {
  if (!Number.isFinite(size)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let current = size;
  let index = 0;
  while (current >= 1024 && index < units.length - 1) {
    current /= 1024;
    index += 1;
  }
  const precision = current >= 10 || index === 0 ? 0 : 1;
  return `${current.toFixed(precision)} ${units[index]}`;
}
