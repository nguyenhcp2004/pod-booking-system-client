import { Button, Typography, Box } from '@mui/material'
import { tokens } from '~/themes/theme'

export default function Footer() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: { xs: 'auto', md: '120px' },
        padding: { xs: '24px', md: '24px 104px' },
        alignItems: { xs: 'center', md: 'flex-start' },
        justifyContent: 'space-between',
        backgroundColor: (theme) => theme.palette.primary.main
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
          marginBottom: { xs: '24px', md: '0' }
        }}
      >
        <Typography
          variant='h3'
          sx={{
            fontWeight: '700',
            color: tokens('light').primary[50],
            fontSize: { xs: '28px', md: '39px' },
            lineHeight: '120%',
            marginBottom: '8px'
          }}
        >
          FlexiPod
        </Typography>
        <Typography
          sx={{
            fontWeight: '400',
            color: tokens('light').grey[50],
            fontSize: '12px',
            lineHeight: '120%'
          }}
        >
          Copyright © 2024
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 }
        }}
      >
        <Button
          sx={{
            textTransform: 'uppercase',
            lineHeight: '22px',
            letterSpacing: '0.46px',
            fontWeight: '500',
            color: tokens('light').grey[50],
            fontSize: { xs: '12px', sm: '14px' },
            whiteSpace: 'nowrap'
          }}
        >
          Điều khoản và điều kiện
        </Button>
        <Button
          sx={{
            textTransform: 'uppercase',
            lineHeight: '22px',
            letterSpacing: '0.46px',
            fontWeight: '500',
            color: tokens('light').grey[50],
            fontSize: { xs: '12px', sm: '14px' },
            whiteSpace: 'nowrap'
          }}
        >
          Thông báo về bảo mật
        </Button>
      </Box>
    </Box>
  )
}
