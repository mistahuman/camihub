# sveltekit-skeleton-starter — Claude Code context

Base template for SvelteKit + Skeleton web apps. Downstream: `mistatools`,
`svelte-kitty-translate`, `forge-string`.

## Commands

```bash
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview the build
npm run check     # svelte-check
npm run check:watch
npm run format    # Prettier write
```

## Dual adapter strategy

The build target switches on the `DOCKER_BUILD` environment variable:

| Context | Adapter | Output |
|---|---|---|
| Default | `adapter-static` | static files for GitHub Pages |
| `DOCKER_BUILD=true` | `adapter-node` | Node server on port 3000 |

GitHub Pages deploys automatically via the included Actions workflow on push to
`main`. Inside
[fullstack-webapp-starter](https://github.com/mistahuman/fullstack-webapp-starter),
`ui/Dockerfile` sets `DOCKER_BUILD=true` at build time to get the Node server instead.

## Recreating this template from scratch

```sh
npx sv@0.15.2 create --template minimal --types ts \
  --add prettier eslint tailwindcss="plugins:typography,forms" \
  sveltekit-adapter="adapter:auto" mcp="ide:claude-code+setup:remote" \
  --install npm sveltekit-skeleton-starter
```

---

## Project Configuration

- **Language**: TypeScript
- **Package Manager**: npm
- **Add-ons**: prettier, eslint, tailwindcss, sveltekit-adapter, mcp

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
