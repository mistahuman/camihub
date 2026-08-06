<script lang="ts">
	import { onMount } from 'svelte';
	import { Copy, Check, History, Type } from 'lucide-svelte';
	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';
	import { historyStore } from '$lib/stores/history.svelte';
	import ToolPanel from '$lib/components/generic/ToolPanel.svelte';

	const PRESETS = ['OR', 'AND', ',', '|', 'Custom'] as const;
	type Preset = (typeof PRESETS)[number];

	const OP_MAP: Record<Preset, string> = {
		OR: ' OR ',
		AND: ' AND ',
		',': ', ',
		'|': ' | ',
		Custom: ''
	};

	let input = $state('');
	let preset = $state<Preset>('OR');
	let customOp = $state('');
	let copied = $state(false);

	let operator = $derived(preset === 'Custom' ? customOp : OP_MAP[preset]);

	// Whitespace, commas, semicolons and newlines all count as separators, so pasting
	// a spreadsheet column or a log fragment works without pre-cleaning.
	let tokens = $derived(
		input
			.split(/[\s,;]+/)
			.map((t) => t.trim())
			.filter(Boolean)
	);

	let output = $derived(tokens.length > 0 ? tokens.join(operator) : '');

	onMount(() => {
		historyStore.init();
	});

	async function copyOutput() {
		if (!output) return;
		await navigator.clipboard.writeText(output);
		historyStore.save({ id: Date.now(), output, operatorLabel: preset, tokenCount: tokens.length });
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<ToolPanel title="String">
	{#snippet icon()}
		<Type size={16} />
	{/snippet}

	{#snippet actions()}
		<button
			onclick={() => (historyStore.open = true)}
			class="btn gap-1.5 text-xs btn-sm hover:preset-tonal"
			aria-label="Recent copies"
		>
			<History size={14} />
			Recent
			{#if historyStore.entries.length > 0}
				<span class="badge preset-tonal-primary">{historyStore.entries.length}</span>
			{/if}
		</button>
	{/snippet}

	<!-- Input -->
	<div class="space-y-2">
		<label
			for="strings-input"
			class="text-xs font-semibold tracking-widest text-surface-600-400 uppercase"
		>
			Input
		</label>
		<textarea
			id="strings-input"
			bind:value={input}
			placeholder="Paste or type tokens — spaces, commas, semicolons, and newlines all work as separators…"
			rows="8"
			spellcheck="false"
			class="textarea resize-y font-mono text-sm"
		></textarea>
	</div>

	<!-- Join with -->
	<div class="space-y-2">
		<p class="text-xs font-semibold tracking-widest text-surface-600-400 uppercase">Join with</p>
		<SegmentedControl
			value={preset}
			onValueChange={(details: { value: string | null }) =>
				(preset = (details.value ?? 'OR') as Preset)}
		>
			<SegmentedControl.Control class="flex gap-1 rounded-container bg-surface-200-800 p-1">
				{#each PRESETS as p (p)}
					<SegmentedControl.Item
						value={p}
						class="flex-1 cursor-pointer rounded-base px-3 py-1.5 text-center font-mono text-sm font-medium
							transition-colors data-[state=checked]:preset-filled-primary-500"
					>
						<SegmentedControl.ItemText>{p}</SegmentedControl.ItemText>
						<SegmentedControl.ItemHiddenInput />
					</SegmentedControl.Item>
				{/each}
			</SegmentedControl.Control>
		</SegmentedControl>
		{#if preset === 'Custom'}
			<input
				type="text"
				bind:value={customOp}
				placeholder="Type a custom separator, e.g.  &&  or  UNION"
				class="input font-mono text-sm"
			/>
		{/if}
	</div>

	<!-- Output -->
	<div class="space-y-2">
		<div class="flex items-center justify-between gap-2">
			<div class="flex items-center gap-2">
				<span class="text-xs font-semibold tracking-widest text-surface-600-400 uppercase">
					Output
				</span>
				{#if tokens.length > 0}
					<span class="chip preset-tonal-primary font-mono text-xs">
						{tokens.length} token{tokens.length !== 1 ? 's' : ''}
					</span>
				{/if}
			</div>
			<button
				onclick={copyOutput}
				disabled={!output}
				class="btn gap-1.5 preset-filled-primary-500 text-xs transition-opacity btn-sm disabled:opacity-40"
			>
				{#if copied}
					<Check size={14} />
					Copied!
				{:else}
					<Copy size={14} />
					Copy
				{/if}
			</button>
		</div>
		<pre
			class="m-0 min-h-32 w-full overflow-x-auto rounded-container bg-surface-50-950 p-4 font-mono text-sm break-all whitespace-pre-wrap
				{output ? 'text-surface-950-50' : 'text-surface-400-600'}">{output ||
				'Output will appear here as you type…'}</pre>
	</div>
</ToolPanel>
