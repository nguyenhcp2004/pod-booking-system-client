import queryString from 'query-string'
import { GetManageAccountQuery, GetManageAccountRes, GetMeResType } from '~/schemaValidations/account.schema'
import http from '~/utils/http'

const accountApiRequest = {
  getMe: () => http.get<GetMeResType>('/accounts/me'),
  getListAccounts: (query: GetManageAccountQuery) => {
    const stringified = queryString.stringify(query)
    return http.get<GetManageAccountRes>(`/accounts?${stringified}`)
  }
}

export default accountApiRequest
