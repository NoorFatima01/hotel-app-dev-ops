import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test('should allow user to sign in', async ({ page }) => {
  await page.goto(`${BASE_URL}`);
  await page.getByRole('link', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/sign-in`);
  //OR await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await page.locator('input[name="email"]').fill('fatima@gmail.com')
  await page.locator('input[name="password"]').fill('1234567')
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByText("Sign in successfull")).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My Bookings' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My Hotels' })).toBeVisible();
});

test("should allow user to register", async ({ page }) => {
  const testEmail = `fatima${Math.floor(Math.random() * 100000)}@gmail.com`;
  await page.goto(`${BASE_URL}`);
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/register`);

  await page.locator('input[name="firstName"]').fill('Fatima2');
  await page.locator('input[name="lastName"]').fill('Khalid2');
  await page.locator('input[name="email"]').fill(testEmail);
  await page.locator('input[name="password"]').fill('1234567');
  await page.locator('input[name="confirmPassword"]').fill('1234567');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText("Account created successfully")).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My Bookings' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My Hotels' })).toBeVisible();

});