<script lang="ts">
	import { onMount } from 'svelte';
	import { ListMusic, X } from 'lucide-svelte';
	import { SPOTIFY_PLAYLIST_ID } from '$lib/config';
	import { playlistStore } from '$lib/stores/playlist.svelte';

	// The share link carries a `?si=…` tracking param; keep only the id itself.
	const playlistId = SPOTIFY_PLAYLIST_ID.split('?')[0];

	// Plain embed: no Spotify API, no OAuth, no token — it stays a static site.
	// height 152 is Spotify's compact player, which is what makes the dock small.
	const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;

	onMount(() => playlistStore.init());
</script>

<!-- Floating dock, bottom-left so it stays clear of the toast overlay on the right.
	 Never unmounted once opened: hiding is `hidden`, not a destroy, or the music stops. -->
{#if playlistStore.mounted}
	<div
		class="fixed bottom-4 left-4 z-40 w-[calc(100vw-2rem)] max-w-sm"
		class:hidden={!playlistStore.open}
	>
		<section class="overflow-hidden card preset-filled-surface-100-900 shadow-xl">
			<header
				class="flex items-center justify-between gap-2 border-b border-surface-200-800 px-3 py-2"
			>
				<div class="flex items-center gap-2">
					<span class="flex text-primary-700-300"><ListMusic size={16} /></span>
					<span class="text-xs font-semibold tracking-widest text-surface-700-300 uppercase">
						Playlist
					</span>
				</div>
				<button
					onclick={() => playlistStore.toggle()}
					aria-label="Hide playlist"
					class="btn-icon btn-icon-sm hover:preset-tonal"
				>
					<X size={16} />
				</button>
			</header>

			<div class="p-3">
				{#if playlistId}
					<iframe
						title="Spotify playlist"
						src={embedUrl}
						class="w-full rounded-container border-0"
						height="152"
						loading="lazy"
						allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
					></iframe>
				{:else}
					<div
						class="flex min-h-[152px] flex-col items-center justify-center gap-2 rounded-container border border-dashed border-surface-300-700 p-4 text-center"
					>
						<p class="text-sm text-surface-600-400">No playlist set yet.</p>
						<p class="text-xs text-surface-500">
							Put the playlist id in <code class="code">SPOTIFY_PLAYLIST_ID</code>
							(<code class="code">src/lib/config.ts</code>).
						</p>
					</div>
				{/if}
			</div>
		</section>
	</div>
{/if}
