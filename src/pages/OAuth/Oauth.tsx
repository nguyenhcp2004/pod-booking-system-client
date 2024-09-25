import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppContext } from '~/contexts/AppProvider'
import { setAccessTokenToLS, setRefreshTokenToLS } from '~/utils/auth'

export default function Oauth() {
  const { setAuth } = useAppContext()
  const count = useRef(0)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        setAccessTokenToLS(accessToken)
        setRefreshTokenToLS(refreshToken)
        setAuth(true)
        toast.success('Đăng nhập google thành công', {
          autoClose: 3000
        })
        navigate('/')
      }
      count.current++
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast.error('Có lỗi xảy ra', {
            autoClose: 3000
          })
        })
        navigate('/login')
      }
      count.current++
    }
  }, [accessToken, refreshToken, navigate, setAuth])
  return null
}
