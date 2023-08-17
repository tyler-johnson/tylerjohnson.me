<script lang="ts" context="module">
	import themes from 'daisyui/src/theming/themes.js';
	import '../app.css';
	import { onMount } from 'svelte';

	const darkThemes = Object.entries(themes)
		.map(([k, theme]) => {
			if (theme['color-scheme'] !== 'dark') return;

			const m = k.match(/^\[data-theme=([a-z0-9]+)\]$/);
			return m?.[1];
		})
		.filter((v): v is string => !!v)
		.sort();

	const lightThemes = Object.entries(themes)
		.map(([k, theme]) => {
			if (theme['color-scheme'] !== 'light') return;

			const m = k.match(/^\[data-theme=([a-z0-9]+)\]$/);
			return m?.[1];
		})
		.filter((v): v is string => !!v)
		.sort();

	const allThemes = [...lightThemes, ...darkThemes];
</script>

<script lang="ts">
	let theme: string | undefined;

	onMount(() => {
		theme = localStorage.getItem('theme') || document.documentElement.dataset.theme;
		document.documentElement.dataset.theme = theme;
	});

	function onSetTheme(n: string) {
		return () => {
			if (n === 'random') {
				theme = allThemes[Math.floor(Math.random() * allThemes.length)];
			} else if (n === 'auto' || !allThemes.includes(n)) {
				theme = undefined;
				delete document.documentElement.dataset.theme;
				localStorage.removeItem('theme');
				return;
			} else {
				theme = n;
			}

			document.documentElement.dataset.theme = theme;
			localStorage.setItem('theme', theme);
		};
	}
</script>

<slot />

<div class="dropdown dropdown-top dropdown-end fixed bottom-2 right-2">
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label tabindex="0" class="btn btn-sm btn-primary">
		Theme <i class="fa-solid fa-caret-up" />
	</label>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<ul
		tabindex="0"
		class="dropdown-content z-[1] menu flex-nowrap p-2 shadow bg-base-300 rounded-box w-64 mb-2 max-h-[calc(100vh-10rem)] overflow-auto"
	>
		<li>
			<button class:active={theme == null} on:click={onSetTheme('auto')}>
				<i class="fa-solid fa-wand-magic-sparkles" />
				Auto
			</button>
		</li>
		<li>
			<button on:click={onSetTheme('random')}>
				<i class="fa-solid fa-dice" />
				Random
			</button>
		</li>
		<li class="border-b-2 border-b-base-content/10" />
		{#each lightThemes as name (name)}
			<li>
				<button
					class="flex justify-between"
					class:active={theme === name}
					on:click={onSetTheme(name)}
				>
					<span>{name[0].toUpperCase()}{name.substring(1)}</span>
					<div class="flex gap-1 rounded-sm p-1" data-theme={name}>
						<div class="bg-base-content w-4 h-4 rounded-full" />
						<div class="bg-primary w-4 h-4 rounded-full" />
					</div>
				</button>
			</li>
		{/each}
		<li class="border-b-2 border-b-base-content/10" />
		{#each darkThemes as name (name)}
			<li>
				<button
					class="flex justify-between"
					class:active={theme === name}
					on:click={onSetTheme(name)}
				>
					<span>{name[0].toUpperCase()}{name.substring(1)}</span>
					<div class="flex gap-1 rounded-sm p-1" data-theme={name}>
						<div class="bg-base-content w-4 h-4 rounded-full" />
						<div class="bg-primary w-4 h-4 rounded-full" />
					</div>
				</button>
			</li>
		{/each}
	</ul>
</div>
