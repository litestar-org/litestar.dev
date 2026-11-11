export interface RetryOptions {
  /** Total tries, including the first. */
  attempts?: number
  /** Wait before the second try, in ms; doubles for each one after. */
  delay?: number
  /** Called before each new try, with the number of the try about to start. */
  onRetry?: (attempt: number, attempts: number, error: unknown) => void
}

/** Run `task`, trying again when it rejects. Rethrows the last failure. */
export async function withRetry<T>(
  task: () => Promise<T>,
  { attempts = 3, delay = 1000, onRetry }: RetryOptions = {},
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await task()
    } catch (error) {
      if (attempt >= attempts) throw error

      await new Promise((resolve) =>
        setTimeout(resolve, delay * 2 ** (attempt - 1)),
      )
      onRetry?.(attempt + 1, attempts, error)
    }
  }
}
