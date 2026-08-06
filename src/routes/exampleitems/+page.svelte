<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Card from '$lib/components/generic/Card.svelte';
	import { exampleItemsApi, type ExampleItem } from '$lib/api/client';
	import { uiStore } from '$lib/stores/ui.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let createForm = $state({ title: '', value: 0, code: '', description: '' });
	let submitting = $state(false);

	let editingId = $state<string | null>(null);
	let editForm = $state({ title: '', value: 0, code: '', description: '' });

	function startEdit(item: ExampleItem) {
		editingId = item.id;
		editForm = {
			title: item.title,
			value: item.value,
			code: item.code,
			description: item.description ?? ''
		};
	}

	function cancelEdit() {
		editingId = null;
	}

	async function create() {
		submitting = true;
		try {
			await exampleItemsApi.create(createForm);
			createForm = { title: '', value: 0, code: '', description: '' };
			await invalidateAll();
			uiStore.toast('Item created', 'success');
		} catch (e) {
			uiStore.toast(e instanceof Error ? e.message : 'Failed to create item', 'error');
		} finally {
			submitting = false;
		}
	}

	async function update() {
		if (!editingId) return;
		submitting = true;
		try {
			await exampleItemsApi.update(editingId, editForm);
			editingId = null;
			await invalidateAll();
			uiStore.toast('Item updated', 'success');
		} catch (e) {
			uiStore.toast(e instanceof Error ? e.message : 'Failed to update item', 'error');
		} finally {
			submitting = false;
		}
	}

	async function remove(id: string) {
		try {
			await exampleItemsApi.delete(id);
			await invalidateAll();
			uiStore.toast('Item deleted', 'success');
		} catch (e) {
			uiStore.toast(e instanceof Error ? e.message : 'Failed to delete item', 'error');
		}
	}
</script>

<svelte:head>
	<title>ExampleItems — sveltekit-skeleton-starter</title>
</svelte:head>

<div class="container mx-auto max-w-3xl space-y-12 px-4 py-16">
	<!-- Create form -->
	<section class="space-y-4">
		<h2 class="h3 font-semibold">New item</h2>
		<form
			onsubmit={(e) => {
				e.preventDefault();
				create();
			}}
			class="space-y-4 card border-[1px] border-surface-200-800 preset-filled-surface-100-900 p-6"
		>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<label class="space-y-1">
					<span class="text-sm font-medium">Title *</span>
					<input bind:value={createForm.title} required class="input" placeholder="Lorem ipsum" />
				</label>
				<label class="space-y-1">
					<span class="text-sm font-medium">Code *</span>
					<input bind:value={createForm.code} required class="input" placeholder="LIPS01" />
				</label>
				<label class="space-y-1">
					<span class="text-sm font-medium">Value *</span>
					<input
						bind:value={createForm.value}
						required
						type="number"
						class="input"
						placeholder="100"
					/>
				</label>
				<label class="space-y-1">
					<span class="text-sm font-medium">Description</span>
					<input
						bind:value={createForm.description}
						class="input"
						placeholder="Optional description"
					/>
				</label>
			</div>
			<button type="submit" disabled={submitting} class="btn preset-filled-primary-500">
				{submitting ? 'Creating…' : 'Create'}
			</button>
		</form>
	</section>

	<!-- List -->
	<section class="space-y-4">
		<h2 class="h3 font-semibold">Items</h2>

		{#if data.apiError}
			<div class="space-y-1 card border-[1px] border-warning-500 preset-tonal-warning p-4">
				<p class="font-medium">Backend unreachable</p>
				<p class="text-sm">
					Set <code class="code">VITE_API_URL</code> to a running backend to use this page. Pair this
					starter with one of the backend templates, or drop this route if you don't need an API.
				</p>
				<p class="text-xs text-surface-500">{data.apiError}</p>
			</div>
		{:else if data.items.length === 0}
			<p class="text-surface-500">No items yet. Create one above.</p>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each data.items as item (item.id)}
					<Card title={item.title}>
						{#if editingId === item.id}
							<!-- Inline edit form -->
							<form
								onsubmit={(e) => {
									e.preventDefault();
									update();
								}}
								class="space-y-3 text-sm"
							>
								<label class="space-y-1">
									<span class="font-medium">Title *</span>
									<input bind:value={editForm.title} required class="input-sm input" />
								</label>
								<label class="space-y-1">
									<span class="font-medium">Code *</span>
									<input bind:value={editForm.code} required class="input-sm input" />
								</label>
								<label class="space-y-1">
									<span class="font-medium">Value *</span>
									<input
										bind:value={editForm.value}
										required
										type="number"
										class="input-sm input"
									/>
								</label>
								<label class="space-y-1">
									<span class="font-medium">Description</span>
									<input bind:value={editForm.description} class="input-sm input" />
								</label>
								<div class="flex gap-2 pt-1">
									<button
										type="submit"
										disabled={submitting}
										class="btn flex-1 preset-filled-primary-500 btn-sm"
									>
										{submitting ? 'Saving…' : 'Save'}
									</button>
									<button type="button" onclick={cancelEdit} class="btn flex-1 preset-tonal btn-sm">
										Cancel
									</button>
								</div>
							</form>
						{:else}
							<!-- Read view -->
							<div class="space-y-2 text-sm">
								<p><span class="font-medium">Code:</span> {item.code}</p>
								<p><span class="font-medium">Value:</span> {item.value}</p>
								{#if item.description}
									<p class="text-surface-500">{item.description}</p>
								{/if}
								<div class="flex gap-2 pt-1">
									<button onclick={() => startEdit(item)} class="btn flex-1 preset-tonal btn-sm">
										Edit
									</button>
									<button
										onclick={() => remove(item.id)}
										class="btn flex-1 preset-tonal-error btn-sm"
									>
										Delete
									</button>
								</div>
							</div>
						{/if}
					</Card>
				{/each}
			</div>
		{/if}
	</section>
</div>
