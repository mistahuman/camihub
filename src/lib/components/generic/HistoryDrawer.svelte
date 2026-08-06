<script lang="ts">
	import { X, Copy, Check } from 'lucide-svelte';
	import { historyStore } from '$lib/stores/history.svelte';

	let copiedId = $state<number | null>(null);

	async function copyEntry(entry: { id: number; output: string }) {
		await navigator.clipboard.writeText(entry.output);
		copiedId = entry.id;
		setTimeout(() => (copiedId = null), 2000);
	}
</script>

<!-- Backdrop -->
{#if historyStore.open}
	<div
		class="fixed inset-0 z-40 bg-black/40"
		role="presentation"
		onclick={() => (historyStore.open = false)}
	></div>
{/if}

<!-- Panel -->
<div
	class="fixed top-0 right-0 bottom-0 z-50 h-screen w-[360px] max-w-full overflow-y-auto preset-filled-surface-100-900 shadow-xl transition-transform duration-200"
	class:translate-x-full={!historyStore.open}
	class:translate-x-0={historyStore.open}
>
	<header class="flex items-center justify-between border-b border-surface-200-800 px-4 py-3">
		<div class="flex items-center gap-2">
			<span class="font-medium">History</span>
			{#if historyStore.entries.length > 0}
				<span class="badge preset-tonal-primary text-xs">{historyStore.entries.length}</span>
			{/if}
		</div>
		<div class="flex items-center gap-1">
			{#if historyStore.entries.length > 0}
				<button onclick={() => historyStore.clear()} class="btn preset-tonal text-xs btn-sm">
					Clear
				</button>
			{/if}
			<button class="btn-icon" onclick={() => (historyStore.open = false)} aria-label="Close">
				<X size={18} />
			</button>
		</div>
	</header>

	<div class="divide-y divide-surface-200-800">
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
	</div>
</div>
