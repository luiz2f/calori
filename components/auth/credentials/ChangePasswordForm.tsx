'use client'
import { changePasswordByEmail } from '@/actions/auth'
import AuthButton from '@/components/auth/AuthButton'
import NavAnchor from '@/components/ui/NavAnchor'
import PasswordInput from '@/components/ui/PasswordInput'
import { useState } from 'react'

interface ResetPasswordFormProps {
  userEmail: string
}

// FORM A SER EXIBIDO CASO O TOKEN DO RESETPASSWORD SEJA VALIDO
export default function ChangePasswordForm({
  userEmail
}: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const { newPassword, confirmNewPassword } = Object.fromEntries(
      formData
    ) as Record<string, string>
    if (newPassword !== confirmNewPassword) {
      setError('As senhas não coincidem')
      return // Retorna sem fazer o login
    }

    if (!newPassword || newPassword?.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.')
      return // Retorna sem fazer o login
    }

    try {
      const data = await changePasswordByEmail(userEmail, formData)
      if ('success' in data) {
        setSuccess(data.success)
      }
      if ('error' in data) {
        setError(data.error)
      }
    } catch (error) {
      console.error(error)
      setError('Um erro inesperado ocorreu 😢')
    }
  }
  return (
    <div className='flex flex-col w-full p-4  mt-20 '>
      {!success ? (
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 w-11/12 mx-auto'
        >
          <h1 className='text-2xl w-full text-center font-bold mb-2'>
            Alterar Senha
          </h1>

          <PasswordInput
            id='currentPassword'
            placeholder='Senha Atual'
            error={error}
            errorText={true}
          />
          <PasswordInput
            id='newPassword'
            placeholder='Nova Senha'
            error={error}
            newPassword={true}
          />
          <PasswordInput
            id='confirmNewPassword'
            placeholder='Confirmar Nova Senha'
            error={error}
            newPassword={true}
          />

          <AuthButton actionText='Alterar senha' />
        </form>
      ) : (
        <>
          <h1 className='text-2xl w-full text-center font-bold mt-4 mb-2'>
            Senha Alterada com Sucesso!
          </h1>
          <NavAnchor href='/diets'>&lt; Voltar para Login</NavAnchor>
        </>
      )}
    </div>
  )
}
