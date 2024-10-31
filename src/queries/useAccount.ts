import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import accountApiRequest from '~/apis/account'
import { Pagination } from '~/constants/type'
import { CountCustomerReqType } from '~/schemaValidations/account.schema'

export const useGetMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.getMe
  })
}

export const useGetManageAccount = (query: Pagination) => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountApiRequest.getListAccounts(query)
  })
}

export const useUpdateAccountByAdmin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.updateAccountByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['update-accounts'] })
    }
  })
}

export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['create-accounts'] })
    }
  })
}

export const useSendMailMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.sendMail
  })
}

export const useSendMailOrderMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.sendMailOrder
  })
}

export const useCountCurrentCustomer = () => {
  return useQuery({
    queryKey: ['count-current-customers'],
    queryFn: () => accountApiRequest.countCurrentCustomer()
  })
}

export const useCountCustomer = (query: CountCustomerReqType) => {
  return useQuery({
    queryKey: ['count-customers', query],
    queryFn: () => accountApiRequest.countCustomer(query),
    enabled: !!query.startTime && !!query.endTime
  })
}
