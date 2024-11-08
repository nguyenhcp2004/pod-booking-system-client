import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { GoogleIcon } from '~/components/CustomIcons/CustomIcon'
import envConfig from '~/constants/config'

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
export default function ForgotPassword() {
  return (
    <Card variant='outlined'>
      <Typography component='h1' variant='h4' sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
        Quên mật khẩu
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
        <Typography variant='subtitle1' sx={{ width: '100%' }}>
          Liên hệ với hệ thống để nhận được hỗ trợ
        </Typography>
        <Link to={'https://www.facebook.com/profile.php?id=61567752789181&locale=vi_VN'} target='_blank'>
          <Button type='submit' fullWidth variant='contained'>
            Liên hệ
          </Button>
        </Link>
      </Box>
      <Divider>hoặc</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          type='submit'
          fullWidth
          variant='outlined'
          href={envConfig.VITE_GOOGLE_AUTHORIZED_REDIRECT_URI}
          startIcon={<GoogleIcon />}
        >
          Đăng nhập với Google
        </Button>
      </Box>
    </Card>
  )
}
