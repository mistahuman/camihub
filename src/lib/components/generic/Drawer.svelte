<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';

	// Right-hand slide-over shell shared by every tool drawer, so they all look and close alike.
	let {
		open = $bindable(),
		title,
		count = 0,
		actions,
		children
	}: {
		open: boolean;
		title: string;
		count?: number;
		actions?: Snippet;
		children: Snippet;
	} = $props();
</script>

<svelte:window onkeydown={(e) => open && e.key === 'Escape' && (open = false)} />

<!-- Backdrop -->
{#if open}
	<div
		class="fixed inset-0 z-40 bg-black/40"
		role="presentation"
		onclick={() => (open = false)}
	></div>
{/if}

<!-- Panel -->
<div
	class="fixed top-0 right-0 bottom-0 z-50 h-screen w-[360px] max-w-full overflow-y-auto preset-filled-surface-100-900 shadow-xl transition-transform duration-200"
	class:translate-x-full={!open}
	class:translate-x-0={open}
	inert={!open}
>
	<header class="flex items-center justify-between border-b border-surface-200-800 px-4 py-3">
		<div class="flex items-center gap-2">
			<span class="font-medium">{title}</span>
			{#if count > 0}
				<span class="badge preset-tonal-primary text-xs">{count}</span>
			{/if}
		</div>
		<div class="flex items-center gap-1">
			{@render actions?.()}
			<button class="btn-icon" onclick={() => (open = false)} aria-label="Close">
				<X size={18} />
			</button>
		</div>
	</header>

	<div class="divide-y divide-surface-200-800">
		{@render children()}
	</div>
</div>
