# sveltekit-skeleton-starter

Starter for web apps built with SvelteKit and Skeleton UI. Builds static for
GitHub Pages by default, or as a Node server when used inside
[fullstack-webapp-starter](https://github.com/mistahuman/fullstack-webapp-starter).

## Stack

SvelteKit · Svelte 5 (runes) · Skeleton 5 · Tailwind 4 · TypeScript · Prettier

## Run

```bash
npm install
cp env.sample .env
npm run dev
```

## Configuration

| Var | What |
|---|---|
| `VITE_API_URL` | Backend base URL |
| `DOCKER_BUILD` | Set to `true` to build with `adapter-node` instead of `adapter-static` |
