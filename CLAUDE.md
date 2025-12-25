# CLAUDE.md - NextChat Codebase Guide for AI Assistants

> **Last Updated**: 2025-12-25
> **Repository**: NextChat (formerly ChatGPT-Next-Web)
> **Version**: 2.16.1

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [Development Workflows](#development-workflows)
5. [Key Conventions](#key-conventions)
6. [Common Tasks & Patterns](#common-tasks--patterns)
7. [Testing Guidelines](#testing-guidelines)
8. [Deployment](#deployment)
9. [AI Assistant Guidelines](#ai-assistant-guidelines)
10. [Important Files Reference](#important-files-reference)

---

## Project Overview

**NextChat** is a cross-platform AI chat application supporting 15+ AI providers including OpenAI, Anthropic (Claude), Google Gemini, DeepSeek, and others. It's designed as a privacy-first, lightweight ChatGPT web client with desktop application support via Tauri.

### Key Features
- Multi-provider AI support (OpenAI, Claude, Gemini, DeepSeek, etc.)
- Privacy-first: all data stored locally in browser
- Desktop apps for Linux/Windows/macOS via Tauri
- PWA with offline capability
- Model Context Protocol (MCP) support
- Real-time chat with WebRTC audio
- Artifacts system for code/content preview
- 21 language translations
- Prompt templates (Masks)

### Tech Stack Summary
- **Frontend**: Next.js 14.1.1 (App Router), React 18.2.0, TypeScript 5.2.2
- **Styling**: SASS/SCSS with CSS Modules
- **State**: Zustand 4.3.8
- **Desktop**: Tauri 1.5.11 (Rust)
- **Testing**: Jest 29.7.0 + React Testing Library

---

## Architecture & Technology Stack

### Frontend Architecture

```
Multi-Provider Pattern
├── Dynamic API routing: /app/api/[provider]/[...path]/route.ts
├── Platform implementations: /app/client/platforms/
├── Unified client API: getClientApi()
└── Supports 15+ providers
```

### State Management (Zustand Stores)

Located in `/app/store/`:
- **chat.ts**: Chat sessions, messages, conversation history
- **config.ts**: App configuration and model settings
- **access.ts**: API keys and access control
- **mask.ts**: Prompt templates
- **plugin.ts**: Plugin management
- **sync.ts**: Cloud sync configuration

### Component Architecture

- **Dynamic imports** for code splitting (lazy-loaded routes)
- **CSS Modules** for component-scoped styling (`*.module.scss`)
- **ErrorBoundary** wrapping for fault isolation
- **Client-side routing** with React Router

### API Design

- **Edge Runtime** for fast API responses
- **Streaming support** for real-time chat responses
- **CORS headers** configured for cross-origin requests
- **Proxy rewrites** for various AI provider endpoints

---

## Project Structure

```
/home/user/Mr.advokatio-/
├── app/                          # Next.js app directory (main source)
│   ├── api/                      # API routes
│   │   ├── [provider]/          # Dynamic provider routing
│   │   ├── openai.ts            # OpenAI API handler
│   │   ├── anthropic.ts         # Anthropic/Claude API handler
│   │   └── config/              # Config endpoint
│   ├── client/                   # API client implementations
│   │   └── platforms/           # Individual provider clients
│   │       ├── openai.ts
│   │       ├── anthropic.ts
│   │       ├── google.ts
│   │       └── ...
│   ├── components/              # React components
│   │   ├── home.tsx             # Main app shell
│   │   ├── chat.tsx             # Chat interface
│   │   ├── settings.tsx         # Settings panel
│   │   ├── mask.tsx             # Prompt templates
│   │   └── ...
│   ├── config/                  # Configuration utilities
│   ├── icons/                   # SVG icons (SVGR webpack loader)
│   ├── locales/                 # i18n translations (21 languages)
│   │   ├── en.ts
│   │   ├── cn.ts
│   │   └── ...
│   ├── masks/                   # Prompt template definitions
│   │   ├── build.ts             # Mask builder script
│   │   ├── cn.json
│   │   ├── en.json
│   │   └── ...
│   ├── mcp/                     # Model Context Protocol
│   ├── store/                   # Zustand state stores
│   ├── styles/                  # Global SCSS
│   │   ├── globals.scss
│   │   ├── markdown.scss
│   │   └── ...
│   └── utils/                   # Utility functions
│       ├── chat.ts
│       ├── model.ts
│       └── ...
├── docs/                        # Documentation (multilingual)
├── public/                      # Static assets
│   ├── masks.json              # Generated mask templates
│   ├── serviceWorker.js        # PWA service worker
│   └── ...
├── scripts/                     # Build and deployment scripts
│   ├── init-proxy.sh
│   └── ...
├── src-tauri/                   # Tauri desktop app
│   ├── src/
│   │   └── main.rs             # Rust entry point
│   ├── tauri.conf.json         # Tauri configuration
│   └── Cargo.toml              # Rust dependencies
├── test/                        # Jest tests
│   ├── model-available.test.ts
│   ├── model-provider.test.ts
│   └── ...
├── .github/                     # GitHub workflows
│   └── workflows/
│       ├── app.yml             # Desktop builds
│       ├── docker.yml          # Docker publishing
│       └── test.yml            # CI tests
├── Dockerfile                   # Production Docker image
├── docker-compose.yml          # Docker compose config
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── jest.config.ts              # Jest configuration
├── package.json                # Node dependencies
└── .env.template               # Environment variables template
```

---

## Development Workflows

### Initial Setup

```bash
# 1. Install dependencies (requires Node.js >= 18)
yarn install

# 2. Create .env.local file
cp .env.template .env.local

# 3. Add your API keys to .env.local
OPENAI_API_KEY=sk-xxxx
# Add other provider keys as needed

# 4. Start development server
yarn dev
```

### Build Modes

NextChat supports three distinct build modes:

#### 1. Standalone (Default Web Server)
```bash
yarn build
yarn start
```

#### 2. Export (Static Export for Desktop)
```bash
yarn export
```

#### 3. Desktop App
```bash
yarn app:dev      # Development with hot reload
yarn app:build    # Production desktop build
```

### Development Scripts

```json
{
  "dev": "concurrently \"yarn mask:watch\" \"next dev\"",
  "build": "yarn mask && BUILD_MODE=standalone next build",
  "export": "yarn mask && BUILD_MODE=export BUILD_APP=1 next build",
  "app:dev": "concurrently \"yarn mask:watch\" \"yarn tauri dev\"",
  "app:build": "yarn mask && yarn tauri build",
  "mask": "npx tsx app/masks/build.ts",
  "mask:watch": "npx watch \"yarn mask\" app/masks",
  "test": "node --no-warnings --experimental-vm-modules jest --watch",
  "test:ci": "node --no-warnings --experimental-vm-modules jest --ci",
  "lint": "next lint"
}
```

### Git Workflow

**Current Branch**: `claude/claude-md-mixl6cqn5jcf5sj4-019FCbQH47JyEPbiuunRgWXM`

**Important**: All development should occur on feature branches starting with `claude/` and ending with the session ID.

### Pre-commit Hooks

Husky + lint-staged runs on every commit:
- Auto-fixes ESLint issues in `/app/**/*`
- Formats with Prettier
- Removes unused imports

---

## Key Conventions

### Code Style

#### TypeScript
- **Strict mode**: Enabled
- **Path aliases**: Use `@/` for absolute imports (maps to project root)
- **Indentation**: 2 spaces
- **Quotes**: Double quotes
- **Trailing commas**: Required

#### File Naming
- **Components**: PascalCase with `.tsx` extension
  - Example: `ChatMessage.tsx`
- **Styles**: `component-name.module.scss`
  - Example: `chat-message.module.scss`
- **API routes**: `route.ts` (Next.js App Router convention)
- **Types**: `typing.ts` or inline type definitions
- **Utilities**: camelCase with `.ts` extension

#### Import Patterns
```typescript
// Use absolute imports via @ alias
import { ChatMessage } from "@/app/components/chat";
import { useAccessStore } from "@/app/store/access";

// Dynamic imports for heavy components
const ModelConfigList = dynamic(
  () => import("./model-config").then((mod) => mod.ModelConfigList),
  { loading: () => <div>Loading...</div> }
);
```

### Component Structure

```typescript
// Standard component pattern
import styles from "./component.module.scss";
import { useState } from "react";

export function MyComponent(props: MyComponentProps) {
  const [state, setState] = useState();

  return (
    <div className={styles.container}>
      {/* Component JSX */}
    </div>
  );
}
```

### State Management

```typescript
// Zustand store pattern
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MyState {
  value: string;
  setValue: (value: string) => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set, get) => ({
      value: "",
      setValue: (value) => set({ value }),
    }),
    {
      name: "my-store",
    }
  )
);
```

### API Route Pattern

```typescript
// app/api/[provider]/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Use Edge Runtime

export async function POST(req: NextRequest) {
  // Handle request
  return NextResponse.json({ data });
}
```

### Styling Conventions

- Use **CSS Modules** for component styles
- Global styles in `/app/styles/globals.scss`
- Follow BEM-like naming within modules
- Use SCSS variables for theming

```scss
// component.module.scss
.container {
  display: flex;

  &__header {
    padding: 1rem;
  }

  &__content {
    flex: 1;
  }
}
```

---

## Common Tasks & Patterns

### Adding a New AI Provider

1. **Create provider client** in `/app/client/platforms/`
```typescript
// app/client/platforms/newprovider.ts
export class NewProviderApi implements LLMApi {
  // Implement LLMApi interface
}
```

2. **Add API handler** in `/app/api/`
```typescript
// app/api/newprovider.ts
export function makeNewProviderHandler() {
  // Handler implementation
}
```

3. **Update model configuration** in `/app/store/config.ts`

4. **Add environment variables** to `.env.template`

5. **Update locales** in `/app/locales/` for all languages

### Adding a Translation Key

1. **Add to English locale** (primary): `/app/locales/en.ts`
```typescript
const en = {
  MyFeature: {
    Title: "My Feature",
    Description: "Feature description",
  },
};
```

2. **Add to other locales**: `/app/locales/cn.ts`, etc.

3. **Use in component**:
```typescript
import Locale from "@/app/locales";

function MyComponent() {
  return <h1>{Locale.MyFeature.Title}</h1>;
}
```

### Creating a Prompt Template (Mask)

1. **Add template** to `/app/masks/cn.json` or `/app/masks/en.json`
```json
{
  "avatar": "icon-emoji",
  "name": "My Template",
  "context": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    }
  ],
  "modelConfig": {
    "model": "gpt-4",
    "temperature": 0.7
  }
}
```

2. **Build masks**: `yarn mask`

3. **Output**: Generated to `/public/masks.json`

### Adding a New Component

1. **Create component file**: `/app/components/my-feature.tsx`
```typescript
import styles from "./my-feature.module.scss";

export function MyFeature() {
  return <div className={styles.container}>Content</div>;
}
```

2. **Create styles**: `/app/components/my-feature.module.scss`

3. **Add to route** (if needed) in `/app/components/home.tsx`

### Working with Environment Variables

1. **Add to `.env.template`** with documentation
2. **Access in API routes**:
```typescript
const apiKey = process.env.MY_PROVIDER_API_KEY;
```
3. **Access in client** (must be prefixed with `NEXT_PUBLIC_`):
```typescript
const publicValue = process.env.NEXT_PUBLIC_MY_VALUE;
```

### Model Context Protocol (MCP) Integration

**Enable MCP**: Set `ENABLE_MCP=true` in environment variables

**MCP files location**: `/app/mcp/`

**Server actions**: Use Next.js server actions for client management

---

## Testing Guidelines

### Test Configuration

- **Framework**: Jest 29.7.0
- **Environment**: jsdom (for React components)
- **Config**: `/jest.config.ts`
- **Setup**: `/jest.setup.ts`

### Running Tests

```bash
# Watch mode (development)
yarn test

# CI mode (one-time run)
yarn test:ci
```

### Test File Locations

All tests in `/test/` directory:
- `model-available.test.ts` - Model availability checks
- `model-provider.test.ts` - Provider validation
- `vision-model-checker.test.ts` - Vision model capabilities

### Writing Tests

```typescript
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/app/components/my-component";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

### Code Quality

**ESLint**: Next.js core web vitals + Prettier + unused-imports
```bash
yarn lint
```

**Prettier**: Configured for 80-char width, 2-space tabs
```bash
npx prettier --write "app/**/*.{ts,tsx}"
```

---

## Deployment

### Docker (Recommended)

```bash
# Pull image
docker pull yidadaa/chatgpt-next-web

# Run with environment variables
docker run -d -p 3000:3000 \
  -e OPENAI_API_KEY=sk-xxxx \
  -e CODE=your-password \
  yidadaa/chatgpt-next-web
```

**With proxy**:
```bash
docker run -d -p 3000:3000 \
  -e OPENAI_API_KEY=sk-xxxx \
  -e PROXY_URL=http://localhost:7890 \
  yidadaa/chatgpt-next-web
```

**With MCP enabled**:
```bash
docker run -d -p 3000:3000 \
  -e OPENAI_API_KEY=sk-xxxx \
  -e ENABLE_MCP=true \
  yidadaa/chatgpt-next-web
```

### Docker Compose

Two profiles available:
1. **no-proxy**: Direct connection
2. **proxy**: With PROXY_URL support

```bash
docker-compose up -d
```

### Vercel

1. Click "Deploy with Vercel" button
2. Set environment variables:
   - `OPENAI_API_KEY` (required)
   - `CODE` (access password, optional)
3. Deploy

**Important**: Fork the repository (don't just clone) to enable automatic updates.

### Cloudflare Pages

See documentation: `/docs/cloudflare-pages-en.md`

### Self-Hosted

```bash
# Install dependencies
yarn install

# Build
yarn build

# Start
yarn start
```

### Desktop App Distribution

```bash
# Build for current platform
yarn app:build

# Output location: src-tauri/target/release/
```

---

## AI Assistant Guidelines

### When Working with This Codebase

#### 1. **Always Read Before Modifying**
- Never propose changes to code you haven't read
- Use the Read tool to examine files before suggesting modifications
- Understand the existing patterns and conventions

#### 2. **Follow Existing Patterns**
- This codebase has established patterns for:
  - Multi-provider API integration
  - State management with Zustand
  - Component structure and styling
  - Internationalization
- Match the existing code style and architecture

#### 3. **Respect the Build System**
- **Masks must be built**: Run `yarn mask` after modifying `/app/masks/`
- **Three build modes**: Be aware of standalone/export/desktop differences
- **Environment variables**: Use `.env.local` for development

#### 4. **Internationalization is Critical**
- Always update ALL language files in `/app/locales/` when adding UI text
- Primary language is English (`en.ts`)
- 21 languages must be kept in sync

#### 5. **Multi-Provider Architecture**
- When adding features, consider impact on all 15+ providers
- Test with multiple providers when possible
- Use the unified `getClientApi()` interface

#### 6. **Security Considerations**
- **API keys**: Never expose in client-side code
- **Environment variables**: Server-side only unless prefixed `NEXT_PUBLIC_`
- **CORS**: Be mindful of cross-origin restrictions
- **Input validation**: Always validate user input

#### 7. **Performance Best Practices**
- Use dynamic imports for heavy components
- Leverage Next.js Edge Runtime for API routes
- Minimize bundle size (target: ~100kb first screen)
- Use streaming for real-time responses

#### 8. **Testing Requirements**
- Add tests for new utilities and core logic
- Place tests in `/test/` directory
- Run `yarn test:ci` before committing

#### 9. **Documentation**
- Update README.md for user-facing changes
- Update this CLAUDE.md for architectural changes
- Add JSDoc comments for complex functions

#### 10. **Common Pitfalls to Avoid**
- ❌ Don't bypass the mask build process
- ❌ Don't hardcode API endpoints (use environment variables)
- ❌ Don't add dependencies without checking bundle size impact
- ❌ Don't modify provider-specific code without testing all providers
- ❌ Don't skip internationalization
- ❌ Don't use `any` types in TypeScript
- ❌ Don't add inline styles (use CSS Modules)

### Search Strategies

#### Finding Provider-Related Code
```bash
# Search for provider implementations
app/client/platforms/*.ts

# Search for API handlers
app/api/*.ts

# Search for provider configuration
app/store/config.ts
```

#### Finding UI Components
```bash
# Search in components directory
app/components/*.tsx

# Search for specific feature
grep -r "feature-name" app/components/
```

#### Finding Localization Strings
```bash
# Search in locales
app/locales/*.ts
```

### Code Modification Checklist

When making changes, verify:
- [ ] Read all relevant files first
- [ ] Followed existing code patterns
- [ ] Updated all 21 language files (if UI text changed)
- [ ] Ran `yarn mask` (if masks modified)
- [ ] Tested in development mode (`yarn dev`)
- [ ] Ran linter (`yarn lint`)
- [ ] Ran tests (`yarn test:ci`)
- [ ] Updated documentation (if needed)
- [ ] Checked bundle size impact (if dependencies added)
- [ ] Tested with multiple AI providers (if API-related)

### Understanding the Request Flow

**Web App Request Flow**:
```
User Browser
  ↓
Next.js Frontend (React)
  ↓
app/components/chat.tsx
  ↓
app/client/api.ts (getClientApi)
  ↓
app/api/[provider]/route.ts (Edge Runtime)
  ↓
AI Provider API (OpenAI, Claude, etc.)
```

**Desktop App Request Flow**:
```
Tauri Desktop App
  ↓
Next.js Frontend (Static Export)
  ↓
Tauri Fetch API (Rust)
  ↓
AI Provider API (Direct)
```

---

## Important Files Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `/next.config.mjs` | Next.js configuration, webpack, build modes, rewrites |
| `/tsconfig.json` | TypeScript config, path aliases (`@/*`) |
| `/jest.config.ts` | Jest test configuration |
| `/.env.template` | Environment variables template (all available vars) |
| `/.env.local` | Local environment (gitignored, create manually) |
| `/package.json` | Dependencies and scripts |
| `/src-tauri/tauri.conf.json` | Tauri desktop app configuration |

### Entry Points

| File | Purpose |
|------|---------|
| `/app/layout.tsx` | Root HTML structure, metadata, analytics |
| `/app/page.tsx` | Root page, renders `<Home />` |
| `/app/components/home.tsx` | Main app shell with client-side routing |
| `/app/api/[provider]/[...path]/route.ts` | Dynamic API route handler |
| `/src-tauri/src/main.rs` | Tauri/Rust desktop entry point |

### Core Logic

| File | Purpose |
|------|---------|
| `/app/client/api.ts` | Unified API client interface |
| `/app/client/platforms/*.ts` | Individual provider implementations |
| `/app/store/*.ts` | Zustand state stores |
| `/app/utils/chat.ts` | Chat utility functions |
| `/app/utils/model.ts` | Model configuration utilities |

### UI Components

| File | Purpose |
|------|---------|
| `/app/components/chat.tsx` | Main chat interface |
| `/app/components/settings.tsx` | Settings panel |
| `/app/components/mask.tsx` | Prompt template management |
| `/app/components/model-config.tsx` | Model configuration UI |
| `/app/components/sidebar.tsx` | Application sidebar |

### Styling

| File | Purpose |
|------|---------|
| `/app/styles/globals.scss` | Global styles |
| `/app/styles/markdown.scss` | Markdown rendering styles |
| `/app/styles/animation.scss` | Animation utilities |

### Internationalization

| File | Purpose |
|------|---------|
| `/app/locales/en.ts` | English (primary) |
| `/app/locales/cn.ts` | Simplified Chinese |
| `/app/locales/tw.ts` | Traditional Chinese |
| `/app/locales/*.ts` | 18 other languages |

### Build & Deployment

| File | Purpose |
|------|---------|
| `/Dockerfile` | Production Docker image (multi-stage) |
| `/docker-compose.yml` | Docker compose configuration |
| `/.github/workflows/*.yml` | CI/CD workflows |
| `/scripts/*.sh` | Build and deployment scripts |

---

## Environment Variables Quick Reference

### Required
- `OPENAI_API_KEY`: OpenAI API key

### Optional Provider Keys
- `ANTHROPIC_API_KEY`: Claude API key
- `GOOGLE_API_KEY`: Gemini API key
- `DEEPSEEK_API_KEY`: DeepSeek API key
- `BAIDU_API_KEY` & `BAIDU_SECRET_KEY`: Baidu API
- `BYTEDANCE_API_KEY`: ByteDance API
- `ALIBABA_API_KEY`: Alibaba Cloud API
- `CHATGLM_API_KEY`: ChatGLM API
- `SILICONFLOW_API_KEY`: SiliconFlow API
- `AI302_API_KEY`: 302.AI API

### Feature Flags
- `CODE`: Access password (comma-separated)
- `DISABLE_GPT4`: Set to `1` to disable GPT-4
- `HIDE_USER_API_KEY`: Set to `1` to hide user API key input
- `ENABLE_BALANCE_QUERY`: Set to `1` to enable balance queries
- `DISABLE_FAST_LINK`: Set to `1` to disable URL settings parsing
- `ENABLE_MCP`: Set to `true` to enable Model Context Protocol

### Customization
- `CUSTOM_MODELS`: Add/remove models (e.g., `+llama,-gpt-3.5-turbo`)
- `DEFAULT_MODEL`: Change default model
- `VISION_MODELS`: Add vision capabilities to models
- `DEFAULT_INPUT_TEMPLATE`: Customize input preprocessing template

### URLs & Endpoints
- `BASE_URL`: Override OpenAI API base URL
- `PROXY_URL`: HTTP proxy URL
- `ANTHROPIC_URL`: Custom Claude API URL
- `GOOGLE_URL`: Custom Gemini API URL
- `WHITE_WEBDAV_ENDPOINTS`: Allowed WebDAV endpoints

---

## Recent Changes & Updates

### v2.16.1 (Current)
- Support for GPT-5 models
- Use `max_completion_tokens` parameter
- MCP (Model Context Protocol) support
- Real-time chat with WebRTC audio

### Recent Commits
- `45f7b91`: /all
- `995bef7`: Merge PR #6599 - Add support for GPT5
- `38ac502`: Add support for GPT5
- `0511808`: Use max_completion_tokens
- `42eff64`: Use max_completion_tokens

---

## Additional Resources

### Documentation
- [Deployment with Cloudflare](./docs/cloudflare-pages-en.md)
- [FAQ (English)](./docs/faq-en.md)
- [How to add translation](./docs/translation.md)
- [User Manual (Chinese)](./docs/user-manual-cn.md)

### External Links
- [NextChat Official Site](https://nextchat.club)
- [Web App Demo](https://app.nextchat.club)
- [GitHub Repository](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web)
- [Desktop App Releases](https://github.com/Yidadaa/ChatGPT-Next-Web/releases)

---

## Contact & Support

- **Enterprise Inquiries**: business@nextchat.dev
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

**End of CLAUDE.md**

*This document should be updated whenever significant architectural changes are made to the codebase.*
