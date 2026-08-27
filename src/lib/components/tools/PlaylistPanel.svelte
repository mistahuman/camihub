<script lang="ts">
	import { onMount } from 'svelte';
	import { ListMusic, ChevronUp } from 'lucide-svelte';
	import ToolPanel from '$lib/components/generic/ToolPanel.svelte';
	import { SPOTIFY_PLAYLIST_ID } from '$lib/config';

	// The share link carries a `?si=…` tracking param; keep only the id itself.
	const playlistId = SPOTIFY_PLAYLIST_ID.split('?')[0];

	// Plain embed: no Spotify API, no OAuth, no token — it stays a static site.
	// height 152 is Spotify's compact player, so this sits as a strip above the two columns.
	const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;

	const STORAGE_KEY = 'camihub:playlist-open';

	// Hidden by default: the playlist is no longer the centrepiece, it is opt-in.
	let open = $state(false);
	// Once revealed the iframe stays mounted for the rest of the session — collapsing
	// only hides it, so closing the strip does not stop the music.
	let mounted = $state(false);

	onMount(() => {
		try {
			if (localStorage.getItem(STORAGE_KEY) === 'true') {
				open = true;
				mounted = true;
			}
		} catch {
			// private mode / storage disabled — just stay closed
		}
	});

	function toggle() {
		open = !open;
		if (open) mounted = true;
		try {
			localStorage.setItem(STORAGE_KEY, String(open));
		} catch {
			// nothing to persist to, the toggle still works for this session
		}
	}
</script>

<div class="space-y-3">
	<div class="flex justify-center">
		<button
			onclick={toggle}
			aria-expanded={open}
			class="btn gap-1.5 text-xs text-surface-600-400 btn-sm hover:preset-tonal"
		>
			<ListMusic size={14} />
			{open ? 'Hide playlist' : 'Playlist'}
			<ChevronUp size={14} class="transition-transform {open ? '' : 'rotate-180'}" />
		</button>
	</div>

	{#if mounted}
		<div class:hidden={!open}>
			<ToolPanel title="Playlist">
				{#snippet icon()}
					<ListMusic size={16} />
				{/snippet}

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
						class="flex min-h-[152px] flex-col items-center justify-center gap-2 rounded-container border border-dashed border-surface-300-700 p-6 text-center"
					>
						<p class="text-sm text-surface-600-400">No playlist set yet.</p>
						<p class="text-xs text-surface-500">
							Put the playlist id in <code class="code">SPOTIFY_PLAYLIST_ID</code>
							(<code class="code">src/lib/config.ts</code>).
						</p>
					</div>
				{/if}
			</ToolPanel>
		</div>
	{/if}
</div>
