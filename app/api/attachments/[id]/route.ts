import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { resolveAttachment, deleteAttachment } from "../utils";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const resolved = await resolveAttachment(params.id);
  if (!resolved) {
    return NextResponse.json({ code: 1, msg: "not found" }, { status: 404 });
  }

  const { meta, filePath } = resolved;
  const data = await fs.readFile(filePath);
  const filename = encodeURIComponent(meta.name);

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": meta.type || "application/octet-stream",
      "Content-Disposition": `attachment; filename=\"${filename}\"; filename*=UTF-8''${filename}`,
      "Cache-Control": "no-store",
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  await deleteAttachment(params.id);
  return NextResponse.json({ code: 0 });
}
