<script lang="ts">
	import { resolve } from '$app/paths';
	import GitHubIcon from '$lib/components/icons/GitHubIcon.svelte';
	import Lightswitch from './Lightswitch.svelte';
	import Logo from '../icons/Logo.svelte';
</script>

<header
	class="sticky top-0 z-30 flex h-[70px] w-full items-center border-b-[1px] border-surface-500/20 bg-surface-50/90 backdrop-blur dark:bg-surface-950/90"
>
	<div
		class="container mx-auto grid max-w-screen-2xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 xl:px-10"
	>
		<!-- Left: Logo + name -->
		<a class="flex items-center gap-2.5" href={resolve('/')} title="camihub">
			<Logo width="28" height="28" />
			<span class="text-[15px] font-bold tracking-tight lowercase">
				cami<span class="text-primary-600 dark:text-primary-400">hub</span>
			</span>
		</a>
		<!-- Middle -->
		<div></div>
		<!-- Right -->
		<div class="flex items-stretch justify-end gap-2">
			<Lightswitch />
			<span class="border-r border-surface-200-800"></span>
			<nav class="flex items-center gap-1">
				<a
					class="btn-icon hover:preset-tonal"
					href="https://github.com/mistahuman/camihub"
					rel="external"
					target="_blank"
				>
					<GitHubIcon size={20} />
				</a>
			</nav>
		</div>
	</div>
</header>
