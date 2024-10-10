import { useQuery } from '@tanstack/react-query'
import accountApiRequest from '~/apis/account'
import { GetManageAccountQuery } from '~/schemaValidations/account.schema'

export const useGetMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.getMe
  })
}

export const useGetManageAccount = (query: GetManageAccountQuery) => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountApiRequest.getListAccounts(query)
  })
}
