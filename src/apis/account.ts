import queryString from 'query-string'
import { Pagination } from '~/constants/type'
import {
  CreateAccountBodyType,
  GetManageAccountRes,
  GetMeResType,
  SendMailBodyType,
  SendMailResType,
  UpdateAccountByAdminBodyType,
  UpdateAccountByAdminResType
} from '~/schemaValidations/account.schema'
import http from '~/utils/http'

const accountApiRequest = {
  getMe: () => http.get<GetMeResType>('/accounts/me'),
  getListAccounts: (query: Pagination) => {
    const stringified = queryString.stringify(query)
    return http.get<GetManageAccountRes>(`/accounts?${stringified}`)
  },
  updateAccountByAdmin: (body: UpdateAccountByAdminBodyType) => {
    return http.patch<UpdateAccountByAdminResType>(`/accounts/${body.id}`, body)
  },
  createAccount: (body: CreateAccountBodyType) => {
    return http.post<UpdateAccountByAdminResType>('/accounts', body)
  },
  sendMail: (body: SendMailBodyType) => http.post<SendMailResType>('/accounts/send-mail', body)
}

export default accountApiRequest
