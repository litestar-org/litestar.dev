import { describe, it, expect, vi } from 'vitest'
import { withRetry } from '../../app/utils/retry'

describe('withRetry', () => {
  it('returns the first success without retrying', async () => {
    const task = vi.fn().mockResolvedValue('ok')

    await expect(withRetry(task, { delay: 0 })).resolves.toBe('ok')
    expect(task).toHaveBeenCalledTimes(1)
  })

  it('tries again after a failure and reports each retry', async () => {
    const task = vi
      .fn()
      .mockRejectedValueOnce(new Error('dropped'))
      .mockRejectedValueOnce(new Error('dropped'))
      .mockResolvedValue('ok')
    const onRetry = vi.fn()

    await expect(withRetry(task, { delay: 0, onRetry })).resolves.toBe('ok')
    expect(task).toHaveBeenCalledTimes(3)
    expect(
      onRetry.mock.calls.map(([attempt, attempts]) => [attempt, attempts]),
    ).toEqual([
      [2, 3],
      [3, 3],
    ])
  })

  it('gives up after the last attempt and rethrows its error', async () => {
    const task = vi
      .fn()
      .mockRejectedValueOnce(new Error('first'))
      .mockRejectedValue(new Error('last'))

    await expect(withRetry(task, { attempts: 2, delay: 0 })).rejects.toThrow(
      'last',
    )
    expect(task).toHaveBeenCalledTimes(2)
  })
})
