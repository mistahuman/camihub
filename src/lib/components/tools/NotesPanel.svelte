<script lang="ts">
	import { onMount } from 'svelte';
	import { Trash2, NotebookPen } from 'lucide-svelte';
	import ToolPanel from '$lib/components/generic/ToolPanel.svelte';
	import { notesStore } from '$lib/stores/notes.svelte';

	let confirmingClear = $state(false);
	let confirmTimer: ReturnType<typeof setTimeout> | null = null;

	let charCount = $derived(notesStore.text.length);
	let savedLabel = $derived(
		notesStore.savedAt
			? new Date(notesStore.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			: null
	);

	onMount(() => {
		notesStore.init();
		return () => {
			if (confirmTimer) clearTimeout(confirmTimer);
		};
	});

	function clearNotes() {
		if (!confirmingClear) {
			confirmingClear = true;
			confirmTimer = setTimeout(() => (confirmingClear = false), 3000);
			return;
		}
		if (confirmTimer) clearTimeout(confirmTimer);
		confirmingClear = false;
		notesStore.clear();
	}
</script>

<ToolPanel title="Notes">
	{#snippet icon()}
		<NotebookPen size={16} />
	{/snippet}

	{#snippet actions()}
		{#if savedLabel}
			<span class="text-xs text-surface-500">saved {savedLabel}</span>
		{/if}
		<button
			onclick={clearNotes}
			disabled={charCount === 0}
			class="btn gap-1.5 text-xs btn-sm disabled:opacity-40
				{confirmingClear ? 'preset-filled-error-500' : 'hover:preset-tonal'}"
		>
			<Trash2 size={14} />
			{confirmingClear ? 'Sure?' : 'Clear'}
		</button>
	{/snippet}

	<textarea
		bind:value={notesStore.text}
		placeholder="Write anything here — it saves itself…"
		rows="16"
		aria-label="Notes"
		class="textarea min-h-[26rem] flex-1 resize-y text-sm"
	></textarea>
</ToolPanel>
