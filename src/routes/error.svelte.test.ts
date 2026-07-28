import { page } from "vitest/browser";
import { mount, unmount } from "svelte";
import { afterEach, expect, test } from "vitest";
import ErrorPage from "./+error.svelte";

let component: Record<string, unknown> | undefined;

afterEach(() => {
  if (component) unmount(component);
  component = undefined;
  document.body.innerHTML = "";
});

test("renders the 404 heading", async () => {
  component = mount(ErrorPage, { target: document.body });
  await expect.element(page.getByRole("heading", { name: "404 Not Found" })).toBeVisible();
});

test("fills in a message once mounted", async () => {
  component = mount(ErrorPage, { target: document.body });
  await expect.element(page.getByText("This page seems to be")).toBeVisible();
  await expect
    .poll(() => document.body.textContent?.trim().length ?? 0)
    .toBeGreaterThan("This page seems to be404 Not Found".length);
});
