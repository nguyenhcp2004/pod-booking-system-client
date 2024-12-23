import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppContext } from '~/contexts/AppProvider'
import { setAccessTokenToLS, setAccountToLS, setRefreshTokenToLS } from '~/utils/auth'

export default function Oauth() {
  const { setAuth, redirectPath } = useAppContext()
  const count = useRef(0)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  const message = searchParams.get('message')
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        setAccessTokenToLS(accessToken)
        setRefreshTokenToLS(refreshToken)
        setAccountToLS(null)
        setAuth(true)
        setTimeout(() => {
          toast.success('Đăng nhập google thành công', {
            autoClose: 3000
          })
        })
        location.href = redirectPath
      }
      count.current++
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast.error(message || 'Có lỗi xảy ra', {
            autoClose: 3000
          })
        })
        navigate('/login')
      }
      count.current++
    }
  }, [accessToken, refreshToken, navigate, setAuth, message, redirectPath])
  return null
}
