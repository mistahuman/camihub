<script lang="ts">
	import { Plus, Trash2 } from 'lucide-svelte';
	import Drawer from '$lib/components/generic/Drawer.svelte';
	import { notesStore, noteTitle, notePreview, type Note } from '$lib/stores/notes.svelte';

	// Two-step delete, one row at a time: the first click arms it, the second deletes.
	let confirmingId = $state<number | null>(null);
	let confirmTimer: ReturnType<typeof setTimeout> | null = null;

	let activeEmpty = $derived(notesStore.text.length === 0);

	function disarm() {
		if (confirmTimer) clearTimeout(confirmTimer);
		confirmingId = null;
	}

	function open(id: number) {
		disarm();
		notesStore.select(id);
		notesStore.drawerOpen = false;
	}

	function create() {
		disarm();
		notesStore.create();
		notesStore.drawerOpen = false;
	}

	function remove(note: Note) {
		// An empty note goes without asking: there is nothing to lose.
		if (confirmingId !== note.id && note.text.length > 0) {
			disarm();
			confirmingId = note.id;
			confirmTimer = setTimeout(() => (confirmingId = null), 3000);
			return;
		}
		disarm();
		notesStore.remove(note.id);
	}

	function when(ts: number): string {
		const d = new Date(ts);
		return d.toDateString() === new Date().toDateString()
			? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			: d.toLocaleDateString([], { day: '2-digit', month: 'short' });
	}

	$effect(() => {
		if (!notesStore.drawerOpen) disarm();
	});
</script>

<Drawer bind:open={notesStore.drawerOpen} title="Notes" count={notesStore.notes.length}>
	{#snippet actions()}
		<button
			onclick={create}
			disabled={activeEmpty}
			title={activeEmpty ? 'The current note is still empty' : 'New note'}
			class="btn gap-1.5 preset-tonal text-xs btn-sm disabled:opacity-40"
		>
			<Plus size={14} />
			New
		</button>
	{/snippet}

	{#each notesStore.notes as note (note.id)}
		{@const active = note.id === notesStore.active.id}
		{@const preview = notePreview(note)}
		<div class="flex items-center gap-2 px-4 py-3 {active ? 'bg-primary-500/10' : ''}">
			<button
				onclick={() => open(note.id)}
				aria-current={active}
				class="min-w-0 flex-1 space-y-0.5 text-left"
			>
				<p class="truncate text-sm {active ? 'font-semibold text-primary-700-300' : ''}">
					{noteTitle(note)}
				</p>
				<p class="flex gap-2 text-xs text-surface-600-400">
					<span class="shrink-0">{when(note.updatedAt)}</span>
					{#if preview}
						<span class="truncate">{preview}</span>
					{/if}
				</p>
			</button>
			<button
				onclick={() => remove(note)}
				class="btn shrink-0 gap-1 text-xs btn-sm
					{confirmingId === note.id ? 'preset-filled-error-500' : 'hover:preset-tonal'}"
				aria-label="Delete note"
			>
				<Trash2 size={14} />
				{#if confirmingId === note.id}Sure?{/if}
			</button>
		</div>
	{/each}
</Drawer>
