import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it, vi } from 'vitest'
import Quiz from './Quiz'
import { StudyProvider } from '../lib/store'
import { initialState } from '../lib/study'
import { saveState } from '../lib/db'

beforeEach(async () => { await saveState(structuredClone(initialState)) })
it('4択の選択・採点・解説表示を操作でき、再マウントしてもその状態を復元する', async () => {
  const user = userEvent.setup()
  const first = render(<StudyProvider><Quiz navigate={vi.fn()} /></StudyProvider>)
  await user.click(await screen.findByRole('button', { name: /テストをはじめる/ }))
  const check = screen.getByRole('button', { name: /回答を確定する/ })
  expect(check).toBeDisabled()
  await user.click(screen.getByRole('radio', { name: /人間の知的な活動/ }))
  await user.click(check)
  expect(screen.getByText('正解です！')).toBeInTheDocument()
  expect(screen.getByText(/AIは認識・予測・生成/)).toBeInTheDocument()
  await waitFor(async () => { const { loadState } = await import('../lib/db'); expect((await loadState()).draft?.answers).toHaveLength(1) })
  first.unmount()
  render(<StudyProvider><Quiz navigate={vi.fn()} /></StudyProvider>)
  expect(await screen.findByText('正解です！')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /次の問題へ/ }))
  expect(screen.getByText(/AI、機械学習、深層学習の関係/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /回答を確定する/ })).toBeDisabled()
})
