import { GetManageAccountRes, GetMeResType } from '~/schemaValidations/account.schema'
import http from '~/utils/http'

const accountApiRequest = {
  getMe: () => http.get<GetMeResType>('/accounts/me'),
  getListAccounts: () => {
    return http.get<GetManageAccountRes>(`/accounts?take=25`)
  }
}

export default accountApiRequest
