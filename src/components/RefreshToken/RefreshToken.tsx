import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { checkAndRefreshToken } from '~/utils/utils'

const UNAUTHENTICATED_PATH = ['/login', '/register', '/refresh-token']
export default function RefreshToken() {
  const location = useLocation()
  const pathName = location.pathname
  const navigate = useNavigate()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    const onRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
          navigate('/login')
        },
        force
      })
    }
    onRefreshToken()

    // Timeout interval phải bé hơn thời gian hết hạn của access token
    const TIMEOUT = 1000
    interval = setInterval(onRefreshToken, TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [pathName, navigate])

  return null
}
