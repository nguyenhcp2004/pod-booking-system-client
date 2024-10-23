import axios, { AxiosInstance, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import envConfig from '~/constants/config'
import { AuthResponse, ErrorResponse } from '~/schemaValidations/auth.schema'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setAccountToLS,
  setRefreshTokenToLS
} from '~/utils/auth'
import { isAxiosUnauthorizedError } from '~/utils/utils'

export class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.instance = axios.create({
      baseURL: envConfig.VITE_API_ENDPOINT,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers && config.url !== '/auth/refresh-token') {
          config.headers.Authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/auth/login' || url === '/auth/register') {
          const data = response.data as AuthResponse
          this.accessToken = data.data.accessToken
          this.refreshToken = data.data.refreshToken
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setAccountToLS(data.data.account)
        } else if (url === '/auth/logout') {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      (error) => {
        //Chỉ toast lỗi không phải 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // - Token không đúng
        // - Không truyền token
        // - Token hết hạn*

        //Nếu là lỗi 401
        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || { headers: {}, url: '' }
          const { url } = config
          // Trường hợp Token hết hạn và request đó không phải là của request refresh token
          // Tiến hành qua page refresh token
          if (url !== '/auth/refresh-token') {
            return (window.location.href = `/refresh-token?refreshToken=${this.refreshToken}&redirect=/`)
          }
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
