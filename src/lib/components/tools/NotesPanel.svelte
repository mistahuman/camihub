<script lang="ts">
	import { onMount } from 'svelte';
	import { Trash2, NotebookPen, Plus } from 'lucide-svelte';
	import ToolPanel from '$lib/components/generic/ToolPanel.svelte';
	import { notesStore, noteTitle } from '$lib/stores/notes.svelte';

	let confirmingDelete = $state(false);
	let confirmTimer: ReturnType<typeof setTimeout> | null = null;

	let isEmpty = $derived(notesStore.text.length === 0);
	let onlyNote = $derived(notesStore.notes.length === 1);
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

	function resetConfirm() {
		if (confirmTimer) clearTimeout(confirmTimer);
		confirmingDelete = false;
	}

	function select(id: number) {
		resetConfirm();
		notesStore.select(id);
	}

	function deleteNote() {
		// An empty note goes without asking: there is nothing to lose.
		if (!confirmingDelete && !isEmpty) {
			confirmingDelete = true;
			confirmTimer = setTimeout(() => (confirmingDelete = false), 3000);
			return;
		}
		resetConfirm();
		notesStore.remove();
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
			onclick={() => {
				resetConfirm();
				notesStore.create();
			}}
			disabled={isEmpty}
			title={isEmpty ? 'This note is still empty' : 'New note'}
			class="btn gap-1.5 text-xs btn-sm hover:preset-tonal disabled:opacity-40"
		>
			<Plus size={14} />
			New
		</button>
		<button
			onclick={deleteNote}
			disabled={onlyNote && isEmpty}
			class="btn gap-1.5 text-xs btn-sm disabled:opacity-40
				{confirmingDelete ? 'preset-filled-error-500' : 'hover:preset-tonal'}"
		>
			<Trash2 size={14} />
			{confirmingDelete ? 'Sure?' : onlyNote ? 'Clear' : 'Delete'}
		</button>
	{/snippet}

	{#if !onlyNote}
		<div class="flex flex-wrap gap-1.5" role="tablist" aria-label="Notes">
			{#each notesStore.notes as note (note.id)}
				{@const active = note.id === notesStore.active.id}
				<button
					role="tab"
					aria-selected={active}
					onclick={() => select(note.id)}
					title={noteTitle(note)}
					class="chip max-w-48 text-xs {active
						? 'preset-filled-primary-500'
						: 'preset-tonal hover:preset-tonal-primary'}"
				>
					<span class="truncate">{noteTitle(note)}</span>
				</button>
			{/each}
		</div>
	{/if}

	{#key notesStore.active.id}
		<textarea
			bind:value={notesStore.text}
			placeholder="Write anything here — it saves itself…"
			rows="16"
			aria-label="Note"
			class="textarea min-h-64 flex-1 resize-y text-sm"
		></textarea>
	{/key}
</ToolPanel>
