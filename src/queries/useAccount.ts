import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import accountApiRequest from '~/apis/account'

export const useGetMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.getMe
  })
}

export const useGetManageAccount = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountApiRequest.getListAccounts()
  })
}

export const useUpdateAccountByAdmin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.updateAccountByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    }
  })
}

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    }
  })
}
