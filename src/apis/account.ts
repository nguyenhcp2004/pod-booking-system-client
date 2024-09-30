import { GetMeResType } from '~/schemaValidations/account.schema'
import http from '~/utils/http'

const accountApiRequest = {
  getMe: () => http.get<GetMeResType>('/accounts/me')
}

export default accountApiRequest
