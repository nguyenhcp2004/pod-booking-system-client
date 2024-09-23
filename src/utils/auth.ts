export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken)
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refresh_token', refreshToken)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('accessToken') || ''
}

export const getRefreshTokenFromLS = () => localStorage.getItem('refreshToken') || ''
