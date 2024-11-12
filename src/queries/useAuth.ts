import { useMutation } from '@tanstack/react-query'
import authApiRequest from '~/apis/auth'

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login
  })
}

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.register
  })
}

export const useLoginGoogleMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.loginGoogle
  })
}
