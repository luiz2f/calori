'use client'
import React from 'react'

export const NumberInput = React.memo(
  ({
    value,
    onChange
  }: {
    value: number
    onChange: (value: string) => void
  }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    }

    return (
      <input
        type='number'
        pattern='[0-9]{0,5}'
        value={value}
        onInput={handleInputChange}
        className={`border-1 py-[2px] text-center rounded-lg ${
          value < 0
            ? 'bg-lightred border-darkred text-darkred'
            : 'border-grey10'
        }`}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'
