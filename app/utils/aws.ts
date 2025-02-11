// Types and Interfaces
export interface BedrockCredentials {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

// Type definitions for better type safety
type ParsedEvent = Record<string, any>;
type EventResult = ParsedEvent[];

// Using a dot as separator since it's not used in Base64
const SEPARATOR = "~";

// Unified crypto utilities for both frontend and backend
async function generateKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes));
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function encrypt(
  data: string,
  encryptionKey: string,
): Promise<string> {
  if (!data) return "";
  if (!encryptionKey) {
    throw new Error("Encryption key is required for AWS credential encryption");
  }

  try {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await generateKey(encryptionKey, salt);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      enc.encode(data),
    );

    // Convert to base64 strings
    const encryptedBase64 = arrayBufferToBase64(encrypted);
    const saltBase64 = arrayBufferToBase64(salt);
    const ivBase64 = arrayBufferToBase64(iv);

    return [saltBase64, ivBase64, encryptedBase64].join(SEPARATOR);
  } catch (error) {
    // console.error("[Encryption Error]:", error);
    throw new Error("Failed to encrypt AWS credentials");
  }
}

export async function decrypt(
  encryptedData: string,
  encryptionKey: string,
): Promise<string> {
  if (!encryptedData) return "";
  if (!encryptionKey) {
    throw new Error("Encryption key is required for AWS credential decryption");
  }

  try {
    const [saltBase64, ivBase64, cipherBase64] = encryptedData.split(SEPARATOR);

    // Convert base64 strings back to Uint8Arrays
    const salt = base64ToArrayBuffer(saltBase64);
    const iv = base64ToArrayBuffer(ivBase64);
    const cipherData = base64ToArrayBuffer(cipherBase64);

    const key = await generateKey(encryptionKey, salt);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      cipherData,
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (error) {
    throw new Error("Failed to decrypt AWS credentials");
  }
}

export function maskSensitiveValue(value: string): string {
  if (!value) return "";
  if (value.length <= 6) return value;
  const masked = "*".repeat(value.length - 6);
  return value.slice(0, 3) + masked + value.slice(-3);
}

// AWS Signing
export interface SignParams {
  method: string;
  url: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  body: string | object;
  service: string;
  headers?: Record<string, string>;
  isStreaming?: boolean;
}

async function createHmac(
  key: ArrayBuffer | Uint8Array,
  data: string,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = key instanceof Uint8Array ? key : new Uint8Array(key);
  const keyObject = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", keyObject, encoder.encode(data));
}

async function getSigningKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const kDate = await createHmac(encoder.encode("AWS4" + secretKey), dateStamp);
  const kRegion = await createHmac(kDate, region);
  const kService = await createHmac(kRegion, service);
  const kSigning = await createHmac(kService, "aws4_request");
  return kSigning;
}

