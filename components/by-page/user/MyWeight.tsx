'use client'
import { useUpdateWeight } from '@/app/data/user/useSetWeight'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Toggle from '@/components/ui/Toggle'
import React, { useEffect, useState } from 'react'

function toNumber(value: string | number) {
  return typeof value === 'number' ? value : parseFloat(value)
}

export default function MyWeight({
  userWeight,
  closeAfter = false,
  onCloseModal
}: {
  userWeight: number
  closeAfter?: boolean
  onCloseModal?: () => void
}) {
  const defaultWeight = userWeight
  const defaultWeightlb = parseFloat((userWeight * 2.20462).toFixed(2))
  const [weight, setWeight] = useState(userWeight)
  const [unity, setUnity] = useState<string>('kg')
  const [error, setError] = useState(false)
  const { isPending, updateWeight, isSuccess, isError } = useUpdateWeight()
  const isEqual = weight === defaultWeight || defaultWeightlb === weight
  useEffect(() => {
    if (!isPending && isSuccess) {
      if (closeAfter && onCloseModal) {
        onCloseModal()
      } else {
        setWeight(toNumber(defaultWeight))
      }
    }
  }, [closeAfter, defaultWeight, isPending, isSuccess, onCloseModal])

  useEffect(() => {
    if (isError) {
      setError(true)
    }
  }, [isError])

  function checkInput(input?: string) {
    const weightKg = input || toNumber(weight)
    if (!weightKg) {
      setError(true)
    } else {
      setError(false)
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    let weightKg = toNumber(weight)
    if (!weightKg) {
      setError(true)
    }
    if (unity === 'lb') {
      weightKg = parseFloat((weight * 2.20462).toFixed(2))
    }
    updateWeight(weightKg)
  }

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9.,]/g, '')

    if (/^[0-9.,]*$/.test(input)) {
      setWeight(toNumber(input))
      checkInput(input)
    }
  }

  const toggleUnity = (type: string) => {
    setUnity(type)
    if (type === 'kg') {
      setWeight(prevWeight => parseFloat((prevWeight / 2.20462).toFixed(2))) // Convert kg to lblb to kg
    } else {
      setWeight(prevWeight => parseFloat((prevWeight * 2.20462).toFixed(2))) // Convert kg to lb
    }
  }
  const exceptThisSymbols = ['e', 'E', '+', '-', '.']
  return (
    <>
      <form onSubmit={handleSubmit} className='relative'>
        <div className='font-bold text-xl mb-8 text-center'>
          {defaultWeight ? 'Meu Peso' : 'Insira seu Peso'}
        </div>
        <Toggle
          options={['kg', 'lb']}
          value={unity}
          onChange={(value: string) => toggleUnity(value as 'kg' | 'lb')}
          className='mb-6'
        />
        <div className='relative w-fit mx-auto'>
          <label className='absolute top-[-6px] hidden text-grey50 px-1 ml-1 text-sm bg-white line leading-3'>
            Peso
          </label>
          <input
            name='dietName'
            type='number'
            value={weight}
            onChange={e => handleWeightChange(e)}
            onBlur={() => checkInput()}
            onKeyDown={e =>
              exceptThisSymbols.includes(e.key) && e.preventDefault()
            }
            className={`p-2 w-40 border-1  rounded-lg mb-3 text-[2.5rem] font-bold text-center ${
              error
                ? 'bg-lightred border-darkred text-darkred'
                : 'border-grey-50'
            }`}
          />
        </div>

        <div className='flex gap-4 px-1 mt-6'>
          <Button
            size='small'
            type='submit'
            disabled={error || isEqual || isPending}
          >
            {defaultWeight ? 'Atualizar Peso' : 'Salvar Peso'}
          </Button>
        </div>
        {isPending && (
          <div className='absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-80'>
            <Spinner />
          </div>
        )}
      </form>
    </>
  )
}
