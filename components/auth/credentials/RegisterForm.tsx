'use client'

import { registerWithCredentials } from '@/actions/auth'
import AuthButton from '../AuthButton'
import { Dispatch, SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface RegisterFormProps {
  setExistentUser: Dispatch<SetStateAction<boolean>>
}

export default function RegisterForm({ setExistentUser }: RegisterFormProps) {
  const router = useRouter()
  const [errors, setErrors] = useState<{
    email?: string | boolean
    password?: string | boolean
    confirmPassword?: string
  }>({})

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const newErrors: {
      email?: string | boolean
      password?: string | boolean
      confirmPassword?: string
    } = {}

    const { email, password, confirmPassword } = Object.fromEntries(
      formData
    ) as Record<string, string>

    if (!email || !emailRegex.test(email as string)) {
      newErrors.email = 'Por favor insira um e-mail válido.'
    }
    if (password !== confirmPassword) {
      newErrors.password = true
      newErrors.confirmPassword = 'Passwords do not match.'
    } else if (!password || password.length < 8) {
      newErrors.password = true
      newErrors.confirmPassword = 'Password must be at least 8 characters long.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return // Retorna sem fazer o login
    }

    try {
      const data = await registerWithCredentials(formData)

      if (data && 'error' in data) {
        const dataError = data.error.split('.')[0]
        if (dataError.startsWith('Read more')) {
          unexpectedError()
        } else if (dataError === 'Token sent') {
          router?.push('/token-sent')
        } else if (dataError === 'User already exists') {
          setExistentUser(true)
        } else {
          setErrors({
            email: true,
            password: true,
            confirmPassword: dataError
          })
        }
      }
    } catch (error: Error | unknown) {
      console.error(error)
      unexpectedError()
    }
  }

  function unexpectedError() {
    setErrors({
      email: true,
      password: true,
      confirmPassword: 'Um erro inesperado ocorreu 😢'
    })
  }

  function handleBlur(type: string) {
    setErrors(prevErrors => ({ ...prevErrors, [type]: undefined }))
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-2'>
        <Input
          id='email'
          type='email'
          placeholder='Email'
          autoComplete='username'
          error={errors?.email}
          onBlur={() => handleBlur('email')}
          onChange={() => handleBlur('email')}
        />
        <PasswordInput
          id='password'
          placeholder='Password'
          error={errors?.password}
          newPassword={true}
        />
        <PasswordInput
          id='confirmPassword'
          placeholder='Confirm Password'
          error={errors.confirmPassword}
          newPassword={true}
        />

        <AuthButton actionText='Sign Up' className='mt-2' />
      </form>
    </div>
  )
}
