// Theme configuration
// camihub ships a single theme, `cami-theme` (src/lib/styles/cami-theme.css), so the picker
// is off. Light/dark is a separate axis (`data-mode`) and stays switchable in the header.
//
// NOTE: src/app.html restores the stored mode before paint to avoid a flash, and being
// static HTML it cannot import this module. It carries its own THEME_PICKER constant that
// must be kept in sync with the one below.
export const THEME_PICKER = false;
export const DEFAULT_THEME = 'cami-theme';
