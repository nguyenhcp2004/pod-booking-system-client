import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Avatar, Stack } from '@mui/material'
import OptionsMenu from '~/components/OptionsMenu'
import { useAppContext } from '~/contexts/AppProvider'

export default function Header() {
  const { account } = useAppContext()
  return (
    <Box
      sx={{
        paddingX: '104px',
        paddingY: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        height: '92px',
        borderBottom: '1px solid #000'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <Typography
          variant='h3'
          sx={{ fontWeight: '700', color: 'primary.main', fontSize: '39px', lineHeight: '120%' }}
        >
          FlexiPod
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button
            sx={{
              textTransform: 'uppercase',
              paddingX: '11px',
              paddingY: '8px',
              lineHeight: '26px'
            }}
          >
            Trang chủ
          </Button>
          <Button sx={{ textTransform: 'uppercase', paddingX: '11px', paddingY: '8px', lineHeight: '26px' }}>
            Đơn đặt
          </Button>
          <Button sx={{ textTransform: 'uppercase', paddingX: '11px', paddingY: '8px', lineHeight: '26px' }}>
            Liên hệ
          </Button>
          <Button sx={{ textTransform: 'uppercase', paddingX: '11px', paddingY: '8px', lineHeight: '26px' }}>
            Về chúng tôi
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {account ? (
          <Stack
            direction='row'
            sx={{
              p: 1.2,
              gap: 1.2,
              alignItems: 'center',
              borderRadius: '8px',
              border: '1px solid #000'
            }}
          >
            <Avatar sizes='small' alt='RC' src={account?.avatar ?? undefined} sx={{ width: 36, height: 36 }}>
              {account?.name.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '120%' }}>{account?.name}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '10px', lineHeight: '120%' }}>
                {account?.email}
              </Typography>
            </Box>
            <OptionsMenu />
          </Stack>
        ) : (
          <>
            <Button
              variant='contained'
              sx={{
                textTransform: 'uppercase',
                paddingX: '22px',
                paddingY: '8px',
                borderRadius: '96px'
              }}
            >
              Đăng nhập
            </Button>
            <Button
              variant='outlined'
              sx={{
                textTransform: 'uppercase',
                paddingX: '22px',
                paddingY: '8px',
                borderRadius: '96px'
              }}
            >
              Đăng ký
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}
