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
import GoogleIcon from '@mui/icons-material/Google'
import { useState } from 'react'

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

export default function Login() {
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log({
      email: data.get('email'),
      password: data.get('password')
    })
  }

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement
    const password = document.getElementById('password') as HTMLInputElement

    let isValid = true

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage('Please enter a valid email address.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage('Password must be at least 6 characters long.')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    return isValid
  }

  return (
    <Card variant='outlined'>
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>abc</Box>
      <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
        Đăng nhập
      </Typography>
      <Box
        component='form'
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor='email' sx={{ lineHeight: 1.5 }}>
            Email
          </FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id='email'
            type='email'
            name='email'
            placeholder='user@email.com'
            autoComplete='email'
            autoFocus
            required
            fullWidth
            variant='outlined'
            color={emailError ? 'error' : 'primary'}
            sx={{ ariaLabel: 'email' }}
            size='small'
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor='password' sx={{ lineHeight: 1.5 }}>
              Mật khẩu
            </FormLabel>
            <Link component='button' variant='body2' sx={{ alignSelf: 'baseline' }}>
              Quên mật khẩu?
            </Link>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name='password'
            placeholder='••••••'
            type='password'
            id='password'
            autoComplete='current-password'
            autoFocus
            required
            fullWidth
            variant='outlined'
            color={passwordError ? 'error' : 'primary'}
            size='small'
          />
        </FormControl>
        <Button type='submit' fullWidth variant='contained' onClick={validateInputs}>
          Đăng nhập
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          Bạn mới biết đến chúng tôi ?
          <span>
            <Link
              href='/material-ui/getting-started/templates/sign-in/'
              variant='body2'
              sx={{ alignSelf: 'center', marginLeft: 1 }}
            >
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
          href='/oauth2/authorization/google'
          startIcon={<GoogleIcon />}
        >
          Đăng nhập với Google
        </Button>
      </Box>
    </Card>
  )
}
