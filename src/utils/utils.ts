/* eslint-disable @typescript-eslint/no-unused-expressions */
import axios, { AxiosError, HttpStatusCode } from 'axios'
import authApiRequest from '~/apis/auth'
import {
  clearLS,
  decodeToken,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '~/utils/auth'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export const checkAndRefreshToken = async (param?: {
  onSuccess?: () => void
  onError?: () => void
  force?: boolean
}) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
  // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì mình sẽ có một access và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLS()
  // Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)

  const decodedRefreshToken = decodeToken(refreshToken)
  // Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi mình dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  // Khi set cookie với expires thì sẽ bị lệch khoảng từ 0 - 1000ms nên để an toàn thì ta trừ hẳn 1s
  const now = new Date().getTime() / 1000 - 1 // second
  // trường hợp refresh token hết hạn thì không xử lý nữa
  if (decodedRefreshToken.exp <= now) {
    clearLS()
    return param?.onError && param.onError()
  }
  // Ví dụ access token của mình có thời gian hết hạn là 10s
  // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
  if (param?.force || decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    // Gọi API refresh token
    try {
      const res = await authApiRequest.refreshToken({ refreshToken })
      setAccessTokenToLS(res.data.data.accessToken)
      setRefreshTokenToLS(res.data.data.refreshToken)
      param?.onSuccess && param.onSuccess()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      param?.onError && param.onError()
    }
  }
}
