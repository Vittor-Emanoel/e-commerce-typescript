import { AuthError, AuthErrorCodes, createUserWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiLogIn } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import validator from 'validator'
import { auth, db } from '../../config/firebase.config'
// Components
import CustomButton from '../../components/custom-button/custom-button.component'
import CustomInput from '../../components/custom-input/custom-input.component'
import Header from '../../components/header/header.components'
import ErrorMessage from '../../components/input-error/error-message.component'
import Loading from '../../components/loading/loading.component'

// Styles
import { UserContext } from '../../contexts/user.context'
import {
  SignUpContainer,
  SignUpContent,
  SignUpHeadline,
  SignUpInputContainer
} from './sign-up.styles'

interface SignUpForm {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
}

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm<SignUpForm>()

  const [isLoading, setIsLoading] = useState(false)

  // assistindo a um valor
  const watchPassword = watch('password')

  const { isAuthenticated } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])
  const handleSubmitPress = async (data: SignUpForm) => {
    try {
      setIsLoading(true)
      const userCredentials = await createUserWithEmailAndPassword(auth, data.email, data.password)

      await addDoc(collection(db, 'users'), {
        id: userCredentials.user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: userCredentials.user.email,
        provider: 'firebase'

      })
    } catch (error) {
      const _error = error as AuthError

      if (_error.code === AuthErrorCodes.EMAIL_EXISTS) {
        return setError('email', {
          type: 'alreadyInUse'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Header />

    {isLoading && <Loading />}
      <SignUpContainer>
        <SignUpContent>
          <SignUpHeadline>Crie sua conta</SignUpHeadline>

          <SignUpInputContainer>
            <p>Nome</p>
            <CustomInput
              hasError={!!errors?.firstName}
              placeholder="Digite seu nome"
              {...register('firstName', { required: true })}
            />

            {errors?.firstName?.type === 'required' && (
              <ErrorMessage>O nome ?? obrigat??rio.</ErrorMessage>
            )}
          </SignUpInputContainer>

          <SignUpInputContainer>
            <p>Sobrenome</p>
            <CustomInput
              hasError={!!errors?.lastName}
              placeholder="Digite seu sobrenome"
              {...register('lastName', { required: true })}
            />

            {errors?.lastName?.type === 'required' && (
              <ErrorMessage>O sobrenome ?? obrigat??rio.</ErrorMessage>
            )}
          </SignUpInputContainer>

          <SignUpInputContainer>
            <p>E-mail</p>
            <CustomInput
              hasError={!!errors?.email}
              placeholder="Digite seu e-mail"
              {...register('email', {
                required: true,
                validate: (value) => {
                  return validator.isEmail(value)
                }
              })}
            />

            {errors?.email?.type === 'required' && (
              <ErrorMessage>O e-mail ?? obrigat??rio.</ErrorMessage>
            )}

            {errors?.email?.type === 'validate' && (
              <ErrorMessage>
                Por favor, insira um e-mail v??lido.
              </ErrorMessage>
            )}
              {errors?.email?.type === 'alreadyInUse' && (
              <ErrorMessage>Est?? e-mail j?? est?? sendo ultilizado</ErrorMessage>
              )}

          </SignUpInputContainer>

          <SignUpInputContainer>
            <p>Senha</p>
            <CustomInput
              hasError={!!errors?.password}
              placeholder="Digite sua senha"
              type="password"
              {...register('password', { required: true, minLength: 6 })}
            />

            {errors?.password?.type === 'required' && (
              <ErrorMessage>A senha ?? obrigat??ria.</ErrorMessage>
            )}

             {errors?.password?.type === 'minLength' && (
              <ErrorMessage>A senha precisa ter no minimo 6 caracteres</ErrorMessage>
             )}

          </SignUpInputContainer>

          <SignUpInputContainer>
            <p>Confirma????o de Senha</p>

            <CustomInput
              hasError={!!errors?.passwordConfirmation}
              placeholder="Digite novamente sua senha"
              type="password"
              {...register('passwordConfirmation', {
                required: true,
                minLength: 6,
                validate: (value) => {
                  return value === watchPassword
                }
              })}
            />

            {errors?.passwordConfirmation?.type === 'required' && (
              <ErrorMessage>
                A confirma????o de senha ?? obrigat??ria.
              </ErrorMessage>
            )}

            {errors?.passwordConfirmation?.type === 'validate' && (
              <ErrorMessage>
                A confirma????o de senha precisa ser igual a senha.
              </ErrorMessage>
            )}
              {errors?.password?.type === 'minLength' && (
              <ErrorMessage>A senha precisa ter no minimo 6 caracteres</ErrorMessage>
              )}

          </SignUpInputContainer>

          <CustomButton
            onClick={() => handleSubmit(handleSubmitPress)()}
            startIcon={<FiLogIn size={18} />}>
            Criar Conta
          </CustomButton>
        </SignUpContent>
      </SignUpContainer>
    </div>
  )
}

export default SignUpPage
