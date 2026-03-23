# ECE Portfolio — System Architecture

## Agent Domain Map
| Agent | Directory | Branch | Responsibility |
|-------|-----------|--------|----------------|
| Antigravity | portfolio-root | main | Architecture, DevOps, WebGL boilerplate |
| Cursor | portfolio-ui | ui-branch | React components, Tailwind, Framer Motion |
| Windsurf | portfolio-logic | logic-branch | Bug tracing, memory leaks, performance |
| Claude Code | portfolio-backend | backend-branch | Scripts, automation, commit synthesis |

## Directory Ownership
- `/src/core` → Claude's domain. Pure TypeScript. No UI imports allowed.
- `/src/components` → Cursor's domain. React + Tailwind + Framer Motion. No WebGL imports.
- `/src/glsl` → Antigravity's domain. Three.js + R3F + raw .glsl shaders. No DOM imports.
- `/scripts` → Claude Code's domain. Node.js automation scripts only.
- `/docs` → Shared read/write by all agents.

## Dependency Graph
- `src/components` consumes types from `src/core`
- `src/glsl` consumes types from `src/core`
- `src/components` consumes Zustand store from `src/core/store`
- `src/glsl` consumes Zustand store from `src/core/store`
- Neither `src/components` nor `src/glsl` import from each other directly

## Tech Stack
- Framework: Next.js 14+ App Router
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v3 + CSS Modules
- 3D/WebGL: Three.js + React Three Fiber + Drei
- Animation: Framer Motion (spring physics only)
- State: Zustand (WebGL↔DOM bridge)
- Content: MDX
- Hosting: Vercel Edge Network
