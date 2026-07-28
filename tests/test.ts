import { expect, test } from "@playwright/test";

test("index page introduces me", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Hello, my name is")).toBeVisible();
  await expect(page.getByText("Tyler Johnson")).toBeVisible();
});

test("index page links to github and email", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Github Profile" })).toHaveAttribute(
    "href",
    "https://github.com/tyler-johnson",
  );
  await expect(page.getByRole("link", { name: "Personal Email" })).toHaveAttribute(
    "href",
    "mailto:tyler@tylerjohnson.me",
  );
});

test("unknown route renders the 404 page", async ({ page }) => {
  await page.goto("/definitely-not-a-real-page");
  await expect(page.getByRole("heading", { name: "404 Not Found" })).toBeVisible();
});

test("theme picker switches the active theme", async ({ page }) => {
  await page.goto("/");

  const html = page.locator("html");
  await expect(html).not.toHaveAttribute("data-theme");

  await page.getByRole("button", { name: /Theme/ }).click();
  await page.getByRole("button", { name: "Dracula" }).click();

  await expect(html).toHaveAttribute("data-theme", "dracula");
});

test("theme picker is reachable by keyboard", async ({ page }) => {
  await page.goto("/");
  const menu = page.locator("ul.dropdown-content");
  await expect(menu).toBeHidden();

  // The trigger is a real button, so focusing it opens the menu via :focus-within.
  await page.getByRole("button", { name: /Theme/ }).focus();
  await expect(menu).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Auto" })).toBeFocused();
});
