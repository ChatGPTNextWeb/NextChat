import { NextRequest, NextResponse } from "next/server";
import {
  cleanupExpiredAttachments,
  getAttachmentLimits,
  saveAttachmentFile,
} from "../utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { maxSizeBytes } = getAttachmentLimits();
  const body = (await req.json()) as {
    name?: string;
    content?: string;
    contentType?: string;
  };
  const name = body?.name?.toString().trim() || "attachment.txt";
  const content = body?.content?.toString() ?? "";
  const contentType = body?.contentType?.toString() || "text/plain";

  const buffer = Buffer.from(content, "utf-8");
  if (buffer.length > maxSizeBytes) {
    return NextResponse.json(
      { code: 1, msg: "content too large" },
      { status: 413 },
    );
  }

  await cleanupExpiredAttachments();
  const saved = await saveAttachmentFile(buffer, name, contentType, req);

  return NextResponse.json({
    code: 0,
    data: saved,
  });
}
