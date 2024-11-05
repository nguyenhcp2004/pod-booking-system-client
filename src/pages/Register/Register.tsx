import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { Controller, useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { GoogleIcon } from '~/components/CustomIcons/CustomIcon'
import { toast } from 'react-toastify'
import { useRegisterMutation } from '~/queries/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterBody, RegisterBodyType } from '~/schemaValidations/auth.schema'
import Link from '@mui/material/Link'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import { useAppContext } from '~/contexts/AppProvider'
import { handleErrorApi } from '~/utils/utils'

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
    width: '450px'
  },
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px'
  })
}))
export default function Register() {
  const { setAuth, setAccount } = useAppContext()
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()

  const onSubmit = handleSubmit(async (data) => {
    if (registerMutation.isPending) return
    try {
      const result = await registerMutation.mutateAsync(data)
      setAuth(true)
      setAccount(result.data.data.account)
      toast.success('Chào mừng đến với FlexiPod', {
        autoClose: 3000
      })
      navigate('/')
    } catch (error) {
      handleErrorApi({ error, setError })
    }
  })
  return (
    <Card variant='outlined'>
      <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
        Đăng kí
      </Typography>
      <Box
        component='form'
        onSubmit={onSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor='name' sx={{ lineHeight: 1.5 }}>
            Tên
          </FormLabel>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <TextField
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                id='name'
                placeholder='Nguyen Van A'
                autoComplete='name'
                autoFocus
                required
                fullWidth
                variant='outlined'
                color={errors.name ? 'error' : 'primary'}
                sx={{ ariaLabel: 'name' }}
                size='small'
                {...field}
              />
            )}
          />
        </FormControl>
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
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor='confirmPassword' sx={{ lineHeight: 1.5 }}>
              Nhập lại mật khẩu
            </FormLabel>
          </Box>

          <Controller
            name='confirmPassword'
            control={control}
            render={({ field }) => (
              <TextField
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword?.message}
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
          Đăng kí
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          Bạn đã có tài khoản ?
          <span>
            <Link href='/login' variant='body2' sx={{ alignSelf: 'center', marginLeft: 1, textDecoration: 'none' }}>
              Đăng nhập
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
          href='http://localhost:8080/oauth2/authorization/google'
          startIcon={<GoogleIcon />}
        >
          Đăng nhập với Google
        </Button>
      </Box>
    </Card>
  )
}
