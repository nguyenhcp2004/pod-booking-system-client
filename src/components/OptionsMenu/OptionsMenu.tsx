import { styled } from '@mui/material/styles'
import { dividerClasses } from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import { paperClasses } from '@mui/material/Paper'
import { listClasses } from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'
import { Button } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0'
})

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <Button
        aria-label='Open menu'
        onClick={handleClick}
        sx={{ borderColor: 'transparent', justifyContent: 'flex-start', minWidth: 'auto', padding: 0 }}
      >
        <KeyboardArrowDownIcon color='action' sx={{ marginX: 0 }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id='menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          marginTop: '15px',
          marginLeft: '42px',
          [`& .${listClasses.root}`]: {
            width: '220px',
            borderRadius: '4px'
          },
          [`& .${paperClasses.root}`]: {
            padding: 0
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px'
          }
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon fontSize='small' sx={{ color: '#000' }} />
          </ListItemIcon>
          <ListItemText
            sx={{ color: '#000', fontSize: '16px', fontWeight: 400, lineHeight: '150%', letterSpacing: '0.15px' }}
          >
            Tài khoản
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize='small' sx={{ color: '#000' }} />
          </ListItemIcon>
          <ListItemText
            sx={{ color: '#000', fontSize: '16px', fontWeight: 400, lineHeight: '150%', letterSpacing: '0.15px' }}
          >
            Đăng xuất
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
