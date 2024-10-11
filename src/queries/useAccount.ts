import { useQuery } from '@tanstack/react-query'
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
