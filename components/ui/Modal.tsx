'use client'

import { HiXMark } from 'react-icons/hi2'
import { createPortal } from 'react-dom'
import React, {
  cloneElement,
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState
} from 'react'
import { useOutsideClickModal } from '@/hooks/useOutsideClickModal'

interface ModalContextType {
  open: (name: string) => void
  openNames: string[]
  close: (name: string) => void
  closeLast: (force?: boolean) => void
  unsavedChanges: (name: string) => void
  closeUnsaved: () => void
}

interface ModalProps {
  children: React.ReactNode
}

interface OpenProps {
  children: React.ReactElement<{ onClick: () => void }>
  opens: string
}
interface WindowProps {
  children: React.ReactElement<ModalChildProps>
  name: string
}

type ModalChildProps = {
  onCloseModal: () => void
}

export const ModalContext = createContext<ModalContextType>({
  open: () => {},
  openNames: [],
  close: () => {},
  closeLast: () => {},
  unsavedChanges: () => {},
  closeUnsaved: () => {}
})

function Modal({ children }: ModalProps) {
  const [openNames, setOpenNames] = useState<string[]>([])
  const [modified, setModified] = useState<string>('')
  const empty = openNames.length === 0
  useEffect(() => {
    if (!empty) {
      document.body.className = 'h-svh noScroll'
    }
    return () => {
      document.body.className = 'h-svh'
    }
  }, [empty])

  const canClose = new Map(
    openNames.map(name => [name, !modified?.includes(name)])
  )

  const unsavedChanges = (name: string) => setModified(name)
  const open = (name: string) => setOpenNames(prev => [...prev, name])
  const close = (name: string) => {
    const canCloseModal = canClose.get(name)
    if (canCloseModal) {
      setOpenNames(prev => prev.filter(n => n !== name))
    } else {
      openUnsaved()
    }
  }
  const closeLast = (force = false) => {
    const lastName = openNames.at(-1)
    if (lastName) {
      const canCloseLast = canClose.get(lastName)
      if (canCloseLast || force) {
        setOpenNames(prev => prev.slice(0, prev.length - 1))
      } else {
        openUnsaved()
      }
    }
  }

  const closeUnsaved = () => {
    setModified('')
    close('unsavedChanges')
    closeLast(true)
  }
  const openUnsaved = () => {
    if (openNames.includes('unsavedChanges')) {
      return
    }
    open('unsavedChanges')
  }
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (modified) {
        e.preventDefault()
        e.returnValue = '' // Show the default browser alert
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [modified])

  return (
    <ModalContext.Provider
      value={{
        open,
        close,
        closeLast,
        openNames,
        unsavedChanges,
        closeUnsaved
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

function Open({ children, opens }: OpenProps) {
  const { open } = useContext(ModalContext)
  return cloneElement(children as ReactElement, {
    onClick: (e: React.MouseEvent) => {
      e?.stopPropagation()
      e?.preventDefault()
      open(opens)
      if ((children as ReactElement).props.onClick) {
        ;(children as ReactElement).props.onClick(e)
      }
    }
  })
}

function Window({ children, name }: WindowProps) {
  const { openNames, close, closeLast } = useContext(ModalContext)
  const mounted = openNames.includes(name) && React.isValidElement(children)
  const ref = useOutsideClickModal<HTMLDivElement>(closeLast, mounted, name)
  if (!openNames.includes(name)) return null

  if (!React.isValidElement(children)) {
    console.error('`children` must be a valid React element')
    return null
  }
  const closeModal = () => {
    close(name)
  }

  const zIndex = openNames.indexOf(name) + 2000
  const modalWidth = `${95 - 3 * openNames.indexOf(name)}%`

  return createPortal(
    <div
      style={{ zIndex: zIndex }}
      className='fixed top-0 left-0 w-screen h-svh'
    >
      <div
        className={`fixed inset-0 bg-black ${
          zIndex === 2000 ? 'bg-opacity-50' : 'bg-opacity-25'
        }`}
      />
      <div
        className='fixed overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-11/12 flex flex-col max-h-[90vh] max-w-screen-lg bg-white rounded-lg'
        style={{ width: modalWidth }}
        data-name={name}
        ref={ref}
      >
        <button
          onClick={e => {
            e.stopPropagation()
            close(name)
          }}
          className='absolute top-3 right-4 p-2 translate-x-2 bg-none border-none hover:bg-gray-100 rounded-sm z-50'
        >
          <HiXMark className='w-4 h-4 text-gray-500' />
        </button>
        <div className='flex flex-col h-full'>
          {cloneElement(children, { onCloseModal: closeModal })}
        </div>
      </div>
    </div>,
    document?.body
  )
}

Modal.Open = Open
Modal.Window = Window

export default Modal
