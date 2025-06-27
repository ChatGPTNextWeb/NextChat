import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "../config/server";
import { OPENAI_BASE_URL, ServiceProvider } from "../constant";
import { cloudflareAIGatewayUrl } from "../utils/cloudflare";
import { getModelProvider, isModelNotavailableInServer } from "../utils/model";

const serverConfig = getServerSideConfig();

// Hàm proxy request từ client tới OpenAI hoặc Azure OpenAI, xử lý xác thực, cấu hình endpoint, kiểm tra model, và trả về response phù hợp.
export async function requestOpenai(req: NextRequest) {
  // Tạo controller để có thể hủy request khi timeout
  const controller = new AbortController();

  // Kiểm tra xem request có phải tới Azure OpenAI không
  const isAzure = req.nextUrl.pathname.includes("azure/deployments");

  // Biến lưu giá trị xác thực và tên header xác thực
  var authValue,
    authHeaderName = "";

  if (isAzure) {
    // Nếu là Azure, lấy api-key từ header Authorization
    authValue =
      req.headers
        .get("Authorization")
        ?.trim()
        .replaceAll("Bearer ", "")
        .trim() ?? "";

    authHeaderName = "api-key";
  } else {
    // Nếu là OpenAI thường, giữ nguyên header Authorization

    authValue = req.headers.get("Authorization") ?? "";
    authHeaderName = "Authorization";

    console.log("[Auth] ", authValue);
  }

  // Xử lý lại đường dẫn endpoint cho phù hợp với OpenAI/Azure
  let path = `${req.nextUrl.pathname}`.replaceAll("/api/openai/", "");

  // console.log("[Proxy] mac dinh ", path);

  // Lấy baseUrl từ config, ưu tiên Azure nếu là request Azure
  let baseUrl =
    (isAzure ? serverConfig.azureUrl : serverConfig.baseUrl) || OPENAI_BASE_URL;

  // Đảm bảo baseUrl có tiền tố https
  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }

  // Loại bỏ dấu "/" ở cuối baseUrl nếu có
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  // In ra log để debug đường dẫn và baseUrl
  console.log("[Proxy] ", path);
  console.log("[Base Url]", baseUrl);

  // Thiết lập timeout cho request (10 phút), nếu quá sẽ abort
  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  // Nếu là Azure, xử lý lại path và api-version cho đúng chuẩn Azure
  if (isAzure) {
    const azureApiVersion =
      req?.nextUrl?.searchParams?.get("api-version") ||
      serverConfig.azureApiVersion;
    baseUrl = baseUrl.split("/deployments").shift() as string;
    path = `${req.nextUrl.pathname.replaceAll(
      "/api/azure/",
      "",
    )}?api-version=${azureApiVersion}`;

    // Nếu có customModels và azureUrl, kiểm tra và thay thế deployment id nếu cần
    if (serverConfig.customModels && serverConfig.azureUrl) {
      const modelName = path.split("/")[1];
      let realDeployName = "";
      serverConfig.customModels
        .split(",")
        .filter((v) => !!v && !v.startsWith("-") && v.includes(modelName))
        .forEach((m) => {
          const [fullName, displayName] = m.split("=");
          const [_, providerName] = getModelProvider(fullName);
          if (providerName === "azure" && !displayName) {
            const [_, deployId] = (serverConfig?.azureUrl ?? "").split(
              "deployments/",
            );
            if (deployId) {
              realDeployName = deployId;
            }
          }
        });
      if (realDeployName) {
        console.log("[Replace with DeployId", realDeployName);
        path = path.replaceAll(modelName, realDeployName);
      }
    }
  }

  // Tạo url cuối cùng để fetch, có thể qua Cloudflare Gateway nếu cấu hình
  const fetchUrl = cloudflareAIGatewayUrl(`${baseUrl}/${path}`);

  console.log("fetchUrl", fetchUrl);

  // Thiết lập các option cho fetch, bao gồm headers, method, body, v.v.
  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      [authHeaderName]: authValue,
      ...(serverConfig.openaiOrgId && {
        "OpenAI-Organization": serverConfig.openaiOrgId,
      }),
    },
    method: req.method,
    body: req.body,
    // Fix lỗi body chỉ dùng được 1 lần trên Cloudflare Worker
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  // Kiểm tra model có bị cấm sử dụng không (ví dụ: cấm GPT-4)
  if (serverConfig.customModels && req.body) {
    try {
      const clonedBody = await req.text();
      fetchOptions.body = clonedBody;

      const jsonBody = JSON.parse(clonedBody) as { model?: string };

      // Nếu model không được phép sử dụng, trả về lỗi 403
      if (
        isModelNotavailableInServer(
          serverConfig.customModels,
          jsonBody?.model as string,
          [
            ServiceProvider.OpenAI,
            ServiceProvider.Azure,
            jsonBody?.model as string, // hỗ trợ model không rõ provider
          ],
        )
      ) {
        return NextResponse.json(
          {
            error: true,
            message: `you are not allowed to use ${jsonBody?.model} model`,
          },
          {
            status: 403,
          },
        );
      }
    } catch (e) {
      console.error("[OpenAI] gpt4 filter", e);
    }
  }

  try {
    // Gửi request tới OpenAI/Azure và nhận response
    const res = await fetch(fetchUrl, fetchOptions);

    // Lấy header OpenAI-Organization từ response (nếu có)
    const openaiOrganizationHeader = res.headers.get("OpenAI-Organization");

    // Nếu đã cấu hình openaiOrgId, log giá trị header này
    if (serverConfig.openaiOrgId && serverConfig.openaiOrgId.trim() !== "") {
      console.log("[Org ID]", openaiOrganizationHeader);
    } else {
      console.log("[Org ID] is not set up.");
    }

    // Xử lý lại headers trả về cho client
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate"); // Xóa header yêu cầu xác thực
    newHeaders.set("X-Accel-Buffering", "no"); // Tắt buffer của nginx

    // Nếu chưa cấu hình Org ID, xóa header này khỏi response
    if (!serverConfig.openaiOrgId || serverConfig.openaiOrgId.trim() === "") {
      newHeaders.delete("OpenAI-Organization");
    }

    // Xóa header content-encoding để tránh lỗi giải nén trên trình duyệt
    newHeaders.delete("content-encoding");

    // Trả về response cho client với các header đã xử lý
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } finally {
    // Dù thành công hay lỗi đều clear timeout
    clearTimeout(timeoutId);
  }
}
