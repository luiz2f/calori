import { useEffect } from 'react'
import Button from './Button'
import Spinner from './Spinner'

type ConfirmDeleteProps = {
  loading: boolean
  loaded: boolean | undefined
  resource: string
  resourceName: string
  modalName: string
  onConfirm: () => void
  onCloseModal?: () => void
  disabled?: boolean
}

function ConfirmDelete({
  loading,
  loaded,
  resource,
  resourceName,
  onConfirm,
  disabled = false,
  onCloseModal,
  modalName
}: ConfirmDeleteProps) {
  async function handleConfirm() {
    try {
      await onConfirm()
    } catch (error) {
      console.error(error)
    } finally {
      if (loaded === undefined) {
        onCloseModal()
      }
    }
  }

  useEffect(() => {
    if (loaded) {
      onCloseModal()
    }
  }, [loaded, onCloseModal, modalName])

  return (
    <div className='w-full flex flex-col gap-3 relative'>
      <div className='font-bold text-xl mb-6 text-center'>
        Apagar {resource}
      </div>
      <p className='text-blacklight w-5/6- mb-6 text-center'>
        Tem certeza que deseja apagar a {resource.toLocaleLowerCase()}
        <br />
        <strong>{resourceName}</strong>
      </p>

      <div className='flex justify-end gap-3'>
        <Button
          cw='grey'
          size='small'
          disabled={disabled || loading}
          onClick={() => onCloseModal()}
        >
          Cancelar
        </Button>
        <Button
          cw='red'
          size='small'
          disabled={disabled || loading}
          onClick={() => handleConfirm()}
        >
          Apagar
        </Button>
      </div>
      {loading && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-30'>
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default ConfirmDelete
