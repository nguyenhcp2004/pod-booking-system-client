import {
  CreateAccountBodyType,
  GetManageAccountRes,
  GetMeResType,
  UpdateAccountByAdminBodyType,
  UpdateAccountByAdminResType
} from '~/schemaValidations/account.schema'
import http from '~/utils/http'

const accountApiRequest = {
  getMe: () => http.get<GetMeResType>('/accounts/me'),
  getListAccounts: () => {
    return http.get<GetManageAccountRes>(`/accounts?take=25`)
  },
  updateAccountByAdmin: (body: UpdateAccountByAdminBodyType) => {
    return http.patch<UpdateAccountByAdminResType>(`/accounts/${body.id}`, body)
  },
  createAccount: (body: CreateAccountBodyType) => {
    return http.post<CreateAccountBodyType>('/accounts', body)
  }
}

export default accountApiRequest
