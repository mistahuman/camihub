# camihub — Claude Code context

Single-page hub of small browser tools, built for Camilla. No backend, no upload:
everything is computed client-side and anything worth keeping lives in `localStorage`.

Forked from `sveltekit-skeleton-starter` on 2026-08-06.

## The tools

All three live on `/` — there is deliberately **no per-tool route**. The point of the
project is having everything reachable without navigating.

| Tool     | What it is                                                                                      | State                                           |
| -------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| String   | The token joiner ported from `forge-string`: paste tokens, pick a separator, copy `a OR b OR c` | ported, `localStorage` copy history             |
| Playlist | Camilla's Spotify playlist, embedded as an `<iframe>`                                           | embed only — no Spotify API, no OAuth, no token |
| Notes    | Scratchpad / whiteboard                                                                         | text persisted in `localStorage`                |

Input parsing for String is inherited from `forge-string`: whitespace, commas,
semicolons and newlines all count as separators, so pasting a spreadsheet column
works without pre-cleaning.

## Layout

`Playlist` is a full-width strip above two columns, `Notes` left and `String` right,
stacking into one column below `lg`. The strip uses Spotify's compact player (`height=152`)
so it costs little vertical space.

The two columns are left to grid's default stretch — no `items-start` — and the notes
`textarea` is `flex-1`, so `Notes` matches whatever height `String` happens to need instead of
being pinned to a row count that goes stale the moment `String` grows (it does, when the
Custom separator input appears).

Do not turn the panels into internal tabs: the Spotify iframe has to stay mounted or the
music stops every time she switches tool. That constraint is the reason for this layout.

## Theming

Single theme, `cami-theme`, in `src/lib/styles/cami-theme.css`, applied with
`data-theme="cami-theme"` on `<html>`. Light/dark is a **separate axis** (`data-mode`), toggled
in the header and persisted in `localStorage`.

What makes it its own thing rather than a recoloured starter: a cyan/turquoise primary
(hue ~201) against a rosa secondary (hue ~13), surfaces tinted on the same side of the wheel
(hue 225) and going navy — not black — in the dark, and restrained corners kept close
together so nothing looks out of family
(`--radius-base: 0.375rem`, `--radius-container: 0.5rem`). The body mesh gradient in
`routes/layout.css` washes primary into secondary to match.

**Keep `primary-500` dark enough to survive light mode.** It started at `L 79%`, which on the
light surfaces was invisible — the theme read as if it had never been applied. It now sits at
`L 59%`. For the same reason the light end of the surface ramp is stepped, not flat:
page `surface-50` 99.2% → card `surface-100` 94.5% → border `surface-200` 88%, so panels
actually separate from the background.

**The typeface is self-hosted on purpose.** `@fontsource-variable/plus-jakarta-sans` is
imported in `routes/+layout.svelte`. An earlier version used a CSS stack of rounded system
fonts (`ui-rounded`, `SF Pro Rounded`, Quicksand…); none of those exist on Linux, so the whole
theme silently fell back to `system-ui` and looked unstyled. Do not go back to a
system-font stack — if the font changes, ship it through fontsource.

`THEME_PICKER` in `src/lib/config.ts` is `false` and `src/app.html` carries a copy of that
constant for the pre-paint restore — change one, change the other. To restyle, regenerate the
palette with the [Skeleton theme generator](https://themes.skeleton.dev) and paste it over
`cami-theme.css`, keeping the `[data-theme='cami-theme']` selector on the first line.

## Logo

A stylized elephant, hand-drawn as SVG in `lib/components/icons/Logo.svelte` and duplicated in
`static/favicon.svg` (the favicon is static, so it carries the primary colour hard-coded as
`#008e96` — when the palette moves, convert the new `primary-500` and update it too). It is drawn with the same stroke weight and round caps as the lucide
icons in the panel headers, which is what makes it sit with them instead of on top of them.

## Use Skeleton's own primitives

Panels are `card preset-filled-surface-100-900`, fields are `.input` / `.textarea`, the
join-operator switch is `SegmentedControl` from `@skeletonlabs/skeleton-svelte`, and colours
go through the dual-tone utilities (`bg-surface-50-950`, `text-surface-700-300`) rather than
`bg-surface-50 dark:bg-surface-900` pairs. `.input` picks up `--radius-base` and `.textarea`
`--radius-container`, so the corners stay coherent for free — hand-rolled borders and
backgrounds drift away from the theme and are what made an earlier pass look off.

## Relationship with forge-string

`forge-string` stays a product of its own — it exists because Camilla needs that one
feature at work and wants to present it. camihub **re-uses** the same logic, it does not
replace it. When the joining logic changes, decide explicitly which of the two is the
source and port across; they came from the same starter, so the code moves as-is.

## Deployment

| Context             | Adapter          | Output                        |
| ------------------- | ---------------- | ----------------------------- |
| Default             | `adapter-static` | static files for GitHub Pages |
| `DOCKER_BUILD=true` | `adapter-node`   | Node server on port 3000      |

The base path comes from `GITHUB_REPOSITORY` in `svelte.config.js`, so it resolves to
`/camihub` on Pages and `''` locally. Never hardcode a leading `/` in links.

## Commands

```bash
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview the build
npm run check     # svelte-check
npm run format    # Prettier write
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
