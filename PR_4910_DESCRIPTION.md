close #4910

#### 💻 变更类型

- [x] feat
- [ ] fix
- [ ] refactor
- [ ] perf
- [ ] style
- [ ] test
- [x] docs
- [ ] ci
- [ ] chore
- [ ] build

#### 🔀 变更说明
- 为 NextChat 增加 HuggingFace provider 的完整支持（对应 `close #4910`）。
- 新增并接入 HuggingFace 路由与代理链路：`/api/huggingface`，后端新增 `app/api/huggingface.ts`，并在统一 provider 路由中完成分发。
- 鉴权逻辑接入 HuggingFace：支持系统密钥注入与请求头透传。
- 客户端请求链路接入 HuggingFace：
  - `ClientApi`/`getClientApi` 支持 HuggingFace provider。
  - `getHeaders()` 支持读取 HuggingFace API Key。
  - OpenAI 兼容平台层新增 HuggingFace endpoint/base URL 解析逻辑。
- 设置页新增 HuggingFace 配置项（Endpoint / API Key）。
- 常量与模型预置扩展：
  - 新增 `HUGGINGFACE_BASE_URL`、`ApiPath.HuggingFace`、`ServiceProvider.HuggingFace`、`ModelProvider.HuggingFace`。
  - 新增 HuggingFace 默认模型预置列表。
- 文档与配置补充：
  - `.env.template` 新增 `HUGGINGFACE_API_KEY`、`HUGGINGFACE_URL`。
  - `README.md` / `README_CN.md` 新增 HuggingFace 环境变量说明。
  - 中英文 locale 文案已补齐。

#### 📝 补充信息
- 本地验证结果：
  - `npm run lint`：失败（已知 ESLint 运行时问题：`Cannot read properties of undefined (reading 'loc')`，规则 `unused-imports/no-unused-imports`）。
  - `npx tsx app/masks/build.ts`：通过。
  - `BUILD_MODE=standalone npx next build`：通过（存在 warnings，但不阻断构建）。
  - `node --no-warnings --experimental-vm-modules ./node_modules/jest/bin/jest.js --ci`：通过（4/4 suites，17/17 tests）。
- 分支状态：
  - 代码已推送到 `private/feature-4910-huggingface`。
  - 同步存在 `private/feature-4910-huggingface-support`，两者指向相同提交。
