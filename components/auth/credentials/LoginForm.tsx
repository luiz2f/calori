'use client'

import { loginWithCredentials } from '@/actions/auth'
import AuthButton from '../AuthButton'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export default function LoginForm() {
  const router = useRouter()

  const [errors, setErrors] = useState<{
    email?: string | boolean
    password?: string
  }>({}) // Inicializando com objeto vazio
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const newErrors: { email?: string | boolean; password?: string } = {}
    const { email, password } = Object.fromEntries(formData) as Record<
      string,
      string
    >
    if (!email || !emailRegex.test(email as string)) {
      newErrors.email = 'Please enter a valid email.'
    }
    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    try {
      const data = await loginWithCredentials(formData)
      if (data && 'error' in data) {
        const dataError = data.error.split('.')[0]

        if (dataError.startsWith('Read more')) {
          unexpectedError()
        } else if (dataError === 'Token sent') {
          router?.push('/token-sent')
          return
        } else if (dataError === 'Invalid credentials') {
          setErrors({
            email: true,
            password: 'Credenciais inválidas'
          })
        } else if (dataError === 'NEXT_REDIRECT') {
          router?.push('/diets')
          return
        } else {
          setErrors({
            email: true,
            password: dataError
          })
        }
      }
    } catch (error) {
      console.error(error)
      unexpectedError()
    }

    function unexpectedError() {
      setErrors({
        email: true,
        password: 'Um erro inesperado ocorreu 😢'
      })
    }
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
          errorText={true}
          // função pra caso senha menor que 8 erro senha muito curta
        />

        <AuthButton actionText='Login' className='mt-2' />
      </form>
    </div>
  )
}
