import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '~/constants/type'
export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const clearLS = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('accessToken') || ''
}

export const getRefreshTokenFromLS = () => localStorage.getItem('refreshToken') || ''

export const decodeToken = (token: string) => {
  return jwtDecode(token) as TokenPayload
}
