import { test, expect } from "@playwright/test";
import path from "path";
const BASE_URL = "http://localhost:5173";

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

test("should allow user to add hotel", async ({ page }) => {
  await page.goto(`${BASE_URL}/add-hotel`);
  await page.locator('input[name="name"]').fill("Hotel 1");
  await page.locator('input[name="city"]').fill("Lahore");
  await page.locator('input[name="country"]').fill("Pakistan");
  await page.locator('[name="description"]').fill("This is a test hotel");
  await page.locator('input[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "5");
  await page.getByText("Motel").click();
  await page.getByLabel("Free Wifi").click();
  await page.getByLabel("Free Parking").click();
  await page.locator('input[name="adultCapacity"]').fill("2");
  await page.locator('input[name="childCapacity"]').fill("2");

  await page.setInputFiles('input[name="imageFiles"]', [
    path.join(__dirname, "files", "cat sleeping.jpg"),
    path.join(__dirname, "files", "dog-food.jpg"),
    path.join(__dirname, "files", "pet.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel added successfully")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${BASE_URL}/my-hotels`);
  await expect(page.getByText("Hotel 1").first()).toBeVisible();
  await expect(page.getByText("Lahore, Pakistan").first()).toBeVisible();
  await expect(page.getByText("This is a test hotel").first()).toBeVisible();
  await expect(page.getByText("100").first()).toBeVisible();
  await expect(page.getByText("5").first()).toBeVisible();
  await expect(page.getByText("2").first()).toBeVisible();
  await expect(page.getByText("2").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "View Details" }).first()).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${BASE_URL}/my-hotels`);
  await page.getByRole("link", { name: "View Details" }).first().click();
  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Hotel 1");
  await page.locator('[name="name"]').fill("Hotel 2");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel edited successfully")).toBeVisible();

  await page.reload();
  await expect(page.locator('[name="name"]')).toHaveValue("Hotel 2");
  await page.locator('[name="name"]').fill("Hotel 1");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel edited successfully")).toBeVisible();
});
