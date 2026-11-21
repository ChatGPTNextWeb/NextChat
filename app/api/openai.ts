import { type OpenAIListModelResponse } from "@/app/client/platforms/openai";
import { getServerSideConfig } from "@/app/config/server";
import { OpenaiPath } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { authOpenAI } from "./auth";
import { requestOpenai } from "./common";
import { writeAccountSession } from "./account/session";

const ALLOWED_PATH = new Set(Object.values(OpenaiPath));

function getModels(remoteModelRes: OpenAIListModelResponse) {
  const config = getServerSideConfig();

  if (config.disableGPT4) {
    remoteModelRes.data = remoteModelRes.data.filter(
      (m) =>
        !(
          m.id.startsWith("gpt-4") ||
          m.id.startsWith("chatgpt-4o") ||
          m.id.startsWith("o1") ||
          m.id.startsWith("o3")
        ) || m.id.startsWith("gpt-4o-mini"),
    );
  }

  return remoteModelRes;
}

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[OpenAI Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const subpath = params.path.join("/");

  if (!ALLOWED_PATH.has(subpath)) {
    console.log("[OpenAI Route] forbidden path ", subpath);
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + subpath,
      },
      {
        status: 403,
      },
    );
  }

  const authResult = await authOpenAI(req, subpath);
  if (authResult.error) {
    const response = NextResponse.json(
      { error: true, msg: authResult.msg },
      {
        status: authResult.status,
      },
    );
    return authResult.clearSession
      ? writeAccountSession(response, null)
      : response;
  }

  const { refreshedSession } = authResult;
  function withSession(response: Response) {
    if (!refreshedSession) return response;
    const wrapped = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    wrapped.headers.set("Cache-Control", "private, no-store");
    return writeAccountSession(wrapped, refreshedSession);
  }

  try {
    const response = await requestOpenai(req);

    // list models
    if (subpath === OpenaiPath.ListModelPath && response.status === 200) {
      const resJson = (await response.json()) as OpenAIListModelResponse;
      const availableModels = getModels(resJson);
      return withSession(
        NextResponse.json(availableModels, {
          status: response.status,
        }),
      );
    }

    return withSession(response);
  } catch (e) {
    console.error("[OpenAI] ", e);
    return withSession(NextResponse.json(prettyObject(e)));
  }
}
