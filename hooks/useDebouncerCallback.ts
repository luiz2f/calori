import { useRef, useCallback } from 'react'

export function useDebouncerCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Limpa o temporizador anterior, se existir
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Define um novo temporizador
      timerRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  return debouncedCallback
}
