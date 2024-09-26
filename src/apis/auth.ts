import { LoginBodyType, LoginResType, RefreshTokenBodyType, RefreshTokenResType } from '~/schemaValidations/auth.schema'
import http from '~/utils/http'

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number
    data: RefreshTokenResType
  }> | null,
  login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  refreshToken(body: RefreshTokenBodyType) {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>('/auth/refresh-token', body)
    return this.refreshTokenRequest
  }
}

export default authApiRequest