function normalizeHeaderValue(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function encodeRFC3986(str: string): string {
  return encodeURIComponent(str)
    .replace(
      /[!'()*]/g,
      (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase(),
    )
    .replace(/[-_.~]/g, (c) => c);
}

function getCanonicalUri(path: string): string {
  if (!path || path === "/") return "/";

  return (
    "/" +
    path
      .split("/")
      .map((segment) => {
        if (!segment) return "";
        if (segment === "invoke-with-response-stream") return segment;

        if (segment.includes("model/")) {
          return segment
            .split(/(model\/)/)
            .map((part) => {
              if (part === "model/") return part;
              return part
                .split(/([.:])/g)
                .map((subpart, i) =>
                  i % 2 === 1 ? subpart : encodeRFC3986(subpart),
                )
                .join("");
            })
            .join("");
        }

        return encodeRFC3986(segment);
      })
      .join("/")
  );
}

export async function sign({
  method,
  url,
  region,
  accessKeyId,
  secretAccessKey,
  body,
  service,
  headers: customHeaders = {},
  isStreaming = true,
}: SignParams): Promise<Record<string, string>> {
  try {
    const endpoint = new URL(url);
    const canonicalUri = getCanonicalUri(endpoint.pathname.slice(1));
    const canonicalQueryString = endpoint.search.slice(1);

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);

    const bodyString = typeof body === "string" ? body : JSON.stringify(body);
    const encoder = new TextEncoder();
    const payloadBuffer = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(bodyString),
    );
    const payloadHash = Array.from(new Uint8Array(payloadBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const headers: Record<string, string> = {
      accept: isStreaming
        ? "application/vnd.amazon.eventstream"
        : "application/json",
      "content-type": "application/json",
      host: endpoint.host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      ...customHeaders,
    };

    // Add x-amzn-bedrock-accept header for streaming requests
    if (isStreaming) {
      headers["x-amzn-bedrock-accept"] = "*/*";
    }

    const sortedHeaderKeys = Object.keys(headers).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );

    const canonicalHeaders = sortedHeaderKeys
      .map(
        (key) => `${key.toLowerCase()}:${normalizeHeaderValue(headers[key])}\n`,
      )
      .join("");

    const signedHeaders = sortedHeaderKeys
      .map((key) => key.toLowerCase())
      .join(";");

    const canonicalRequest = [
      method.toUpperCase(),
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");

    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

    const canonicalRequestHash = Array.from(
      new Uint8Array(
        await crypto.subtle.digest("SHA-256", encoder.encode(canonicalRequest)),
      ),
    )
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      canonicalRequestHash,
    ].join("\n");

    const signingKey = await getSigningKey(
      secretAccessKey,
      dateStamp,
      region,
      service,
    );

    const signature = Array.from(
      new Uint8Array(await createHmac(signingKey, stringToSign)),
    )
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const authorization = [
      `${algorithm} Credential=${accessKeyId}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(", ");

    return {
      ...headers,
      Authorization: authorization,
    };
  } catch (error) {
    console.error("[AWS Signing Error]: Failed to sign request");
    throw new Error("Failed to sign AWS request");
  }
}

// Bedrock utilities
function decodeBase64(base64String: string): string {
  try {
    const bytes = Buffer.from(base64String, "base64");
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  } catch (e) {
    console.error("[Base64 Decode Error]:", e);
    return "";
  }
}

export function parseEventData(chunk: Uint8Array): EventResult {
  const decoder = new TextDecoder("utf-8");
  const text = decoder.decode(chunk);
  const results: EventResult = [];

  try {
    // First try to parse as regular JSON
    const parsed = JSON.parse(text);
    if (parsed.bytes) {
      const decoded = decodeBase64(parsed.bytes);
      try {
        const decodedJson = JSON.parse(decoded);
        results.push(decodedJson);
      } catch (e) {
        results.push({ output: decoded });
      }
      return results;
    }

    if (typeof parsed.body === "string") {
      try {
        const parsedBody = JSON.parse(parsed.body);
        results.push(parsedBody);
      } catch (e) {
        results.push({ output: parsed.body });
      }
      return results;
    }

    results.push(parsed.body || parsed);
    return results;
  } catch (e) {
    // If regular JSON parse fails, try to extract event content
    const eventRegex = /:event-type[^\{]+(\{[^\}]+\})/g;
    let match;

    while ((match = eventRegex.exec(text)) !== null) {
      try {
        const eventData = match[1];
        const parsed = JSON.parse(eventData);

        if (parsed.bytes) {
          const decoded = decodeBase64(parsed.bytes);
          try {
            const decodedJson = JSON.parse(decoded);
            if (decodedJson.choices?.[0]?.message?.content) {
              results.push({ output: decodedJson.choices[0].message.content });
            } else {
              results.push(decodedJson);
            }
          } catch (e) {
            results.push({ output: decoded });
          }
        } else {
          results.push(parsed);
        }
      } catch (e) {
        console.debug("[Event Parse Warning]:", e);
      }
    }

    // If no events were found, try to extract clean text
    if (results.length === 0) {
      // Remove event metadata markers and clean the text
      const cleanText = text
        .replace(/\{KG[^:]+:event-type[^}]+\}/g, "") // Remove event markers
        .replace(/[\x00-\x1F\x7F-\x9F\uFEFF]/g, "") // Remove control characters
        .trim();

      if (cleanText) {
        results.push({ output: cleanText });
      }
    }
  }

  return results;
}

export function processMessage(
  data: ParsedEvent,
  remainText: string,
  runTools: any[],
  index: number,
): { remainText: string; index: number } {
  if (!data) return { remainText, index };

  try {
    // Handle Nova's tool calls with exact schema match
    // console.log("processMessage data=========================",data);
    if (data.contentBlockStart?.start?.toolUse) {
      const toolUse = data.contentBlockStart.start.toolUse;
      index += 1;
      runTools.push({
        id: toolUse.toolUseId,
        type: "function",
        function: {
          name: toolUse.name || "", // Ensure name is always present
          arguments: "{}", // Initialize empty arguments
        },
      });
      return { remainText, index };
    }

    // Handle Nova's tool input in contentBlockDelta
    if (data.contentBlockDelta?.delta?.toolUse?.input) {
      if (runTools[index]) {
        runTools[index].function.arguments =
          data.contentBlockDelta.delta.toolUse.input;
      }
      return { remainText, index };
    }

    // Handle Nova's text content
    if (data.output?.message?.content?.[0]?.text) {
      remainText += data.output.message.content[0].text;
      return { remainText, index };
    }

    // Handle Nova's messageStart event
    if (data.messageStart) {
      return { remainText, index };
    }

    // Handle Nova's text delta
    if (data.contentBlockDelta?.delta?.text) {
      remainText += data.contentBlockDelta.delta.text;
      return { remainText, index };
    }

    // Handle Nova's contentBlockStop event
    if (data.contentBlockStop) {
      return { remainText, index };
    }

    // Handle Nova's messageStop event
    if (data.messageStop) {
      return { remainText, index };
    }

    // Handle message_start event (for other models)
    if (data.type === "message_start") {
      return { remainText, index };
    }

    // Handle content_block_start event (for other models)
    if (data.type === "content_block_start") {
      if (data.content_block?.type === "tool_use") {
        index += 1;
        runTools.push({
          id: data.content_block.id,
          type: "function",
          function: {
            name: data.content_block.name || "", // Ensure name is always present
            arguments: "",
          },
        });
      }
      return { remainText, index };
    }

    // Handle content_block_delta event (for other models)
    if (data.type === "content_block_delta") {
      if (data.delta?.type === "input_json_delta" && runTools[index]) {
        runTools[index].function.arguments += data.delta.partial_json;
      } else if (data.delta?.type === "text_delta") {
        const newText = data.delta.text || "";
        remainText += newText;
      }
      return { remainText, index };
    }

    // Handle tool calls for other models
    if (data.choices?.[0]?.message?.tool_calls) {
      for (const toolCall of data.choices[0].message.tool_calls) {
        index += 1;
        runTools.push({
          id: toolCall.id || `tool-${Date.now()}`,
          type: "function",
          function: {
            name: toolCall.function?.name || "", // Ensure name is always present
            arguments: toolCall.function?.arguments || "",
          },
        });
      }
      return { remainText, index };
    }

    // Handle various response formats
    let newText = "";
    if (data.delta?.text) {
      newText = data.delta.text;
    } else if (data.choices?.[0]?.message?.content) {
      newText = data.choices[0].message.content;
    } else if (data.content?.[0]?.text) {
      newText = data.content[0].text;
    } else if (data.generation) {
      newText = data.generation;
    } else if (data.outputText) {
      newText = data.outputText;
    } else if (data.response) {
      newText = data.response;
    } else if (data.output) {
      newText = data.output;
    }

    // Only append if we have new text
    if (newText) {
      remainText += newText;
    }
  } catch (e) {
    console.warn("Failed to process Bedrock message:");
  }

  return { remainText, index };
}

export function processChunks(
  chunks: Uint8Array[],
  pendingChunk: Uint8Array | null,
  remainText: string,
  runTools: any[],
  index: number,
): {
  chunks: Uint8Array[];
  pendingChunk: Uint8Array | null;
  remainText: string;
  index: number;
} {
  let currentText = remainText;
  let currentIndex = index;

  while (chunks.length > 0) {
    const chunk = chunks[0];
    try {
      // If there's a pending chunk, try to merge it with the current chunk
      let chunkToProcess = chunk;
      if (pendingChunk) {
        const mergedChunk = new Uint8Array(pendingChunk.length + chunk.length);
        mergedChunk.set(pendingChunk);
        mergedChunk.set(chunk, pendingChunk.length);
        chunkToProcess = mergedChunk;
        pendingChunk = null;
      }

      // Try to process the chunk
      const parsedEvents = parseEventData(chunkToProcess);
      if (parsedEvents.length > 0) {
        // Process each event in the chunk
        for (const parsed of parsedEvents) {
          const result = processMessage(
            parsed,
            currentText,
            runTools,
            currentIndex,
          );
          currentText = result.remainText;
          currentIndex = result.index;
        }
        chunks.shift(); // Remove processed chunk
      } else {
        // If parsing fails, it might be an incomplete chunk
        pendingChunk = chunkToProcess;
        chunks.shift();
      }
    } catch (e) {
      // console.error("[Chunk Process Error]:", e);
      // chunks.shift(); // Remove error chunk
      // pendingChunk = null; // Reset pending chunk on error
      console.warn("Failed to process chunk, attempting recovery");
      // Attempt to recover by processing the next chunk
      if (chunks.length > 1) {
        chunks.shift();
        pendingChunk = null;
      } else {
        // If this is the last chunk, throw to prevent data loss
        throw new Error("Failed to process final chunk");
      }
    }
  }

  return {
    chunks,
    pendingChunk,
    remainText: currentText,
    index: currentIndex,
  };
}

export function getBedrockEndpoint(
  region: string,
  modelId: string,
  shouldStream: boolean,
): string {
  if (!region || !modelId) {
    throw new Error("Region and model ID are required for Bedrock endpoint");
  }
  const baseEndpoint = `https://bedrock-runtime.${region}.amazonaws.com`;
  const endpoint =
    shouldStream === false
      ? `${baseEndpoint}/model/${modelId}/invoke`
      : `${baseEndpoint}/model/${modelId}/invoke-with-response-stream`;
  return endpoint;
}

export function extractMessage(res: any, modelId: string = ""): string {
  if (!res) {
    throw new Error("Empty response received");
  }

  let message = "";

  // Handle Nova model response format
  if (modelId.toLowerCase().includes("nova")) {
    if (res.output?.message?.content?.[0]?.text) {
      message = res.output.message.content[0].text;
    } else {
      message = res.output || "";
    }
  }
  // Handle Mistral model response format
  else if (modelId.toLowerCase().includes("mistral")) {
    if (res.choices?.[0]?.message?.content) {
      message = res.choices[0].message.content;
    } else {
      message = res.output || "";
    }
  }
  // Handle Llama model response format
  else if (modelId.toLowerCase().includes("llama")) {
    message = res?.generation || "";
  }
  // Handle Titan model response format
  else if (modelId.toLowerCase().includes("titan")) {
    message = res?.outputText || "";
  }
  // Handle Claude and other models
  else if (res.content?.[0]?.text) {
    message = res.content[0].text;
  }
  // Handle other response formats
  else {
    message = res.output || res.response || res.message || "";
  }

  return message;
}
