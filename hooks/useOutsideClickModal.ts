'use client'
import { useEffect, useRef, useContext } from 'react'
import { ModalContext } from '@/components/ui/Modal'

export function useOutsideClickModal<T extends HTMLElement>(
  handler: () => void,
  mounted: boolean = true,
  name: string
) {
  const ref = useRef<T | null>(null)
  const { openNames } = useContext(ModalContext)
  const isLast = openNames[openNames.length - 1] === name

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!mounted || !isLast) return // Cancel the handler if the component is not mounted
      const target = e.target as Element
      const menu = document?.getElementById('menu-container')
      const isSelectMenu = target.role === 'option'
      if (
        ref.current &&
        !ref.current.contains(target) &&
        !(menu && menu.contains(target)) &&
        !isSelectMenu
      ) {
        handler()
      }
    }

    if (mounted) {
      document?.addEventListener('click', handleClick)
    }
    return () => {
      document?.removeEventListener('click', handleClick)
    }
  }, [handler, isLast, mounted, openNames])
  return ref
}
