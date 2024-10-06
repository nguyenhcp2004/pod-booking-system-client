import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import AdminHeader from '~/components/AdminHeader/AdminHeader'
import AdminSideBar from '~/components/AdminSidebar/AdminSideBar'

export default function AdminLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box>
        <AdminSideBar />
      </Box>
      <Box sx={{ flex: 1, height: '100vh', overflow: 'auto' }}>
        <AdminHeader />
        <Box padding={'8px 40px 64px'} height={'100%'}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}