import { Container, Paper, Typography, Avatar, Box, Chip, LinearProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccountBalance as AccountBalanceIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material'
import { useAppContext } from '~/contexts/AppProvider'

interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string | number
}

export default function UserProfile() {
  const { account } = useAppContext()

  // Calculate progress for the next rank (assuming 1000 points per rank)
  let progressToNextRank = 0
  if (account) {
    progressToNextRank = (account.point % 1000) / 10
  }

  const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
    <Box display='flex' alignItems='center' mb={2}>
      {icon}
      <Box ml={2}>
        <Typography variant='body2' color='textSecondary'>
          {label}
        </Typography>
        <Typography variant='body1'>{value}</Typography>
      </Box>
    </Box>
  )

  return (
    account && (
      <Container maxWidth='md'>
        <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
          <Box display='flex' justifyContent='space-between' alignItems='flex-start' mb={4}>
            <Typography variant='h4' component='h1' gutterBottom>
              Hồ sơ người dùng
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box display='flex' flexDirection='column' alignItems='center'>
                <Avatar
                  src={account.avatar || '/placeholder.svg?height=200&width=200'}
                  alt={account.name}
                  sx={{ width: 200, height: 200, mb: 2 }}
                />
                <Typography variant='h5' gutterBottom>
                  {account.name}
                </Typography>
                <Chip icon={<EmojiEventsIcon />} label={account.rankingName} color='primary' sx={{ mt: 1 }} />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <InfoItem icon={<EmailIcon color='primary' />} label='Email' value={account.email} />
              <InfoItem icon={<PhoneIcon color='primary' />} label='Số điện thoại' value={account.phoneNumber} />
              <InfoItem
                icon={<AccountBalanceIcon color='primary' />}
                label='Số dư tài khoản'
                value={`${account.balance.toLocaleString()} VND`}
              />

              <Box mt={4}>
                <Typography variant='h6' gutterBottom>
                  Điểm tích lũy
                </Typography>
                <Box display='flex' alignItems='center'>
                  <Typography variant='body1' mr={2}>
                    {account.point} điểm
                  </Typography>
                  <Box flexGrow={1}>
                    <LinearProgress
                      variant='determinate'
                      value={progressToNextRank}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                </Box>
                <Typography variant='body2' color='textSecondary' mt={1}>
                  {1000 - (account.point % 1000)} điểm nữa để lên hạng tiếp theo
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    )
  )
}
