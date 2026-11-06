<script lang="ts">
	import { onMount } from 'svelte';
	import { Trash2, NotebookPen, Plus, History } from 'lucide-svelte';
	import ToolPanel from '$lib/components/generic/ToolPanel.svelte';
	import { notesStore } from '$lib/stores/notes.svelte';

	let textarea = $state<HTMLTextAreaElement | null>(null);
	let hasSelection = $state(false);
	let confirmingDelete = $state(false);
	let confirmTimer: ReturnType<typeof setTimeout> | null = null;

	let isEmpty = $derived(notesStore.text.length === 0);
	let onlyNote = $derived(notesStore.notes.length === 1);
	let savedLabel = $derived(
		notesStore.savedAt
			? new Date(notesStore.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			: null
	);

	// A new textarea is mounted per note, with no selection in it.
	$effect(() => {
		void notesStore.active.id;
		hasSelection = false;
	});

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

	// Tracks whether the textarea holds a selection. Leaving the textarea (to click a button)
	// keeps its selection, so this deliberately does not reset on blur.
	function trackSelection() {
		hasSelection = !!textarea && textarea.selectionStart !== textarea.selectionEnd;
	}

	// Changes the case of the selected text only — never the whole note by surprise.
	// The text goes in through execCommand('insertText') rather than through the store, because
	// that is the only way to keep it on the browser's undo stack: Ctrl+Z still brings it back.
	function changeCase(fn: (s: string) => string) {
		const el = textarea;
		if (!el) return;
		const start = el.selectionStart;
		const end = el.selectionEnd;
		if (start === end) return;
		const before = el.value.slice(start, end);
		const after = fn(before);
		if (after === before) return;

		el.focus();
		el.setSelectionRange(start, end);
		if (!document.execCommand('insertText', false, after)) {
			// No execCommand support: change the text directly, losing undo for this one step.
			notesStore.text = el.value.slice(0, start) + after + el.value.slice(end);
		}
		// Keep it selected, so the other case is one click away.
		el.setSelectionRange(start, start + after.length);
		trackSelection();
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
		<button
			onclick={() => (notesStore.drawerOpen = true)}
			class="btn gap-1.5 text-xs btn-sm hover:preset-tonal"
			aria-label="All notes"
		>
			<History size={14} />
			All
			{#if !onlyNote}
				<span class="badge preset-tonal-primary">{notesStore.notes.length}</span>
			{/if}
		</button>
	{/snippet}

	{#key notesStore.active.id}
		<textarea
			bind:this={textarea}
			bind:value={notesStore.text}
			onselect={trackSelection}
			onkeyup={trackSelection}
			onmouseup={trackSelection}
			oninput={trackSelection}
			placeholder="Write anything here — it saves itself…"
			rows="16"
			aria-label="Note"
			class="textarea min-h-64 flex-1 resize-y text-sm"
		></textarea>
	{/key}

	<div class="flex items-center justify-end gap-1.5">
		<span class="mr-auto text-xs text-surface-500">Case of the selected text</span>
		<button
			onclick={() => changeCase((s) => s.toUpperCase())}
			disabled={!hasSelection}
			title={hasSelection ? 'UPPERCASE' : 'Select some text first'}
			class="btn preset-tonal text-xs btn-sm disabled:opacity-40"
		>
			AA
		</button>
		<button
			onclick={() => changeCase((s) => s.toLowerCase())}
			disabled={!hasSelection}
			title={hasSelection ? 'lowercase' : 'Select some text first'}
			class="btn preset-tonal text-xs btn-sm disabled:opacity-40"
		>
			aa
		</button>
	</div>
</ToolPanel>
