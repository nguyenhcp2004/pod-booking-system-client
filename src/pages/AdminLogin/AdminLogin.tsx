import { TextField, Button, Typography, Container, Box, Card, Avatar, useTheme } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useAppContext } from '~/contexts/AppProvider'
import { Controller, useForm } from 'react-hook-form'
import { LoginBody, LoginBodyType } from '~/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '~/queries/useAuth'
import { toast } from 'react-toastify'
import { handleErrorApi } from '~/utils/utils'

export default function AdminLogin() {
  const { setAuth, setAccount } = useAppContext()
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
  const loginMutation = useLoginMutation()
  const theme = useTheme()

  const onSubmit = handleSubmit(async (data) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      setAuth(true)
      setAccount(result.data.data.account)
      toast.success(result.data.message, {
        autoClose: 3000
      })
      navigate('/admin/dashboard')
    } catch (error) {
      handleErrorApi({ error, setError })
    }
  })

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default
      }}
    >
      <Container component='main' maxWidth='xs'>
        <Card
          sx={{
            mt: 8,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'fadeIn 1s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(-20px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            },
            border: `1px solid ${theme.palette.primary.main}`,
            borderRadius: '16px'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h4' sx={{ mb: 3 }}>
            Đăng nhập FlexiPod
          </Typography>
          <Box component='form' onSubmit={onSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <Controller
              control={control}
              name='email'
              render={({ field }) => (
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='email'
                  label='Email'
                  autoComplete='email'
                  autoFocus
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                  size='small'
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name='password'
              render={({ field }) => (
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  label='Mật khẩu'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  size='small'
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  sx={{ mb: 2 }}
                  {...field}
                />
              )}
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{
                mt: 3,
                mb: 2,
                height: '48px',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 20px 0 ${theme.palette.primary.main}40`
                },
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`
              }}
            >
              Sign In
            </Button>
          </Box>
        </Card>
        <Typography variant='body2' color='text.secondary' align='center' sx={{ mt: 5 }}>
          {'Copyright © FlexiPod '}
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  )
}
