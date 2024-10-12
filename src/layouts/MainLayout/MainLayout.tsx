import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Footer from '~/components/Footer'
import Header from '~/components/Header'

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
