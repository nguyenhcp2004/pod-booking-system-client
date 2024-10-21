import Box from '@mui/material/Box'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { Typography } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { tokens } from '~/themes/theme'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import ApartmentIcon from '@mui/icons-material/Apartment'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PaymentsIcon from '@mui/icons-material/Payments'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'

const iconSx = {
  width: '24px',
  height: '24px'
}

const menuItems = [
  {
    title: 'Tổng quan',
    to: '/admin/dashboard',
    icon: <LeaderboardIcon sx={iconSx} />
  },
  {
    title: 'Hóa đơn',
    to: '/admin/orders',
    icon: <PaymentsIcon sx={iconSx} />
  },
  {
    title: 'Hóa đơn tiện ích',
    to: '/admin/amenity-orders',
    icon: <ShoppingCartCheckoutIcon sx={iconSx} />
  },
  {
    title: 'Phòng',
    to: '/admin/rooms',
    icon: <MeetingRoomIcon sx={iconSx} />
  },
  {
    title: 'Chi nhánh',
    to: '/admin/buildings',
    icon: <ApartmentIcon sx={iconSx} />
  },
  {
    title: 'Slot',
    to: '/admin/slots',
    icon: <AccessTimeFilledIcon sx={iconSx} />
  },
  {
    title: 'Tiện ích',
    to: '/admin/amenities',
    icon: <FastfoodIcon sx={iconSx} />
  },
  {
    title: 'Tài khoản',
    to: '/admin/users',
    icon: <PeopleAltIcon sx={iconSx} />
  }
]

export default function NavItem() {
  const color = tokens('light')
  const { pathname } = useLocation()
  return (
    <>
      {menuItems.map((item) => (
        <Box
          component={Link}
          to={item.to}
          key={item.title}
          sx={{
            textDecoration: 'none',
            color: pathname === item.to ? color.primary[500] : color.grey[300],
            padding: '8px 12px 8px 16px',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: color.primary[50],
              color: color.primary[500]
            }
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            {item.icon}
            <Typography variant='h6'>{item.title}</Typography>
          </Box>
        </Box>
      ))}
    </>
  )
}
