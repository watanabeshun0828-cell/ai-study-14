import { expect, test } from '@playwright/test'
import day1 from '../src/data/day01.json' with { type: 'json' }

test('iPhone幅で講義・テスト・復習・成績と途中再開を通して確認する', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', err => errors.push(err.message))
  await page.goto('./')
  await expect(page.getByRole('heading', { name: '今日も、ひとつ先へ。' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Day2 生成AIの種類と特徴 教材準備中', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: '今日の学習をはじめる' }).click()
  for (let i = 0; i < day1.sections.length - 1; i++) await page.getByRole('button', { name: '読了して次の章へ' }).click()
  await page.getByRole('button', { name: '読了してテストへ' }).click()
  await page.getByRole('button', { name: 'テストをはじめる' }).click()
  for (let i = 0; i < day1.questions.length; i++) {
    const q = day1.questions[i]
    const selected = i === 0 ? 1 : q.correctIndex
    await page.getByRole('radio').nth(selected).check()
    await page.getByRole('button', { name: '回答を確定する' }).click()
    await expect(page.getByRole('status').filter({ has: page.getByRole('heading', { name: i === 0 ? 'ここで覚えれば、大丈夫。' : '正解です！' }) })).toBeVisible()
    if (i === 1) {
      await expect(page.getByText('この端末に保存済み')).toBeVisible()
      await page.reload()
      await expect(page.getByText('正解です！')).toBeVisible()
      await expect(page.getByRole('radio').nth(selected)).toBeChecked()
    }
    await page.getByRole('button', { name: i === day1.questions.length - 1 ? '結果を見る' : '次の問題へ' }).click()
  }
  await expect(page.locator('.result-score')).toHaveText('88%')
  await page.getByRole('button', { name: '間違えた問題を復習' }).click()
  await expect(page.getByRole('heading', { name: '1問を復習しましょう' })).toBeVisible()
  await page.getByRole('button', { name: '復習をはじめる' }).click()
  await page.getByRole('radio').nth(0).check()
  await page.getByRole('button', { name: '回答を確定する' }).click()
  await page.getByRole('button', { name: '結果を見る' }).click()
  await page.getByRole('button', { name: '間違えた問題を復習' }).click()
  await expect(page.getByRole('heading', { name: '復習待ちはありません' })).toBeVisible()
  await page.getByRole('navigation', { name: 'モバイルメニュー' }).getByRole('link', { name: '成績', exact: true }).click()
  await expect(page.locator('.history-table .history-row')).toHaveCount(3)
  await expect(page.locator('.category-list')).toContainText('AIの基礎')
  await page.getByRole('navigation', { name: 'モバイルメニュー' }).getByRole('link', { name: 'ホーム', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Day1 AIの基礎理解', exact: true })).toHaveClass(/done/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('PWAをキャッシュしてからオフラインで再読み込み・保存できる', async ({ page, context }) => {
  await page.goto('./')
  await page.evaluate(async () => { await navigator.serviceWorker.ready; if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true })) })
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: '今日も、ひとつ先へ。' })).toBeVisible()
  await page.getByRole('button', { name: '今日の学習をはじめる' }).click()
  await page.getByRole('button', { name: '読了して次の章へ' }).click()
  await expect(page.getByText('この端末に保存済み')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: '機械学習と深層学習', exact: true })).toBeVisible()
  await expect(page.getByText('オフラインで学習中です。', { exact: false })).toBeVisible()
})

test('ダークモード設定を復元し、インストール案内を開ける', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: '表示・アプリ設定', exact: true }).click()
  await page.getByRole('button', { name: 'ダーク', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: '閉じる', exact: true }).click()
  await expect(page.getByText('この端末に保存済み')).toBeVisible()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: '表示・アプリ設定', exact: true }).click()
  await page.getByRole('button', { name: 'インストール方法を見る' }).click()
  await expect(page.getByRole('dialog')).toContainText('ホーム画面に追加')
})

test('320pxとデスクトップでもはみ出さずに表示する', async ({ page }) => {
  await page.goto('./')
  await page.setViewportSize({ width: 320, height: 700 })
  await expect(page.getByRole('heading', { name: '今日も、ひとつ先へ。' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/home-320.png', fullPage: true })
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
