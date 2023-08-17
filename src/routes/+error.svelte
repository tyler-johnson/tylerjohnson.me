<script lang="ts" context="module">
	import { onMount } from 'svelte';

	const messages = [
		"If you're lost, you're probably doing it wrong.",
		'Better luck next time, I guess.',
		"There's nothing to see here. Move along.",
		'Thank you. Come again.',
		'Reloading this page several more times may solve the issue.',
		"I'm not sure what you were expecting.",
		'(╯°□°）╯︵ ┻━┻',
		'Shh bby is ok'
	];
</script>

<script lang="ts">
	let message: string | undefined;

	onMount(() => {
		message = messages[Math.floor(Math.random() * messages.length)];
	});
</script>

<div class="py-8">
	<div class="container mx-auto flex flex-col gap-2 p-4 font-mono">
		<div class="text-4xl text-base-content/60">This page seems to be</div>
		<h1 class="text-8xl">404 Not Found</h1>
		<div class="text-xl text-base-content/80">
			{message}
		</div>
	</div>
</div>
