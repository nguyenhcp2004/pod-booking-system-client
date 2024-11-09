import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Avatar, Stack, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material'
import OptionsMenu from '~/components/OptionsMenu'
import { useAppContext } from '~/contexts/AppProvider'
import { Link } from 'react-router-dom'
import accountApiRequest from '~/apis/account'
import { setAccountToLS } from '~/utils/auth'
import MenuIcon from '@mui/icons-material/Menu'

export default function Component() {
  const { account, setAccount, isAuth } = useAppContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (isAuth && !account) {
      accountApiRequest
        .getMe()
        .then((response) => {
          setAccount(response.data.data || null)
          setAccountToLS(response.data.data || null)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }, [account, setAccount, isAuth])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const menuItems = [
    { text: 'Trang chủ', link: '/' },
    { text: 'Liên hệ', link: '/contact-us' },
    { text: 'Về chúng tôi', link: '/about-us' }
  ]

  if (account) {
    menuItems.splice(1, 0, { text: 'Đơn đặt', link: '/history-orders' })
    menuItems.splice(1, 0, { text: 'Dịch vụ', link: '/order-amenity-detail/1' })
  }

  const renderMenuItems = () => (
    <>
      {menuItems.map((item) => (
        <Button
          key={item.text}
          component={Link}
          to={item.link}
          sx={{
            textTransform: 'uppercase',
            paddingX: '11px',
            paddingY: '8px',
            lineHeight: '26px'
          }}
        >
          {item.text}
        </Button>
      ))}
    </>
  )

  const renderAuthButtons = () => (
    <>
      <Button
        variant='contained'
        sx={{
          textTransform: 'uppercase',
          paddingX: { xs: '16px', md: '22px' },
          paddingY: '8px',
          borderRadius: '96px',
          fontSize: { xs: '12px', md: '14px' }
        }}
        component={Link}
        to='/login'
      >
        Đăng nhập
      </Button>
      <Button
        variant='outlined'
        sx={{
          textTransform: 'uppercase',
          paddingX: { xs: '16px', md: '22px' },
          paddingY: '8px',
          borderRadius: '96px',
          fontSize: { xs: '12px', md: '14px' }
        }}
        component={Link}
        to='/register'
      >
        Đăng ký
      </Button>
    </>
  )

  const renderMobileMenu = () => (
    <Drawer anchor='right' open={mobileMenuOpen} onClose={toggleMobileMenu}>
      <List sx={{ width: 250 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.link} onClick={toggleMobileMenu}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {!account && (
          <>
            <ListItem component={Link} to='/login' onClick={toggleMobileMenu}>
              <ListItemText primary='Đăng nhập' />
            </ListItem>
            <ListItem component={Link} to='/register' onClick={toggleMobileMenu}>
              <ListItemText primary='Đăng ký' />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  )

  return (
    <Box
      sx={{
        paddingX: { xs: '16px', sm: '32px', md: '64px', lg: '104px' },
        paddingY: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        height: { xs: '72px', md: '92px' },
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 2, md: 6 } }}>
        <Typography
          variant='h3'
          component={Link}
          to='/'
          sx={{
            fontWeight: '700',
            color: 'primary.main',
            fontSize: { xs: '24px', sm: '32px', md: '39px' },
            lineHeight: '120%',
            textDecoration: 'none'
          }}
        >
          FlexiPod
        </Typography>
        {!isMobile && (
          <Box sx={{ gap: 3 }} display='flex'>
            {renderMenuItems()}
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {account ? (
          <Stack
            direction='row'
            sx={{
              p: { xs: 0.8, md: 1.2 },
              gap: { xs: 0.8, md: 1.2 },
              alignItems: 'center',
              borderRadius: '8px',
              border: '1px solid #000',
              cursor: 'pointer'
            }}
            onClick={handleClick}
          >
            <Avatar
              sizes='small'
              alt='RC'
              src={account?.avatar ?? undefined}
              sx={{ width: { xs: 28, md: 36 }, height: { xs: 28, md: 36 } }}
            >
              {account?.name.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography sx={{ fontWeight: 500, fontSize: { xs: '14px', md: '16px' }, lineHeight: '120%' }}>
                {account?.name}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: { xs: '8px', md: '10px' }, lineHeight: '120%' }}>
                {account?.email}
              </Typography>
            </Box>
            <OptionsMenu anchorEl={anchorEl} />
          </Stack>
        ) : (
          <>{!isMobile && renderAuthButtons()}</>
        )}
        {isMobile && (
          <IconButton edge='end' color='inherit' aria-label='menu' onClick={toggleMobileMenu}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      {renderMobileMenu()}
    </Box>
  )
}
