import themes from 'daisyui/src/theming/themes.js';

/** @type {string[]} */
const themeNames = Object.keys(themes)
	.map((k) => {
		const m = k.match(/^\[data-theme=([a-z0-9]+)\]$/);
		return m?.[1];
	})
	.filter(Boolean);

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		themes: ['winter', ...themeNames.filter((n) => n !== 'winter')],
		darkTheme: 'night'
	},
	plugins: [require('daisyui')]
};
