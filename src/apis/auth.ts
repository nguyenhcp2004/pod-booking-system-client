import { LoginBodyType, LoginResType } from '~/schemaValidations/auth.schema'
import http from '~/utils/http'

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body)
}

export default authApiRequest
