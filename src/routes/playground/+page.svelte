<script lang="ts">
	import { uiStore } from '$lib/stores/ui.svelte';

	let inputText = $state('');
	let checked = $state(false);
	let rangeValue = $state(50);
</script>

<svelte:head>
	<title>Playground — sveltekit-skeleton-starter</title>
</svelte:head>

<div class="container mx-auto max-w-3xl space-y-12 px-4 py-16">
	<h1 class="h2 font-bold">Component Playground</h1>

	<!-- Buttons -->
	<section class="space-y-4">
		<h2 class="h4 font-semibold">Buttons</h2>
		<div class="flex flex-wrap gap-3">
			<button class="btn preset-filled-primary-500">Primary</button>
			<button class="btn preset-filled-secondary-500">Secondary</button>
			<button class="btn preset-filled-success-500">Success</button>
			<button class="btn preset-filled-warning-500">Warning</button>
			<button class="btn preset-filled-error-500">Error</button>
		</div>
		<div class="flex flex-wrap gap-3">
			<button class="btn preset-tonal-primary">Tonal Primary</button>
			<button class="btn preset-tonal-secondary">Tonal Secondary</button>
			<button class="btn preset-tonal-success">Tonal Success</button>
			<button class="btn preset-tonal-error">Tonal Error</button>
		</div>
		<div class="flex flex-wrap gap-3">
			<button class="btn preset-outlined-primary-500">Outlined</button>
			<button class="btn preset-tonal" disabled>Disabled</button>
			<button class="btn btn-sm preset-filled-primary-500">Small</button>
			<button class="btn btn-lg preset-filled-primary-500">Large</button>
		</div>
	</section>

	<!-- Badges -->
	<section class="space-y-4">
		<h2 class="h4 font-semibold">Badges</h2>
		<div class="flex flex-wrap gap-3">
			<span class="badge preset-filled-primary-500">Primary</span>
			<span class="badge preset-filled-success-500">Success</span>
			<span class="badge preset-filled-warning-500">Warning</span>
			<span class="badge preset-filled-error-500">Error</span>
			<span class="badge preset-tonal-primary">Tonal</span>
			<span class="badge preset-outlined-primary-500">Outlined</span>
		</div>
	</section>

	<!-- Form inputs -->
	<section class="space-y-4">
		<h2 class="h4 font-semibold">Inputs</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<label class="space-y-1">
				<span class="text-sm font-medium">Text input</span>
				<input bind:value={inputText} class="input" placeholder="Type something…" />
			</label>
			<label class="space-y-1">
				<span class="text-sm font-medium">Select</span>
				<select class="select">
					<option value="">Choose an option</option>
					<option value="a">Option A</option>
					<option value="b">Option B</option>
					<option value="c">Option C</option>
				</select>
			</label>
			<label class="space-y-1">
				<span class="text-sm font-medium">Textarea</span>
				<textarea class="textarea" rows="3" placeholder="Multiline input…"></textarea>
			</label>
			<div class="space-y-3">
				<label class="flex items-center gap-2 text-sm font-medium">
					<input type="checkbox" bind:checked class="checkbox" />
					Checkbox ({checked ? 'on' : 'off'})
				</label>
				<label class="space-y-1">
					<span class="text-sm font-medium">Range: {rangeValue}</span>
					<input type="range" bind:value={rangeValue} min="0" max="100" class="input" />
				</label>
			</div>
		</div>
	</section>

	<!-- Toasts -->
	<section class="space-y-4">
		<h2 class="h4 font-semibold">Toasts</h2>
		<div class="flex flex-wrap gap-3">
			<button class="btn preset-filled-success-500" onclick={() => uiStore.toast('Operation successful!', 'success')}>
				Success toast
			</button>
			<button class="btn preset-filled-error-500" onclick={() => uiStore.toast('Something went wrong.', 'error')}>
				Error toast
			</button>
			<button class="btn preset-tonal" onclick={() => uiStore.toast('Just so you know.', 'info')}>
				Info toast
			</button>
		</div>
	</section>

	<!-- Cards -->
	<section class="space-y-4">
		<h2 class="h4 font-semibold">Cards</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 p-4 space-y-2">
				<p class="font-semibold">Surface card</p>
				<p class="text-sm text-surface-500">Default card style used throughout the app.</p>
			</div>
			<div class="card preset-filled-primary-500 p-4 space-y-2">
				<p class="font-semibold">Primary card</p>
				<p class="text-sm opacity-80">Filled with the primary color.</p>
			</div>
			<div class="card preset-tonal-success p-4 space-y-2">
				<p class="font-semibold">Success card</p>
				<p class="text-sm opacity-80">Tonal success variant.</p>
			</div>
		</div>
	</section>

	<!-- Typography -->
	<section class="space-y-4">
		<h2 class="h4 font-semibold">Typography</h2>
		<div class="space-y-2">
			<p class="h1">Heading 1</p>
			<p class="h2">Heading 2</p>
			<p class="h3">Heading 3</p>
			<p class="h4">Heading 4</p>
			<p>Body text — regular paragraph with <strong>bold</strong>, <em>italic</em>, and <u>underline</u>.</p>
			<p class="text-sm text-surface-500">Small muted text for secondary information.</p>
		</div>
	</section>
</div>
