import axios, { AxiosInstance } from 'axios'
import envConfig from '~/constants/config'
import { AuthResponse } from '~/schemaValidations/auth.schema'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setAccountToLS,
  setRefreshTokenToLS
} from '~/utils/auth'

export class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  // private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    // this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: envConfig.VITE_API_ENDPOINT,
      timeout: 30000,
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
        // //Chỉ toast lỗi không phải 422 và 401
        // if (
        //   ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        // ) {
        //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   const data: any | undefined = error.response?.data
        //   const message = data?.message || error.message
        //   toast.error(message)
        // }
        // // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // // - Token không đúng
        // // - Không truyền token
        // // - Token hết hạn*

        // //Nếu là lỗi 401
        // if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
        //   const config = error.response?.config || { headers: {}, url: '' }
        //   const { url } = config
        //   // Trường hợp Token hết hạn và request đó không phải là của request refresh token
        //   // Tiến hành gửi request refresh token
        //   if (url !== '/auth/refresh-token') {
        //     // Hạn chế gọi 2 lần handleRefreshToken
        //     this.refreshTokenRequest = this.refreshTokenRequest
        //       ? this.refreshTokenRequest
        //       : this.handleRefreshToken().finally(() => {
        //           // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
        //           setTimeout(() => {
        //             this.refreshTokenRequest = null
        //           }, 10000)
        //         })
        //     return this.refreshTokenRequest.then((access_token) => {
        //       // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
        //       return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
        //     })
        //   }

        //   // Còn những trường hợp như token không đúng
        //   // không truyền token,
        //   // token hết hạn nhưng gọi refresh token bị fail
        //   // thì tiến hành xóa local storage và toast message

        //   clearLS()
        //   this.accessToken = ''
        //   this.refreshToken = ''
        //   toast.error(error.response?.data.data?.message || error.response?.data.message)
        //   // window.location.reload()
        // }
        return Promise.reject(error)
      }
    )
  }

  // private handleRefreshToken() {
  //   return this.instance
  //     .post<RefreshTokenResType>('/auth/refresh-token', {
  //       refresh_token: this.refreshToken
  //     })
  //     .then((res) => {
  //       const { accessToken, refreshToken } = res.data.data
  //       setAccessTokenToLS(accessToken)
  //       setRefreshTokenToLS(refreshToken)
  //       this.refreshToken = refreshToken
  //       this.accessToken = accessToken
  //       return accessToken
  //     })
  //     .catch((error) => {
  //       clearLS()
  //       this.accessToken = ''
  //       this.refreshToken = ''
  //       throw error
  //     })
  // }
}

const http = new Http().instance

export default http
