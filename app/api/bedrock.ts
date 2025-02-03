import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import {
  sign,
  decrypt,
  getBedrockEndpoint,
  BedrockCredentials,
} from "../utils/aws";
import { getServerSideConfig } from "../config/server";
import { ModelProvider } from "../constant";
import { prettyObject } from "../utils/format";

const ALLOWED_PATH = new Set(["chat", "models"]);

async function getBedrockCredentials(
  req: NextRequest,
): Promise<BedrockCredentials> {
  // Get AWS credentials from server config first
  const config = getServerSideConfig();
  let awsRegion = config.awsRegion;
  let awsAccessKey = config.awsAccessKey;
  let awsSecretKey = config.awsSecretKey;

  // If server-side credentials are not available, parse from Authorization header
  if (!awsRegion || !awsAccessKey || !awsSecretKey) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Missing or invalid Authorization header");
    }

    const [_, credentials] = authHeader.split("Bearer ");
    const [encryptedRegion, encryptedAccessKey, encryptedSecretKey] =
      credentials.split(":");

    if (!encryptedRegion || !encryptedAccessKey || !encryptedSecretKey) {
      throw new Error("Invalid Authorization header format");
    }
    const encryptionKey = req.headers.get("XEncryptionKey") || "";
    // Decrypt the credentials
    [awsRegion, awsAccessKey, awsSecretKey] = await Promise.all([
      decrypt(encryptedRegion, encryptionKey),
      decrypt(encryptedAccessKey, encryptionKey),
      decrypt(encryptedSecretKey, encryptionKey),
    ]);

    if (!awsRegion || !awsAccessKey || !awsSecretKey) {
      throw new Error(
        "Failed to decrypt AWS credentials. Please ensure ENCRYPTION_KEY is set correctly.",
      );
    }
  }

  return {
    region: awsRegion,
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  };
}

async function requestBedrock(req: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000);

  try {
    // Get credentials and model info
    const credentials = await getBedrockCredentials(req);
    const modelId = req.headers.get("XModelID");
    const shouldStream = req.headers.get("ShouldStream") !== "false";

    if (!modelId) {
      throw new Error("Missing model ID");
    }

    // Parse and validate request body
    const bodyText = await req.clone().text();
    if (!bodyText) {
      throw new Error("Request body is empty");
    }
    let bodyJson;
    try {
      bodyJson = JSON.parse(bodyText);
    } catch (e) {
      throw new Error(`Invalid JSON in request body: ${e}`);
    }
    console.log("[Bedrock Request] Initiating request");
    // Get endpoint and prepare request
    const endpoint = getBedrockEndpoint(
      credentials.region,
      modelId,
      shouldStream,
    );
    const requestBody: any = {
      ...bodyJson,
    };
    // Sign request
    const headers = await sign({
      method: "POST",
      url: endpoint,
      region: credentials.region,
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      body: JSON.stringify(requestBody),
      service: "bedrock",
      isStreaming: shouldStream,
    });

    // Make request to AWS Bedrock
    // console.log(
    //   "[Bedrock Request] Final Body:",
    //   JSON.stringify(requestBody, null, 2),
    // );
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      redirect: "manual",
      // @ts-ignore
      duplex: "half",
      signal: controller.signal,
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[Bedrock Error] Request failed with status:", res.status);
      try {
        const errorJson = JSON.parse(error);
        throw new Error(errorJson.message || error);
      } catch {
        throw new Error(
          `Bedrock request failed with status ${res.status}: ${
            error || "No error message"
          }`,
        );
      }
    }

    if (!res.body) {
      console.error("[Bedrock Error] Empty response body");
      throw new Error(
        "Empty response from Bedrock. Please check AWS credentials and permissions.",
      );
    }
    return res;
  } catch (e) {
    console.error("[Bedrock Request Error]:", e);
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const subpath = params.path.join("/");
  if (!ALLOWED_PATH.has(subpath)) {
    return NextResponse.json(
      { error: true, msg: "you are not allowed to request " + subpath },
      { status: 403 },
    );
  }

  const authResult = auth(req, ModelProvider.Bedrock);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    return await requestBedrock(req);
  } catch (e) {
    console.error("Handler error:", e);
    return NextResponse.json(prettyObject(e));
  }
}
