close #4910

## 中文说明（Chinese）
### 背景
Issue #4910 希望 NextChat 支持 Hugging Face。  
本 PR 为 Hugging Face Inference Router（OpenAI 兼容接口）增加了完整 provider 支持，覆盖前端设置、后端代理、鉴权与文档。

### 主要改动
1. Provider 与模型定义
- 新增 `HUGGINGFACE_BASE_URL = https://router.huggingface.co`
- 新增 `ApiPath.HuggingFace = /api/huggingface`
- 新增 `ServiceProvider.HuggingFace` 与 `ModelProvider.HuggingFace`
- 新增 HuggingFace provider 常量与默认模型预置

2. 前端配置与请求链路
- `app/store/access.ts`
  - 新增 `huggingfaceUrl` / `huggingfaceApiKey`
  - 新增 `isValidHuggingFace()`
  - `isAuthorized()` 纳入 HuggingFace Key 判断
- `app/client/api.ts`
  - 新增 HuggingFace provider 到 `ClientApi` / `getClientApi` 路由
  - `getHeaders()` 支持读取 HuggingFace API Key
- `app/client/platforms/openai.ts`
  - 复用 OpenAI 兼容实现，新增 HuggingFace endpoint 解析逻辑
  - 自定义配置时使用 `huggingfaceUrl`
  - 非自定义配置时使用 `/api/huggingface`（Web）或官方基址（App）

3. 后端代理与鉴权
- 新增 `app/api/huggingface.ts`
  - 代理 HuggingFace 请求
  - 透传 `Authorization`
  - 与现有 provider 一致的 header/流处理方式
  - 支持 `customModels` 可用性校验
- `app/api/[provider]/[...path]/route.ts` 新增 HuggingFace 路由分发
- `app/api/auth.ts` 新增 `ModelProvider.HuggingFace` 系统 Key 注入
- `app/config/server.ts` 新增：
  - `HUGGINGFACE_API_KEY`
  - `HUGGINGFACE_URL`
  - `isHuggingFace` 相关服务端配置导出

4. 设置页与文案
- `app/components/settings.tsx` 新增 HuggingFace 设置区域：
  - Endpoint
  - API Key
- 新增中英文文案：
  - `app/locales/cn.ts`
  - `app/locales/en.ts`

5. 文档
- `.env.template` 新增：
  - `HUGGINGFACE_API_KEY`
  - `HUGGINGFACE_URL`
- `README.md`、`README_CN.md` 新增 HuggingFace 环境变量说明

### 本地测试方法
```bash
# 安装依赖
npm install

# 运行 lint
npm run lint

# 构建（当前环境无 yarn，使用等价命令）
npx tsx app/masks/build.ts && npx cross-env BUILD_MODE=standalone next build
```

### 实跑结果（本地）
1) `npm install`
- ✅ 成功（exit code 0）
- 安装完成，可进行后续检查与构建

2) `npm run lint`
- ⚠️ 失败（exit code 1）
- 错误：`Cannot read properties of undefined (reading 'loc')`
- 位置：`app/constant.ts:1`
- 规则：`unused-imports/no-unused-imports`

3) `npx tsx app/masks/build.ts && npx cross-env BUILD_MODE=standalone next build`
- ✅ 成功（exit code 0）
- 产物构建完成（包含 warnings，但不阻断构建）

### 使用说明（HuggingFace）
在设置页选择 `HuggingFace` 后配置：
- Endpoint：默认 `https://router.huggingface.co`
- API Key：`hf_...`

模型可使用内置预置，也可通过 `CUSTOM_MODELS` 扩展。

---

## English Description
### Background
Issue #4910 requests Hugging Face support in NextChat.  
This PR adds full provider integration for Hugging Face Inference Router (OpenAI-compatible API), including frontend settings, backend proxying, auth wiring, and docs.

### What changed
1. Provider and model definitions
- Added `HUGGINGFACE_BASE_URL = https://router.huggingface.co`
- Added `ApiPath.HuggingFace = /api/huggingface`
- Added `ServiceProvider.HuggingFace` and `ModelProvider.HuggingFace`
- Added HuggingFace provider constant and built-in model presets

2. Frontend config and request flow
- `app/store/access.ts`
  - Added `huggingfaceUrl` / `huggingfaceApiKey`
  - Added `isValidHuggingFace()`
  - Included HuggingFace in `isAuthorized()`
- `app/client/api.ts`
  - Routed HuggingFace through `ClientApi` / `getClientApi`
  - Added HuggingFace API key selection in `getHeaders()`
- `app/client/platforms/openai.ts`
  - Reused OpenAI-compatible client path logic with HuggingFace endpoint resolution
  - Uses `huggingfaceUrl` under custom config
  - Uses `/api/huggingface` (web) or official base URL (app) otherwise

3. Backend proxy and auth
- Added `app/api/huggingface.ts`
  - Proxies requests to HuggingFace
  - Forwards `Authorization`
  - Keeps consistent response/header handling with existing providers
  - Applies `customModels` availability filtering
- Added route dispatch in `app/api/[provider]/[...path]/route.ts`
- Added `ModelProvider.HuggingFace` system-key injection in `app/api/auth.ts`
- Added server env/config support in `app/config/server.ts`:
  - `HUGGINGFACE_API_KEY`
  - `HUGGINGFACE_URL`
  - `isHuggingFace` and related config values

4. Settings UI and i18n
- Added HuggingFace settings section in `app/components/settings.tsx`:
  - Endpoint
  - API Key
- Added locale strings in:
  - `app/locales/en.ts`
  - `app/locales/cn.ts`

5. Docs
- Added env vars in `.env.template`:
  - `HUGGINGFACE_API_KEY`
  - `HUGGINGFACE_URL`
- Updated `README.md` and `README_CN.md` with HuggingFace env documentation

### Local test commands
```bash
npm install
npm run lint
npx tsx app/masks/build.ts && npx cross-env BUILD_MODE=standalone next build
```

### Real local run results
1) `npm install`
- ✅ Passed (exit code 0)

2) `npm run lint`
- ⚠️ Failed (exit code 1)
- Error: `Cannot read properties of undefined (reading 'loc')`
- Location: `app/constant.ts:1`
- Rule: `unused-imports/no-unused-imports`

3) `npx tsx app/masks/build.ts && npx cross-env BUILD_MODE=standalone next build`
- ✅ Passed (exit code 0)
- Production build finished successfully (warnings present, non-blocking)

### Usage notes
Select `HuggingFace` in Settings and configure:
- Endpoint: default `https://router.huggingface.co`
- API Key: `hf_...`

Use built-in model presets or extend with `CUSTOM_MODELS`.
