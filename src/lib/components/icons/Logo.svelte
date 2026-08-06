<script lang="ts">
	let { width = '30', height = '30' }: { width?: string; height?: string } = $props();
</script>

<!-- Stylized elephant, drawn in the same stroke style as the lucide icons in the panels
	 so the logo and the UI icons read as one set. Stays legible down to ~20px. -->
<svg
	{width}
	{height}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	class="text-primary-600-400"
	aria-hidden="true"
	xmlns="http://www.w3.org/2000/svg"
>
	<!-- head -->
	<path d="M16 9a4 4 0 0 0-8 0v4a4 4 0 0 0 8 0z" />
	<!-- ears -->
	<path d="M8 7C4 5.5 2 7.5 2 11s2 5.5 4.5 5" />
	<path d="M16 7c4-1.5 6 .5 6 4s-2 5.5-4.5 5" />
	<!-- eyes -->
	<path d="M10 10h.01" />
	<path d="M14 10h.01" />
	<!-- trunk -->
	<path d="M12 17v3a2.5 2.5 0 0 0 5 0" />
</svg>
