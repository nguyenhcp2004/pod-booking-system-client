import Box from '@mui/material/Box'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { tokens } from '~/themes/theme'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import ApartmentIcon from '@mui/icons-material/Apartment'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'

export default function NavItem() {
  const color = tokens('light')
  return (
    <>
      <Box
        to='/admin'
        component={Link}
        sx={{
          textDecoration: 'none',
          padding: '8px 12px 8px 16px',
          color: color.primary[500],
          transition: 'background-color 0.3s ease, color 0.3s ease',
          borderRadius: '6px', // thêm transition
          '&:hover': {
            backgroundColor: color.primary[50], // Thay đổi màu nền khi hover
            color: color.primary[500] // Thay đổi màu chữ khi hover
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2
          }}
        >
          <LeaderboardIcon sx={{ width: '24px', height: '24px' }} />
          <Typography variant='h6'>Dashboard</Typography>
        </Box>
      </Box>
      <Box
        component={Link}
        to='/admin/rooms'
        sx={{
          textDecoration: 'none',
          color: color.grey[300],
          padding: '8px 12px 8px 16px',
          transition: 'background-color 0.3s ease, color 0.3s ease',
          borderRadius: '6px', // thêm transition
          '&:hover': {
            backgroundColor: color.primary[50], // Thay đổi màu nền khi hover
            color: color.primary[500] // Thay đổi màu chữ khi hover
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <MeetingRoomIcon sx={{ width: '24px', height: '24px' }} />
          <Typography variant='h6'>Room</Typography>
        </Box>
      </Box>
      <Box
        component={Link}
        to='/admin/buildings'
        sx={{
          textDecoration: 'none',
          color: color.grey[300],
          padding: '8px 12px 8px 16px',
          transition: 'background-color 0.3s ease, color 0.3s ease',
          borderRadius: '6px', // thêm transition
          '&:hover': {
            backgroundColor: color.primary[50], // Thay đổi màu nền khi hover
            color: color.primary[500] // Thay đổi màu chữ khi hover
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ApartmentIcon sx={{ width: '24px', height: '24px' }} />
          <Typography variant='h6'>Building</Typography>
        </Box>
      </Box>
      <Box
        component={Link}
        to='/admin/buildings'
        sx={{
          textDecoration: 'none',
          color: color.grey[300],
          padding: '8px 12px 8px 16px',
          transition: 'background-color 0.3s ease, color 0.3s ease',
          borderRadius: '6px', // thêm transition
          '&:hover': {
            backgroundColor: color.primary[50], // Thay đổi màu nền khi hover
            color: color.primary[500] // Thay đổi màu chữ khi hover
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <AccessTimeFilledIcon sx={{ width: '24px', height: '24px' }} />
          <Typography variant='h6'>Slot</Typography>
        </Box>
      </Box>
      <Box
        component={Link}
        to='/admin/buildings'
        sx={{
          textDecoration: 'none',
          color: color.grey[300],
          padding: '8px 12px 8px 16px',
          transition: 'background-color 0.3s ease, color 0.3s ease',
          borderRadius: '6px', // thêm transition
          '&:hover': {
            backgroundColor: color.primary[50], // Thay đổi màu nền khi hover
            color: color.primary[500] // Thay đổi màu chữ khi hover
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FastfoodIcon sx={{ width: '24px', height: '24px' }} />
          <Typography variant='h6'>Amenity</Typography>
        </Box>
      </Box>
    </>
  )
}
