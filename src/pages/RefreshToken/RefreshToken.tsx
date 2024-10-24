import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getRefreshTokenFromLS } from '~/utils/auth'
import { checkAndRefreshToken } from '~/utils/utils'

export default function RefreshToken() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPathname = searchParams.get('redirect')
  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLS()) {
      checkAndRefreshToken({
        onSuccess: () => {
          navigate(redirectPathname || '/')
        }
      })
    } else {
      navigate('/')
    }
  }, [navigate, refreshTokenFromUrl, redirectPathname])
  return <div>Refresh token....</div>
}
