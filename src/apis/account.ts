import queryString from 'query-string'
import { PaginationSearchQuery } from '~/constants/type'
import {
  CountCustomerReqType,
  CountCustomerResType,
  CreateAccountBodyType,
  GetListStaffResType,
  GetManageAccountRes,
  GetMeResType,
  SendMailBodyType,
  SendMailResType,
  UpdateAccountByAdminBodyType,
  UpdateAccountByAdminResType,
  UpdateAccountPhoneNumberType,
  UpdateBalanceType
} from '~/schemaValidations/account.schema'
import { GetAssignmentsQueryType } from '~/schemaValidations/assignment.schema'
import http from '~/utils/http'
import { formatQueryDateTime } from '~/utils/utils'

const accountApiRequest = {
  getMe: () => http.get<GetMeResType>('/accounts/me'),
  getListAccounts: (query: PaginationSearchQuery) => {
    const stringified = queryString.stringify(query)
    return http.get<GetManageAccountRes>(`/accounts?${stringified}`)
  },
  updateAccountByAdmin: (body: UpdateAccountByAdminBodyType) => {
    return http.patch<UpdateAccountByAdminResType>(`/accounts/${body.id}`, body)
  },
  updateAccountPhoneNumber: (body: UpdateAccountPhoneNumberType) => {
    return http.patch<UpdateAccountByAdminResType>(`/accounts/phoneNumber`, body)
  },
  updateBalance: (query: UpdateBalanceType) => {
    return http.patch(`/accounts/balance`, query)
  },
  createAccount: (body: CreateAccountBodyType) => {
    return http.post<UpdateAccountByAdminResType>('/accounts', body)
  },
  sendMail: (body: SendMailBodyType) => http.post<SendMailResType>('/accounts/send-email', body),
  sendMailOrder: (body: { email: string; orderId: string }) =>
    http.post<SendMailResType>('/accounts/send-email-order', body),
  sendMailOrderAmenity: (body: { email: string; orderDetailId: string }) =>
    http.post<SendMailResType>('/accounts/send-email-order-amenity', body),
  countCurrentCustomer: () => http.get<CountCustomerResType>('/accounts/number-accounts-current-day'),
  countCustomer: (query: CountCustomerReqType) => {
    const queryString = formatQueryDateTime(query.startTime as string, query.endTime as string)
    return http.get<CountCustomerResType>(`/accounts/number-accounts?${queryString}`)
  },
  getListStaff: (query: GetAssignmentsQueryType) => {
    const stringified = queryString.stringify(query)
    return http.get<GetListStaffResType>(`/accounts/staff?${stringified}`)
  }
}

export default accountApiRequest
