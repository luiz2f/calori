'use client'
import React, { useState, useEffect } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import Modal from '@/components/ui/Modal'
import ConfirmDelete from '@/components/ui/ConfirmDelete'
export type MealFromEditDiet = {
  id: string
  name: string
  time: string
  dietId?: string
}
export default function DietEditRefRow({
  refData,
  onRefChange,
  onTimeBlur,
  nameError,
  timeError,
  onDelete
}: {
  refData: MealFromEditDiet
  onRefChange: (key: string, value: string) => void
  onTimeBlur: () => void
  nameError: string
  timeError: string
  onDelete: (refId: string) => void
}) {
  const [time, setTime] = useState(refData.time)
  const [name, setName] = useState(refData.name)

  useEffect(() => {
    onRefChange('name', name)
  }, [name])

  useEffect(() => {
    onRefChange('time', time)
  }, [time])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value)
  }

  const handleDelete = () => {
    onDelete(refData.id)
  }

  return (
    <div key={refData.id} className='flex gap-2'>
      <input
        name='refName'
        value={name}
        onChange={e => setName(e.target.value)}
        className={`border-1 w-full p-1 pl-2 rounded-lg ${
          nameError
            ? 'border-darkred bg-lightred text-darkred'
            : 'border-grey-50'
        }`}
        required
      />
      <input
        type='time'
        name='refTime'
        value={time}
        onChange={handleTimeChange}
        onBlur={onTimeBlur}
        className={`border-1 pl-2 bg-white w-18 text-center  text-darkgreen rounded-lg font-medium ${
          timeError
            ? 'border-darkred bg-lightred text-darkred'
            : 'border-grey-50'
        }`}
      />

      <Modal.Open
        opens={`deleteRef${refData.id}${refData.name}${refData.time}`}
      >
        <button
          onClick={e => {
            {
              e.stopPropagation()
              e.preventDefault()
            }
          }}
          className='cursor-pointer border-1 border-grey-50 flex items-center justify-center  w-8 h-8 rounded-lg p-1'
        >
          <HiOutlineTrash />
        </button>
      </Modal.Open>
      <Modal.Window
        name={`deleteRef${refData.id}${refData.name}${refData.time}`}
      >
        <ConfirmDelete
          resource='Refeição'
          resourceName={`${refData.name} - ${refData.time}`}
          onConfirm={handleDelete}
          modalName={`deleteRef${refData.id}${refData.name}${refData.time}`}
        />
      </Modal.Window>
    </div>
  )
}
