declare module 'daisyui/src/theming/themes.js' {
	export type ThemeSelector<T extends string = string> = `[data-theme=${T}]`;
	export type HexColor<V extends string = string> = `#${V}`;

	export interface Theme {
		'color-scheme': 'dark' | 'light';
		primary: HexColor;
		secondary: HexColor;
		accent: HexColor;
		neutral: HexColor;
		'base-100': HexColor;
	}

	const themes: Record<ThemeSelector, Theme>;

	export default themes;
}
