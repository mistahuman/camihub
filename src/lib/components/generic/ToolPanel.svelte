<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		icon,
		actions,
		children
	}: {
		title: string;
		icon?: Snippet;
		actions?: Snippet;
		children: Snippet;
	} = $props();
</script>

<section class="flex flex-col overflow-hidden card preset-filled-surface-100-900">
	<header class="flex items-center justify-between gap-2 border-b border-surface-200-800 px-4 py-3">
		<div class="flex items-center gap-2">
			{#if icon}
				<span class="flex text-primary-700-300">{@render icon()}</span>
			{/if}
			<span class="text-xs font-semibold tracking-widest text-surface-700-300 uppercase">
				{title}
			</span>
		</div>
		<div class="flex items-center gap-1.5">
			{@render actions?.()}
		</div>
	</header>
	<div class="flex min-h-0 flex-1 flex-col gap-4 p-4">
		{@render children()}
	</div>
</section>
