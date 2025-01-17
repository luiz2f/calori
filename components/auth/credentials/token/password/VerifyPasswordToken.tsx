'use client'
import { verifyResetPasswordToken } from '@/actions/token'
import ErrorPage from '@/components/by-page/auth/ErrorPage'
import LoadingPage from '@/components/by-page/auth/LoadingPage'
import SuccessPage from '@/components/by-page/auth/SucessPage'
import NavButton from '@/components/ui/NavButton'
import Spinner from '@/components/ui/Spinner'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import ResetPasswordForm from './ResetPasswordForm'

// PÁGINA (EM COMPONENTE) QUE VERIFICA O TOKEN PELA PRIMEIRA VEZ
export default function VerifyPasswordToken() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)
  const [showForm, setShowForm] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  // const token = searchParams.get("token");
  const onSubmit = useCallback(async () => {
    if (success || error) {
      return
    }

    if (!token) {
      setError('Nenhum token fornecido')
      return
    }

    try {
      const data = await verifyResetPasswordToken(token)

      if (data && 'success' in data) {
        setSuccess(data.success)
      }
      if (data && 'error' in data) {
        setError(data.error)
      }
    } catch (error) {
      console.error(error)
      setError('Um erro inesperado ocorreu 😢')
    }
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setShowForm(true)
      }, 1000)
    }
  }, [success])

  return (
    <>
      {!error && !success && (
        <LoadingPage
          title='Verificando token'
          subtitle='Só alguns segundos 😉'
        ></LoadingPage>
      )}
      {success &&
        token &&
        (showForm ? (
          <ResetPasswordForm token={token} />
        ) : (
          <SuccessPage
            title='Token Verificado'
            subtitle='Você será redirecionado em instantes'
          >
            <Spinner />
          </SuccessPage>
        ))}
      {error &&
        (error == 'Invalid token' || error == 'Token has expired' ? (
          <ErrorPage
            title='Token Invalido'
            subtitle='Gere um novo token de verificação'
          >
            <NavButton href='/forgot-password'>Gerar Novo Token</NavButton>
          </ErrorPage>
        ) : (
          <ErrorPage title='Erro' subtitle={error}>
            <NavButton href='/login'>Voltar</NavButton>
          </ErrorPage>
        ))}
    </>
  )
}
