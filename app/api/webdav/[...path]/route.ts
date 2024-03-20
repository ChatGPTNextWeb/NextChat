import { NextRequest, NextResponse } from "next/server";
import { STORAGE_KEY } from "../../../constant";
async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }
  const folder = STORAGE_KEY;
  const fileName = `${folder}/backup.json`;

  const requestUrl = new URL(req.url);
  let endpoint = requestUrl.searchParams.get("endpoint");
  if (!endpoint?.endsWith("/")) {
    endpoint += "/";
  }
  const endpointPath = params.path.join("/");

  // only allow MKCOL, GET, PUT
  if (req.method !== "MKCOL" && req.method !== "GET" && req.method !== "PUT") {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + params.path.join("/"),
      },
      {
        status: 403,
      },
    );
  }

  // for MKCOL request, only allow request ${folder}
  if (
    req.method == "MKCOL" &&
    !new URL(endpointPath).pathname.endsWith(folder)
  ) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + params.path.join("/"),
      },
      {
        status: 403,
      },
    );
  }

  // for GET request, only allow request ending with fileName
  if (
    req.method == "GET" &&
    !new URL(endpointPath).pathname.endsWith(fileName)
  ) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + params.path.join("/"),
      },
      {
        status: 403,
      },
    );
  }

  //   for PUT request, only allow request ending with fileName
  if (
    req.method == "PUT" &&
    !new URL(endpointPath).pathname.endsWith(fileName)
  ) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + params.path.join("/"),
      },
      {
        status: 403,
      },
    );
  }

  const targetUrl = `${endpoint + endpointPath}`;

  const method = req.method;
  const shouldNotHaveBody = ["get", "head"].includes(
    method?.toLowerCase() ?? "",
  );

  const fetchOptions: RequestInit = {
    headers: {
      authorization: req.headers.get("authorization") ?? "",
    },
    body: shouldNotHaveBody ? null : req.body,
    method,
    // @ts-ignore
    duplex: "half",
  };

  const fetchResult = await fetch(targetUrl, fetchOptions);

  console.log("[Any Proxy]", targetUrl, {
    status: fetchResult.status,
    statusText: fetchResult.statusText,
  });

  return fetchResult;
}

export const POST = handle;
export const GET = handle;
export const OPTIONS = handle;

export const runtime = "edge";
