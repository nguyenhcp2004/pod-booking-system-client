import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '~/constants/type'
import { AccountType } from '~/schemaValidations/auth.schema'

export const LocalStorageEventTarget = new EventTarget()
export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRedirectPath = (path: string) => {
  localStorage.setItem('redirectPath', path)
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const setAccountToLS = (account: AccountType | null) => {
  localStorage.setItem('account', JSON.stringify(account))
}

export const clearLS = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('account')
  localStorage.removeItem('bookingData')
  localStorage.removeItem('bookedRoom')
  localStorage.removeItem('bookingAmenities')
  localStorage.removeItem('roomTypeFilterStateLandingPage')
  localStorage.removeItem('redirectPath')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('accessToken') || ''
}

export const getRefreshTokenFromLS = () => localStorage.getItem('refreshToken') || ''

export const getAccountFromLS = () => {
  const result = localStorage.getItem('account')
  return result ? JSON.parse(result) : null
}

export const getRedirectPath = () => {
  return localStorage.getItem('redirectPath') || '/'
}

export const decodeToken = (token: string) => {
  return jwtDecode(token) as TokenPayload
}
