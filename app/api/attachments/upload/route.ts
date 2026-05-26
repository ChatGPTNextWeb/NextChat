import { NextRequest, NextResponse } from "next/server";
import {
  cleanupExpiredAttachments,
  extractTextFromBuffer,
  getAttachmentLimits,
  saveAttachmentFile,
} from "../utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { maxSizeBytes } = getAttachmentLimits();
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof (file as File).arrayBuffer !== "function") {
    return NextResponse.json(
      { code: 1, msg: "missing file" },
      { status: 400 },
    );
  }

  const uploadFile = file as File;
  if (uploadFile.size > maxSizeBytes) {
    return NextResponse.json(
      { code: 1, msg: "file too large" },
      { status: 413 },
    );
  }

  await cleanupExpiredAttachments();

  const buffer = Buffer.from(await uploadFile.arrayBuffer());
  const extracted = await extractTextFromBuffer(
    buffer,
    uploadFile.name,
    uploadFile.type,
  );
  const saved = await saveAttachmentFile(
    buffer,
    uploadFile.name,
    uploadFile.type,
    req,
  );

  return NextResponse.json({
    code: 0,
    data: {
      ...saved,
      text: extracted.text || "",
      warning: extracted.warning,
    },
  });
}
