import { test, expect } from "@playwright/test";
import path from "path";
const BASE_URL = "http://localhost:5174";

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE_URL}`);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page).toHaveURL(`${BASE_URL}/sign-in`);
  //OR await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await page.locator('input[name="email"]').fill("fatima@gmail.com");
  await page.locator('input[name="password"]').fill("1234567");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page.getByText("Sign in successfull")).toBeVisible();
});

test("should show hotel search result", async ({ page }) => {
  await page.goto(`${BASE_URL}`);

  await page.getByPlaceholder("Destination").fill("Lahore");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Hotels found in Lahore")).toBeVisible();
  await expect(page.getByText("Hotel 2")).toBeVisible();
});
