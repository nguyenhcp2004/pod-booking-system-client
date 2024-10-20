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
      <Box sx={{ flex: 1, height: '100vh', overflow: 'auto', backgroundColor: '#F9FAFB' }}>
        <AdminHeader />
        <Box padding={'8px 40px 64px'}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
