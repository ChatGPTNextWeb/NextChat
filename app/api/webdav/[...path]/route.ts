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

  // Validate the endpoint to prevent potential SSRF attacks
  if (!endpoint || !endpoint.startsWith("/")) {
    return NextResponse.json(
      {
        error: true,
        msg: "Invalid endpoint",
      },
      {
        status: 400,
      },
    );
  }
  const endpointPath = params.path.join("/");
  const targetPath = `${endpoint}/${endpointPath}`;

  // only allow MKCOL, GET, PUT
  if (req.method !== "MKCOL" && req.method !== "GET" && req.method !== "PUT") {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
  }

  // for MKCOL request, only allow request ${folder}
  if (
    req.method === "MKCOL" &&
     !targetPath.endsWith(folder)
  ) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
  }

  // for GET request, only allow request ending with fileName
  if (
    req.method === "GET" &&
     !targetPath.endsWith(fileName)
  ) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
  }

  //   for PUT request, only allow request ending with fileName
  if (
    req.method === "PUT" &&
     !targetPath.endsWith(fileName)
  ) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
  }

  const targetUrl = `${endpoint}/${endpointPath}`;

  const method = req.method;
  const shouldNotHaveBody = ["get", "head"].includes(
    method?.toLowerCase() ?? "",
  );

  const fetchOptions: RequestInit = {
    headers: {
      authorization: req.headers.get("authorization") ?? "",
    },
    body: shouldNotHaveBody ? null : req.body,
    redirect: 'manual',
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
