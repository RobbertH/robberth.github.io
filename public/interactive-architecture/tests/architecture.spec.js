import { test, expect } from '@playwright/test';

const SETTLE_MS = 1500;

test.describe('Architecture Diagram', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for ReactFlow to render nodes
    await page.waitForSelector('.architecture-node', { timeout: 10000 });
    await page.waitForTimeout(SETTLE_MS);
  });

  test('default view - AWS / Iceberg / SME / Small', async ({ page }) => {
    await expect(page.locator('.architecture-node')).not.toHaveCount(0);
    await page.screenshot({ path: 'screenshots/01-default-aws.png', fullPage: true });
  });

  test('switch to Azure', async ({ page }) => {
    await page.getByRole('button', { name: 'Azure' }).click();
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: 'screenshots/02-azure.png', fullPage: true });
    await expect(page.locator('.node-label', { hasText: 'ADLS Gen2' })).toBeVisible();
  });

  test('switch to GCP', async ({ page }) => {
    await page.getByRole('button', { name: 'GCP' }).click();
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: 'screenshots/03-gcp.png', fullPage: true });
    await expect(page.locator('.node-label', { hasText: 'GCS' })).toBeVisible();
  });

  test('switch to Self-Hosted', async ({ page }) => {
    await page.getByRole('button', { name: 'Self-Hosted' }).click();
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: 'screenshots/04-self-hosted.png', fullPage: true });
    await expect(page.locator('.node-label', { hasText: 'Traefik' })).toBeVisible();
    await expect(page.locator('.node-label', { hasText: 'MinIO' })).toBeVisible();
    await expect(page.locator('.node-label', { hasText: 'Trino' })).toBeVisible();
  });

  test('toggle Delta table format', async ({ page }) => {
    await page.getByRole('button', { name: 'Delta' }).click();
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: 'screenshots/05-delta-format.png', fullPage: true });
    await expect(page.locator('.node-label', { hasText: 'Delta' })).toBeVisible();
  });

  test('toggle Enterprise scale - adds extra ingestion nodes', async ({ page }) => {
    const nodesBefore = await page.locator('.architecture-node').count();
    await page.getByRole('button', { name: 'Enterprise' }).click();
    await page.waitForTimeout(SETTLE_MS);
    const nodesAfter = await page.locator('.architecture-node').count();
    await page.screenshot({ path: 'screenshots/06-enterprise.png', fullPage: true });
    expect(nodesAfter).toBeGreaterThan(nodesBefore);
  });

  test('toggle Big Data - switches to Spark processing', async ({ page }) => {
    await page.getByRole('button', { name: 'Big Data' }).click();
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: 'screenshots/07-big-data.png', fullPage: true });
    await expect(page.locator('.node-label', { hasText: 'EMR Spark' })).toBeVisible();
  });

  test('full combo: Self-Hosted / Delta / Enterprise / Big Data', async ({ page }) => {
    await page.getByRole('button', { name: 'Self-Hosted' }).click();
    await page.getByRole('button', { name: 'Delta' }).click();
    await page.getByRole('button', { name: 'Enterprise' }).click();
    await page.getByRole('button', { name: 'Big Data' }).click();
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: 'screenshots/08-self-hosted-full.png', fullPage: true });
    await expect(page.locator('.node-label', { hasText: 'Kafka' })).toBeVisible();
    await expect(page.locator('.node-label', { hasText: 'Spark on K8s' })).toBeVisible();
    await expect(page.locator('.node-label', { hasText: 'Delta' })).toBeVisible();
  });
});
