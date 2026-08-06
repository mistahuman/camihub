<script lang="ts">
	import StringForge from '$lib/components/tools/StringForge.svelte';
	import PlaylistPanel from '$lib/components/tools/PlaylistPanel.svelte';
	import NotesPanel from '$lib/components/tools/NotesPanel.svelte';
</script>

<svelte:head>
	<title>camihub</title>
</svelte:head>

<!-- Every tool lives here, on one page. No per-tool routes: the playlist keeps
	 playing while the other panels are in use. -->
<div class="container mx-auto max-w-screen-2xl px-4 py-8 xl:px-10">
	<div class="space-y-6">
		<!-- Dedication + playlist, narrower than the tools below so they stay centred -->
		<div class="mx-auto max-w-3xl space-y-3">
			<h1 class="sr-only">camihub</h1>
			<p class="text-center text-3xl font-semibold tracking-tight text-surface-900-100">
				for cami <span class="text-secondary-700-300">&lt;3</span>
			</p>
			<PlaylistPanel />
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<NotesPanel />
			<StringForge />
		</div>
	</div>
</div>
