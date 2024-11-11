import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import accountApiRequest from '~/apis/account'
import { PaginationSearchQuery } from '~/constants/type'
import { CountCustomerReqType, UpdateAccountPhoneNumberType, UpdateBalanceType } from '~/schemaValidations/account.schema'
import { GetAssignmentsQueryType } from '~/schemaValidations/assignment.schema'

export const useGetMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.getMe
  })
}

export const useGetManageAccount = (query: PaginationSearchQuery) => {
  return useQuery({
    queryKey: ['accounts', { query }],
    queryFn: () => accountApiRequest.getListAccounts(query)
  })
}

export const useUpdateBalance = () => {
  return useMutation({
    mutationFn: (query: UpdateBalanceType) => accountApiRequest.updateBalance(query)
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

export const useUpdateAccountPhoneNumber = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (update: UpdateAccountPhoneNumberType) => accountApiRequest.updateAccountPhoneNumber(update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['update-accounts-phone'] })
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

export const useSendMailOrderAmenityMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.sendMailOrderAmenity
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

export const useGetListStaff = (query: GetAssignmentsQueryType) => {
  return useQuery({
    queryKey: ['staffs', { query }],
    queryFn: () => accountApiRequest.getListStaff(query)
  })
}
