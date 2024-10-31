/* eslint-disable @typescript-eslint/no-unused-expressions */

import axios, { AxiosError, HttpStatusCode } from 'axios'
import moment from 'moment'
import { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import authApiRequest from '~/apis/auth'
import { ErrorResponse } from '~/schemaValidations/auth.schema'
import { GetListBuidlingResType } from '~/schemaValidations/building.schema'
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

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosForbiddenError<ForbiddenError>(error: unknown): error is AxiosError<ForbiddenError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Forbidden
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

export const handleErrorApi = <T extends FieldValues>({
  error,
  setError
}: {
  error: unknown
  setError?: UseFormSetError<T>
  duration?: number
}) => {
  if (isAxiosUnprocessableEntityError<ErrorResponse<T>>(error) && setError) {
    const formError = error.response?.data.data
    if (formError) {
      Object.keys(formError).forEach((key) => {
        setError(key as Path<T>, {
          message: formError[key as keyof T] as string,
          type: 'Server'
        })
      })
    }
  }
}

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)'
} as const

type BuildingFilterProps = {
  // inputData: BuildingProps[] | []
  inputData: GetListBuidlingResType['data']
  filterName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comparator: (a: any, b: any) => number
}

export function applyFilter({ inputData, comparator, filterName }: BuildingFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const)

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  inputData = stabilizedThis.map((el) => el[0])

  if (filterName) {
    inputData = inputData.filter((building) => building.address.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
  }

  return inputData
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (
  a: {
    [key in Key]: number | string
  },
  b: {
    [key in Key]: number | string
  }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0
}

export const formatStartEndTime = (start: string, end: string) => {
  const startFormatted = moment(start).format('HH:mm DD/MM/YYYY')
  const endFormatted = moment(end).format('HH:mm DD/MM/YYYY')
  return `${startFormatted} -> ${endFormatted}`
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export const formatDateAndSlot = ({ date, timeSlot }: { date: string; timeSlot: string }) => {
  const startTime = timeSlot.split(' - ')[0]
  const dateTime = moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm')
  return dateTime.format('YYYY-MM-DDTHH:mm:ss')
}

export const formatQueryDateTime = (startTime: string, endTime: string) => {
  const formatDate = (date: string) => {
    return date.replace(/\s/g, ' ')
  }

  const startTimeUrl = formatDate(startTime as string)
  const endTimeUrl = formatDate(endTime as string)

  const queryString = `startTime=${startTimeUrl}&endTime=${endTimeUrl}`
  return queryString
}

export const getMonthNumber = (dateString: string) => {
  const date = new Date(dateString)
  return date.getMonth() + 1
}

export const getWeekdayNumber = (dateString: string) => {
  const date = new Date(dateString)
  const dayNumber = date.getDay()
  if (dayNumber === 0) {
    return 'CN'
  }

  return dayNumber + 1
}

export const getDayNumber = (dateString: string) => {
  const date = new Date(dateString)
  return date.getDate() // Trả về số ngày trong tháng
}

export const getHour = (dateString: string) => {
  return moment(dateString).format('HH') // Kết quả là "07"
}

export function isValidVietnamPhoneNumber(phoneNumber: string): boolean {
  // Regular expression for valid Vietnam phone numbers
  const vietnamPhoneNumberRegex = /^(03|05|07|08|09)[0-9]{8}$/
  return vietnamPhoneNumberRegex.test(phoneNumber)
}

export const getDayBefore = (dateString: string) => {
  return moment(dateString).subtract(1, 'days').format('DD')
}
