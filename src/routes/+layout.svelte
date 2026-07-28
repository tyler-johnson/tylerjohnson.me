<script lang="ts" module>
  import themes from "daisyui/theme/object.js";
  import "../app.css";
  import { onMount } from "svelte";
  import type { LayoutProps } from "./$types";

  const darkThemes = Object.entries(themes)
    .map(([k, theme]) => {
      if (theme["color-scheme"] !== "dark") return;
      return k;
    })
    .filter((v): v is string => Boolean(v))
    .sort();

  const lightThemes = Object.entries(themes)
    .map(([k, theme]) => {
      if (theme["color-scheme"] !== "light") return;
      return k;
    })
    .filter((v): v is string => Boolean(v))
    .sort();

  const allThemes = [...lightThemes, ...darkThemes];
</script>

<script lang="ts">
  let { children }: LayoutProps = $props();
  let theme = $state<string>();

  onMount(() => {
    setTheme(localStorage.getItem("theme") || document.documentElement.dataset.theme);
  });

  function setTheme(n?: string) {
    if (theme === n) return;

    if (n === "random") {
      theme = allThemes[Math.floor(Math.random() * allThemes.length)];
    } else if (n == null || n === "auto" || !allThemes.includes(n)) {
      theme = undefined;
    } else {
      theme = n;
    }

    if (theme) {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);
    } else {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem("theme");
    }
  }
</script>

{@render children?.()}

<div class="dropdown dropdown-top dropdown-end fixed bottom-2 right-2">
  <!-- A real button is natively focusable, so daisyUI's :focus-within opens the
       menu without the tabindex/label workaround this used to need. -->
  <button class="btn btn-sm btn-primary" aria-haspopup="menu">
    Theme <i class="fa-solid fa-caret-up" aria-hidden="true"></i>
  </button>

  <ul
    class="dropdown-content z-[1] menu flex-nowrap p-2 shadow bg-base-300 rounded-box w-64 mb-2 max-h-[calc(100vh-10rem)] overflow-auto"
  >
    <li>
      <button class:active={theme == null} onclick={() => setTheme("auto")}>
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        Auto
      </button>
    </li>
    <li>
      <button onclick={() => setTheme("random")}>
        <i class="fa-solid fa-dice"></i>
        Random
      </button>
    </li>
    <li class="border-b-2 border-b-base-content/10"></li>
    {#each lightThemes as name (name)}
      <li>
        <button
          class="flex justify-between"
          class:active={theme === name}
          onclick={() => setTheme(name)}
        >
          <span>{name[0].toUpperCase()}{name.substring(1)}</span>
          <div class="flex gap-1 rounded-sm p-1" data-theme={name}>
            <div class="bg-base-content w-4 h-4 rounded-full"></div>
            <div class="bg-primary w-4 h-4 rounded-full"></div>
          </div>
        </button>
      </li>
    {/each}
    <li class="border-b-2 border-b-base-content/10"></li>
    {#each darkThemes as name (name)}
      <li>
        <button
          class="flex justify-between"
          class:active={theme === name}
          onclick={() => setTheme(name)}
        >
          <span>{name[0].toUpperCase()}{name.substring(1)}</span>
          <div class="flex gap-1 rounded-sm p-1" data-theme={name}>
            <div class="bg-base-content w-4 h-4 rounded-full"></div>
            <div class="bg-primary w-4 h-4 rounded-full"></div>
          </div>
        </button>
      </li>
    {/each}
  </ul>
</div>
