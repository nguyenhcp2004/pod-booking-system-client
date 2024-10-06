import Box from '@mui/material/Box'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { tokens } from '~/themes/theme'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import ApartmentIcon from '@mui/icons-material/Apartment'

export default function NavItem() {
  const color = tokens('light')
  return (
    <>
      <Link to='/admin' style={{ textDecoration: 'none', color: color.grey[300], padding: '8px 12px 8px 16px' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <LeaderboardIcon sx={{ width: '24px', height: '24px' }} />
          <Typography variant='h6'>Dashboard</Typography>
        </Box>
      </Link>
      <Link to='/admin/rooms' style={{ textDecoration: 'none', color: color.grey[300], padding: '8px 12px 8px 16px' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <MeetingRoomIcon sx={{ width: '24px', height: '24px' }} />
          <Typography variant='h6'>Room</Typography>
        </Box>
      </Link>
      <Link
        to='/admin/buildings'
        style={{ textDecoration: 'none', color: color.grey[300], padding: '8px 12px 8px 16px' }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ApartmentIcon sx={{ width: '24px', height: '24px' }} />
          <Typography variant='h6'>Building</Typography>
        </Box>
      </Link>
    </>
  )
}
