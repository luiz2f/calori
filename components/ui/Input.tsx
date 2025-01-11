import clsx from 'clsx'

export const basicInputClass =
  'mt-1 w-full h-[54px] text-base py-3 px-4 h-10 rounded-md border-grey40 border bg-white transition-all duration-fast ease '
export const basicInputErrorClass =
  '!border-darkred !bg-lightred -internal-autofill-selected:!bg-lightred'
export default function Input({
  id,
  type = 'text',
  placeholder,
  error,
  autoComplete,
  ...props
}: Readonly<{
  id: string
  type?: string
  placeholder?: string
  autoComplete?: string
  error?: string | boolean | undefined
  onBlur?: () => void
  onChange?: () => void
}>) {
  const inputClass = clsx(basicInputClass, {
    [basicInputErrorClass]: error
  })
  // 📌 TODO - Erro do autofill

  return (
    <div>
      {/* <label>{placeholder}</label> */}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
        {...props}
      />
      {error && <span className='text-darkred'>{error}</span>}
    </div>
  )
}
