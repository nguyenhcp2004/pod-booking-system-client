import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export default function Header() {
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
      </Box>
    </Box>
  )
}
