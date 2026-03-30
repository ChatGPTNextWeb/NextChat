import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { ApiPath } from "@/app/constant";
import { getServerSideConfig } from "@/app/config/server";
import type { NextRequest } from "next/server";

export type AttachmentMeta = {
  id: string;
  name: string;
  type: string;
  size: number;
  fileName: string;
  createdAt: number;
};

type AttachmentConfig = {
  storeDir: string;
  urlPrefix?: string;
  ttlMs: number;
  maxSizeBytes: number;
  maxTextLength: number;
};

const serverConfig = getServerSideConfig();

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getAttachmentConfig(): AttachmentConfig {
  const storeDir =
    serverConfig.attachmentStoreDir ||
    path.join(process.cwd(), "data", "attachments");
  const urlPrefix = serverConfig.attachmentUrlPrefix;
  const ttlHours = toNumber(serverConfig.attachmentTtlHours, 24);
  const maxSizeMb = toNumber(serverConfig.attachmentMaxSizeMb, 20);
  const maxTextLength = toNumber(serverConfig.attachmentMaxTextLength, 20000);
  return {
    storeDir,
    urlPrefix,
    ttlMs: Math.max(1, ttlHours) * 60 * 60 * 1000,
    maxSizeBytes: Math.max(1, maxSizeMb) * 1024 * 1024,
    maxTextLength: Math.max(1000, maxTextLength),
  };
}

export function getAttachmentLimits() {
  return getAttachmentConfig();
}

export async function ensureStoreDir() {
  const { storeDir } = getAttachmentConfig();
  await fs.mkdir(storeDir, { recursive: true });
  return storeDir;
}

const EXT_BY_MIME: Record<string, string> = {
  "text/plain": ".txt",
  "text/markdown": ".md",
  "text/csv": ".csv",
  "application/json": ".json",
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    ".pptx",
};

function sanitizeFileName(name: string) {
  const base = path.basename(name || "attachment");
  const sanitized = base.replace(/[<>:"/\\|?*\\u0000-\\u001F]/g, "_");
  return sanitized.slice(0, 120) || "attachment";
}

function resolveExtension(fileName: string, mimeType?: string) {
  const ext = path.extname(fileName);
  if (ext) return ext;
  if (mimeType && EXT_BY_MIME[mimeType]) return EXT_BY_MIME[mimeType];
  return ".bin";
}

export function buildAttachmentUrl(id: string, req?: NextRequest) {
  const { urlPrefix } = getAttachmentConfig();
  if (urlPrefix) {
    return `${urlPrefix.replace(/\/$/, "")}/${id}`;
  }
  if (req?.nextUrl?.origin) {
    return `${req.nextUrl.origin}${ApiPath.Attachments}/${id}`;
  }
  return `${ApiPath.Attachments}/${id}`;
}

export async function saveAttachmentFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  req?: NextRequest,
) {
  const { storeDir, ttlMs } = getAttachmentConfig();
  await ensureStoreDir();
  const id = nanoid();
  const safeName = sanitizeFileName(originalName);
  const ext = resolveExtension(safeName, mimeType);
  const displayName = safeName.endsWith(ext) ? safeName : `${safeName}${ext}`;
  const fileName = `${id}${ext}`;
  const filePath = path.join(storeDir, fileName);
  const metaPath = path.join(storeDir, `${id}.json`);
  const createdAt = Date.now();
  const meta: AttachmentMeta = {
    id,
    name: displayName,
    type: mimeType || "application/octet-stream",
    size: buffer.length,
    fileName,
    createdAt,
  };
  await fs.writeFile(filePath, buffer);
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));
  return {
    ...meta,
    url: buildAttachmentUrl(id, req),
    expiresAt: createdAt + ttlMs,
  };
}

export async function readAttachmentMeta(id: string) {
  const { storeDir } = getAttachmentConfig();
  const metaPath = path.join(storeDir, `${id}.json`);
  try {
    const raw = await fs.readFile(metaPath, "utf-8");
    return JSON.parse(raw) as AttachmentMeta;
  } catch {
    return null;
  }
}

export async function deleteAttachment(id: string) {
  const { storeDir } = getAttachmentConfig();
  const meta = await readAttachmentMeta(id);
  const metaPath = path.join(storeDir, `${id}.json`);
  try {
    if (meta?.fileName) {
      await fs.rm(path.join(storeDir, meta.fileName), { force: true });
    }
    await fs.rm(metaPath, { force: true });
  } catch (error) {
    console.error("[Attachment] delete failed", error);
  }
}

export async function cleanupExpiredAttachments() {
  const { storeDir, ttlMs } = getAttachmentConfig();
  await ensureStoreDir();
  const entries = await fs.readdir(storeDir);
  const now = Date.now();
  await Promise.all(
    entries
      .filter((name) => name.endsWith(".json"))
      .map(async (name) => {
        const metaPath = path.join(storeDir, name);
        try {
          const raw = await fs.readFile(metaPath, "utf-8");
          const meta = JSON.parse(raw) as AttachmentMeta;
          if (now - meta.createdAt > ttlMs) {
            await deleteAttachment(meta.id);
          }
        } catch (error) {
          console.error("[Attachment] cleanup failed", error);
        }
      }),
  );
}

export async function resolveAttachment(id: string) {
  const { storeDir, ttlMs } = getAttachmentConfig();
  const meta = await readAttachmentMeta(id);
  if (!meta) return null;
  if (Date.now() - meta.createdAt > ttlMs) {
    await deleteAttachment(id);
    return null;
  }
  const filePath = path.join(storeDir, meta.fileName);
  return { meta, filePath };
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
) {
  const { maxTextLength } = getAttachmentConfig();
  const ext = path.extname(fileName).toLowerCase();

  const truncate = (text: string) => {
    const normalized = text.replace(/\\u0000/g, "").trim();
    if (normalized.length <= maxTextLength) return normalized;
    return `${normalized.slice(0, maxTextLength)}\\n\\n[Truncated]`;
  };

  const isPlainText =
    mimeType.startsWith("text/") ||
    ["application/json", "application/xml"].includes(mimeType) ||
    [".txt", ".md", ".csv", ".json", ".log", ".yaml", ".yml"].includes(ext);

  try {
    if (isPlainText) {
      return { text: truncate(buffer.toString("utf-8")) };
    }

    if (mimeType === "application/pdf" || ext === ".pdf") {
      const pdfModule = (await import("pdf-parse")) as any;
      const pdfParse = pdfModule.default ?? pdfModule;
      const data = await pdfParse(buffer);
      return { text: truncate(data?.text || "") };
    }

    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      ext === ".docx"
    ) {
      const mammothModule = (await import("mammoth")) as any;
      const mammoth = mammothModule.default ?? mammothModule;
      const result = await mammoth.extractRawText({ buffer });
      return { text: truncate(result?.value || "") };
    }

    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-excel" ||
      [".xlsx", ".xls"].includes(ext)
    ) {
      const xlsxModule = (await import("xlsx")) as any;
      const XLSX = xlsxModule.default ?? xlsxModule;
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheets = workbook.SheetNames.map((name: string) => {
        const sheet = workbook.Sheets[name];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        return `# Sheet: ${name}\\n${csv}`;
      });
      return { text: truncate(sheets.join("\\n\\n")) };
    }
  } catch (error) {
    console.error("[Attachment] extract failed", error);
  }

  return {
    text: "",
    warning: "Unsupported file type or empty content.",
  };
}
