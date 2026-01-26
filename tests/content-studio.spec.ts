import { test, expect } from '@playwright/test';

test.describe('Content Studio', () => {
  test('should display book list', async ({ page }) => {
    await page.goto('/');

    // Wait for books to load
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Books');

    // Should see book cards
    const bookCards = page.locator('[data-testid="book-card"]');
    await expect(bookCards.first()).toBeVisible({ timeout: 10000 });

    // Should have 5 books
    await expect(bookCards).toHaveCount(5);
  });

  test('should open book detail page', async ({ page }) => {
    await page.goto('/');

    // Wait for books to load and click the review button
    const bookCard = page.locator('[data-testid="book-card"]').first();
    await expect(bookCard).toBeVisible({ timeout: 10000 });

    // Click the review link button inside the card
    await bookCard.getByRole('link').click();

    // Should navigate to book detail page
    await expect(page).toHaveURL(/\/book\//, { timeout: 10000 });

    // Should see chapters sidebar
    await expect(page.locator('[data-testid="chapter-sidebar"]')).toBeVisible({ timeout: 10000 });
  });

  test('should display chapter content', async ({ page }) => {
    await page.goto('/');

    // Click on first book review link
    const bookCard = page.locator('[data-testid="book-card"]').first();
    await expect(bookCard).toBeVisible({ timeout: 10000 });
    await bookCard.getByRole('link').click();

    // Wait for chapter sidebar
    const chapterSidebar = page.locator('[data-testid="chapter-sidebar"]');
    await expect(chapterSidebar).toBeVisible({ timeout: 10000 });

    // Should have chapter buttons in sidebar
    const chapterButtons = chapterSidebar.locator('button');
    await expect(chapterButtons.first()).toBeVisible({ timeout: 10000 });

    // Click on first chapter
    await chapterButtons.first().click();

    // Should see the iPhone preview frame (content is rendered inside)
    const previewFrame = page.locator('iframe[title="Reader Preview"]');
    await expect(previewFrame).toBeVisible({ timeout: 10000 });
  });

  test('Dedication chapter should be accessible', async ({ page }) => {
    // Navigate to The Sun Also Rises (has Dedication chapter)
    await page.goto('/');

    // Find and click The Sun Also Rises review link
    const bookCard = page.locator('[data-testid="book-card"]', { hasText: 'The Sun Also Rises' });
    await expect(bookCard).toBeVisible({ timeout: 10000 });
    await bookCard.getByRole('link').click();

    // Wait for chapter sidebar
    const chapterSidebar = page.locator('[data-testid="chapter-sidebar"]');
    await expect(chapterSidebar).toBeVisible({ timeout: 10000 });

    // Find Dedication chapter button
    const dedicationChapter = chapterSidebar.locator('button', { hasText: 'Dedication' });
    await expect(dedicationChapter).toBeVisible({ timeout: 10000 });
    await dedicationChapter.click();

    // Should see the iPhone preview frame
    const previewFrame = page.locator('iframe[title="Reader Preview"]');
    await expect(previewFrame).toBeVisible({ timeout: 10000 });
  });

  test('Epigraph chapter should be accessible', async ({ page }) => {
    // Navigate to The Sun Also Rises
    await page.goto('/');

    const bookCard = page.locator('[data-testid="book-card"]', { hasText: 'The Sun Also Rises' });
    await expect(bookCard).toBeVisible({ timeout: 10000 });
    await bookCard.getByRole('link').click();

    // Wait for chapter sidebar
    const chapterSidebar = page.locator('[data-testid="chapter-sidebar"]');
    await expect(chapterSidebar).toBeVisible({ timeout: 10000 });

    // Find Epigraph chapter button
    const epigraphChapter = chapterSidebar.locator('button', { hasText: 'Epigraph' });
    await expect(epigraphChapter).toBeVisible({ timeout: 10000 });
    await epigraphChapter.click();

    // Should see the iPhone preview frame
    const previewFrame = page.locator('iframe[title="Reader Preview"]');
    await expect(previewFrame).toBeVisible({ timeout: 10000 });
  });
});
