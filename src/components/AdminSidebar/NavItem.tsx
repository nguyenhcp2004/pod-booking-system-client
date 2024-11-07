import Box from '@mui/material/Box'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import { Typography } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { tokens } from '~/themes/theme'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import ApartmentIcon from '@mui/icons-material/Apartment'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PaymentsIcon from '@mui/icons-material/Payments'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
// import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences'
import { useAppContext } from '~/contexts/AppProvider'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

const iconSx = {
  width: '24px',
  height: '24px'
}

const menuItems = [
  {
    title: 'Tổng quan',
    to: '/admin/dashboard',
    icon: <LeaderboardIcon sx={iconSx} />,
    role: ['Admin']
  },
  {
    title: 'Hóa đơn',
    to: '/admin/orders',
    icon: <PaymentsIcon sx={iconSx} />,
    role: ['Admin', 'Staff', 'Manager']
  },
  {
    title: 'Hóa đơn tiện ích',
    to: '/admin/amenity-orders',
    icon: <ShoppingCartCheckoutIcon sx={iconSx} />,
    role: ['Admin', 'Staff', 'Manager']
  },
  {
    title: 'Phòng',
    to: '/admin/rooms',
    icon: <MeetingRoomIcon sx={iconSx} />,
    role: ['Admin', 'Manager']
  },
  // {
  //   title: 'Loại phòng',
  //   to: '/admin/room-types',
  //   icon: <RoomPreferencesIcon sx={iconSx} />,
  //   role: ['Admin', 'Manager']
  // },
  {
    title: 'Chi nhánh',
    to: '/admin/buildings',
    icon: <ApartmentIcon sx={iconSx} />,
    role: ['Admin']
  },
  {
    title: 'Dịch vụ',
    to: '/admin/amenities',
    icon: <FastfoodIcon sx={iconSx} />,
    role: ['Admin', 'Manager']
  },
  {
    title: 'Tài khoản',
    to: '/admin/users',
    icon: <PeopleAltIcon sx={iconSx} />,
    role: ['Admin', 'Manager', 'Staff']
  },
  {
    title: 'Giao Việc',
    to: '/admin/assignments',
    icon: <CalendarMonthIcon sx={iconSx} />,
    role: ['Admin', 'Manager']
  }
]

export default function NavItem() {
  const color = tokens('light')
  const { account } = useAppContext()
  const { pathname } = useLocation()
  return (
    <>
      {menuItems.map((item) => {
        if (item.role.includes(account?.role as string)) {
          return (
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
          )
        }
      })}
    </>
  )
}
