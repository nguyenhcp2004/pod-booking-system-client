import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { FirebaseTokenType, LoginBody, LoginBodyType } from '~/schemaValidations/auth.schema'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginGoogleMutation, useLoginMutation } from '~/queries/useAuth'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { GoogleIcon } from '~/components/CustomIcons/CustomIcon'
import { handleErrorApi } from '~/utils/utils'
import { AppContext } from '~/contexts/AppProvider'
import { useContext } from 'react'
// import envConfig from '~/constants/config'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '~/utils/firebase'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
    minWidth: '350px'
  },
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px'
  })
}))

export default function Login() {
  const { setAuth, setAccount } = useContext(AppContext)
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLoginMutation()
  const loginGoogleMutation = useLoginGoogleMutation()

  const onSubmit = handleSubmit(async (data) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      setAuth(true)
      setAccount(result.data.data.account)
      toast.success(result.data.message, {
        autoClose: 3000
      })
      const redirectPath = location.state?.from || '/'
      navigate(redirectPath)
    } catch (error) {
      handleErrorApi({ error, setError })
    }
  })

  const handleCLick = async () => {
    try {
      // Mở popup đăng nhập Google
      const result = await signInWithPopup(auth, provider)

      // Kiểm tra và lấy thông tin người dùng từ Firebase
      const user = result.user
      console.log(user)

      const googleData = {
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL
      }

      console.log(googleData)

      const response = await loginGoogleMutation.mutateAsync(googleData as FirebaseTokenType)
      window.location.href = response.data.data.url
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Đăng nhập với Google thất bại. Vui lòng thử lại.')
    }
  }

  return (
    <Card variant='outlined'>
      <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
        Đăng nhập
      </Typography>
      <Box
        component='form'
        onSubmit={onSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor='email' sx={{ lineHeight: 1.5 }}>
            Email
          </FormLabel>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <TextField
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                id='email'
                type='email'
                placeholder='user@email.com'
                autoComplete='email'
                autoFocus
                required
                fullWidth
                variant='outlined'
                color={errors.email ? 'error' : 'primary'}
                sx={{ ariaLabel: 'email' }}
                size='small'
                {...field}
              />
            )}
          />
        </FormControl>

        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor='password' sx={{ lineHeight: 1.5 }}>
              Mật khẩu
            </FormLabel>
            <Link href='/forgot-password' variant='body2' sx={{ alignSelf: 'baseline', textDecoration: 'none' }}>
              Quên mật khẩu?
            </Link>
          </Box>

          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <TextField
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                placeholder='••••••'
                type='password'
                id='password'
                autoComplete='current-password'
                autoFocus
                required
                fullWidth
                variant='outlined'
                color={errors.password ? 'error' : 'primary'}
                size='small'
                {...field}
              />
            )}
          />
        </FormControl>
        <Button type='submit' fullWidth variant='contained'>
          Đăng nhập
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          Bạn mới biết đến chúng tôi ?
          <span>
            <Link href='/register' variant='body2' sx={{ alignSelf: 'center', marginLeft: 1, textDecoration: 'none' }}>
              Đăng kí
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>hoặc</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          type='submit'
          fullWidth
          variant='outlined'
          onClick={handleCLick}
          // href={envConfig.VITE_GOOGLE_AUTHORIZED_REDIRECT_URI}
          startIcon={<GoogleIcon />}
        >
          Đăng nhập với Google
        </Button>
      </Box>
    </Card>
  )
}
