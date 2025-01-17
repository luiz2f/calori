'use client'

import React from 'react'

export default function Toogle({
  options,
  value,
  onChange,
  className
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div
      className={`flex font-sm margin-auto border-1  border-grey40 text-grey40 rounded-lg w-fit mx-auto ${className}`}
    >
      {options.map((option, index) => {
        return (
          <OptionButton
            fixedWidth={options.length > 2}
            key={index}
            option={option}
            onChange={() => onChange(option)}
            isSelected={option === value}
          />
        )
      })}
    </div>
  )
}

function OptionButton({
  option,
  onChange,
  isSelected,
  fixedWidth
}: {
  option: string
  onChange: (value: string) => void
  isSelected: boolean
  fixedWidth: boolean
}) {
  if (isSelected) {
    return (
      <SelectedToogle
        option={option}
        onChange={onChange}
        fixedWidth={fixedWidth}
      />
    )
  } else {
    return (
      <OptionToogle
        option={option}
        onChange={onChange}
        fixedWidth={fixedWidth}
      />
    )
  }
}

function OptionToogle({
  option,
  onChange,
  fixedWidth
}: {
  option: string
  onChange: (value: string) => void
  fixedWidth: boolean
}) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onChange(option)
  }
  return (
    <button
      onClick={e => {
        handleClick(e)
      }}
      className={`px-2 rounded-lg ${fixedWidth ? 'w-16' : ''}`}
    >
      {option}
    </button>
  )
}

function SelectedToogle({
  option,
  onChange,
  fixedWidth
}: {
  option: string
  onChange: (value: string) => void
  fixedWidth: boolean
}) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onChange(option)
  }
  return (
    <div
      className={`text-transparent px-2 border-red-600 rounded-lg relative ${
        fixedWidth ? 'w-16' : ''
      }`}
    >
      {option}
      <button
        onClick={e => {
          handleClick(e)
        }}
        className={`text-darkgreen border-1 border-lightgreen bg-whitegreen z-10 px-2 rounded-lg absolute top-[-1px] right-[-1px] left-[-1px] bottom-[-1px] `}
      >
        {option}
      </button>
    </div>
  )
}
