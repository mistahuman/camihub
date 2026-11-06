<script lang="ts">
	import { Copy, Check } from 'lucide-svelte';
	import Drawer from '$lib/components/generic/Drawer.svelte';
	import { historyStore } from '$lib/stores/history.svelte';

	let copiedId = $state<number | null>(null);

	async function copyEntry(entry: { id: number; output: string }) {
		await navigator.clipboard.writeText(entry.output);
		copiedId = entry.id;
		setTimeout(() => (copiedId = null), 2000);
	}
</script>

<Drawer bind:open={historyStore.open} title="History" count={historyStore.entries.length}>
	{#snippet actions()}
		{#if historyStore.entries.length > 0}
			<button onclick={() => historyStore.clear()} class="btn preset-tonal text-xs btn-sm">
				Clear
			</button>
		{/if}
	{/snippet}

	{#if historyStore.entries.length === 0}
		<p class="px-4 py-8 text-center text-sm text-surface-600-400">No history yet.</p>
	{:else}
		{#each historyStore.entries as entry (entry.id)}
			<div class="flex items-center gap-3 px-4 py-3">
				<div class="min-w-0 flex-1 space-y-1">
					<p class="truncate font-mono text-sm">{entry.output}</p>
					<div class="flex items-center gap-1.5">
						<span class="chip preset-tonal-primary font-mono text-xs">{entry.operatorLabel}</span>
						<span class="chip preset-outlined-surface-200-800 text-xs">
							{entry.tokenCount} token{entry.tokenCount !== 1 ? 's' : ''}
						</span>
					</div>
				</div>
				<button
					onclick={() => copyEntry(entry)}
					class="btn-icon shrink-0 preset-tonal btn-sm"
					aria-label="Copy"
				>
					{#if copiedId === entry.id}
						<Check size={14} />
					{:else}
						<Copy size={14} />
					{/if}
				</button>
			</div>
		{/each}
	{/if}
</Drawer>
