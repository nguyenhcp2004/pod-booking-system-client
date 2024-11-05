import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  LogoutResType,
  RefreshTokenBodyType,
  RefreshTokenResType
} from '~/schemaValidations/auth.schema'
import http from '~/utils/http'

const authApiRequest = {
  // Ý tưởng tạo là mình sẽ tạo 1 promise để lưu request refresh token
  // Khi đó interval vào check refresh token thì mình sẽ kiểm tra theo cái promise này
  refreshTokenRequest: null as Promise<{
    status: number
    data: RefreshTokenResType
  }> | null,
  login: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  async refreshToken(body: RefreshTokenBodyType) {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>('/auth/refresh-token', body)
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  },
  logout: (body: LogoutBodyType) => http.post<LogoutResType>('/auth/logout', body),
  register: (body: { email: string; name: string; password: string }) => http.post('/auth/register', body)
}

export default authApiRequest
