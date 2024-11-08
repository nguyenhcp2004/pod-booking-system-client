import { Button, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import { Link, Outlet } from 'react-router-dom'
import loginBanner from '~/assets/images/loginBanner.jpg'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function RegisterLayout() {
  return (
    <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: '1 1', overflow: 'auto', position: 'relative' }}>
        <Button
          component={Link}
          to='/'
          startIcon={<ArrowBackIcon />}
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 24 },
            zIndex: 1,
            backgroundColor: 'white'
          }}
        >
          Back to Home
        </Button>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            justifyContent: 'space-between',
            gap: 0,
            p: { xs: 2, md: 0 },
            m: 'auto',
            height: { xs: '100%' }
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              width: '52vw',
              height: { xs: 'auto', md: '100%' },
              backgroundImage: `url(${loginBanner})`,
              backgroundSize: 'cover'
            }}
          />
          <Outlet />
        </Stack>
      </Box>
    </Box>
  )
}
