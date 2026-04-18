close #4910

#### 💻 变更类型 | Change Type

- [x] feat    <!-- 引入新功能 | Introduce new features -->
- [ ] fix    <!-- 修复 Bug | Fix a bug -->
- [ ] refactor    <!-- 重构代码（既不修复 Bug 也不添加新功能） | Refactor code that neither fixes a bug nor adds a feature -->
- [ ] perf    <!-- 提升性能的代码变更 | A code change that improves performance -->
- [ ] style    <!-- 添加或更新不影响代码含义的样式文件 | Add or update style files that do not affect the meaning of the code -->
- [ ] test    <!-- 添加缺失的测试或纠正现有的测试 | Adding missing tests or correcting existing tests -->
- [ ] docs    <!-- 仅文档更新 | Documentation only changes -->
- [ ] ci    <!-- 修改持续集成配置文件和脚本 | Changes to our CI configuration files and scripts -->
- [ ] chore    <!-- 其他不修改 src 或 test 文件的变更 | Other changes that don't modify src or test files -->
- [ ] build    <!-- 进行架构变更 | Make architectural changes -->

#### 🔀 变更说明 | Description of Change

## 中文（CN）

为 NextChat 增加 HuggingFace provider 的完整支持（对应 close #4910）。

1. **新增并接入 HuggingFace 路由与代理链路**
   - 新增 `/api/huggingface` 路由
   - 后端新增 `app/api/huggingface.ts`，并在统一 provider 路由中完成分发

2. **鉴权逻辑接入 HuggingFace**
   - 支持系统密钥注入与请求头透传

3. **客户端请求链路接入 HuggingFace**
   - `ClientApi/getClientApi` 支持 HuggingFace provider
   - `getHeaders()` 支持读取 HuggingFace API Key
   - OpenAI 兼容平台层新增 HuggingFace endpoint/base URL 解析逻辑

4. **设置页新增 HuggingFace 配置项**
   - Endpoint 配置
   - API Key 配置

5. **常量与模型预置扩展**
   - 新增 `HUGGINGFACE_BASE_URL`、`ApiPath.HuggingFace`、`ServiceProvider.HuggingFace`、`ModelProvider.HuggingFace`
   - 新增 HuggingFace 默认模型预置列表

6. **文档与配置补充**
   - `.env.template` 新增 `HUGGINGFACE_API_KEY`、`HUGGINGFACE_URL`
   - `README.md` / `README_CN.md` 新增 HuggingFace 环境变量说明
   - 中英文 locale 文案已补齐

---

## English (EN)

Added full HuggingFace provider support in NextChat (close #4910).

1. **Introduced HuggingFace routing/proxy path**
   - Added `/api/huggingface` route
   - New backend handler `app/api/huggingface.ts` and provider dispatcher wiring

2. **Extended auth flow for HuggingFace**
   - System key injection and Authorization forwarding

3. **Integrated HuggingFace into client request flow**
   - Added HuggingFace support in `ClientApi` / `getClientApi`
   - Added HuggingFace API key handling in `getHeaders()`
   - Extended OpenAI-compatible platform layer to resolve HuggingFace endpoint/base URL

4. **Added HuggingFace settings in UI**
   - Endpoint configuration
   - API Key configuration

5. **Extended constants and model presets**
   - Added `HUGGINGFACE_BASE_URL`, `ApiPath.HuggingFace`, `ServiceProvider.HuggingFace`, and `ModelProvider.HuggingFace`
   - Added built-in HuggingFace model presets

6. **Updated docs/config**
   - Added `HUGGINGFACE_API_KEY` and `HUGGINGFACE_URL` in `.env.template`
   - Updated `README.md` / `README_CN.md` with HuggingFace env var documentation
   - Added i18n strings in both Chinese and English locales

---

#### 📝 补充信息 | Additional Information

## 中文（CN）

### 本地验证结果
- `npx tsx app/masks/build.ts`：✅ 通过
- `BUILD_MODE=standalone npx next build`：✅ 通过（存在 warnings，但不阻断构建）
- `node --no-warnings --experimental-vm-modules ./node_modules/jest/bin/jest.js --ci`：✅ 通过（4/4 suites，17/17 tests）

### 分支状态
- 代码已推送到 `private/feature-4910-huggingface`
- 同步存在 `private/feature-4910-huggingface-support`，两者指向相同提交

---

## English (EN)

### Local verification results
- `npx tsx app/masks/build.ts`: ✅ Passed
- `BUILD_MODE=standalone npx next build`: ✅ Passed (with warnings, non-blocking)
- `node --no-warnings --experimental-vm-modules ./node_modules/jest/bin/jest.js --ci`: ✅ Passed (4/4 suites, 17/17 tests)

### Branch status
- Changes are pushed to `private/feature-4910-huggingface`
- `private/feature-4910-huggingface-support` also exists and points to the same commit

---

