// Theme configuration
// camihub ships a single theme, `cami-theme` (src/lib/styles/cami-theme.css), so the picker
// is off. Light/dark is a separate axis (`data-mode`) and stays switchable in the header.
//
// NOTE: src/app.html restores the stored mode before paint to avoid a flash, and being
// static HTML it cannot import this module. It carries its own THEME_PICKER constant that
// must be kept in sync with the one below.
export const THEME_PICKER = false;
export const DEFAULT_THEME = 'cami-theme';

// Spotify playlist shown in the Playlist panel.
// Take the id from the share link: open.spotify.com/playlist/<THIS PART>?si=…
// Empty means the panel renders a placeholder instead of the embed.
export const SPOTIFY_PLAYLIST_ID = '0zmQ529y3FrHTOllHgrOuI?si=90c9857413f54aec';
