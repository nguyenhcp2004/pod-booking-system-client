import {
  Avatar,
  Button,
  Divider,
  IconButton,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
  Typography
} from '@mui/material'
import Box from '@mui/material/Box'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '~/contexts/AppProvider'
import { useLogoutMutation } from '~/queries/useAuth'
import { AccountType } from '~/schemaValidations/auth.schema'
import { clearLS, getRefreshTokenFromLS } from '~/utils/auth'
import { handleErrorApi } from '~/utils/utils'

interface Props {
  account: AccountType
}

export default function AvatarPopover({ account }: Props) {
  const { setAuth, setAccount } = useAppContext()
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null)
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null)
  }, [])

  const navigate = useNavigate()

  const logoutMutation = useLogoutMutation()
  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      const refreshToken = getRefreshTokenFromLS()
      await logoutMutation.mutateAsync({ refreshToken })
      setAccount(null)
      setAuth(false)
      clearLS()
      navigate('/admin/login')
    } catch (error) {
      handleErrorApi({ error })
    }
  }
  return (
    <>
      <IconButton sx={{ width: '40px', height: '40px' }} onClick={handleOpenPopover}>
        <Avatar sizes='small' alt='RC' src={account?.avatar ?? undefined} sx={{ width: '36px', height: '36px' }}>
          {account?.name.slice(0, 2).toUpperCase()}
        </Avatar>
      </IconButton>
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 200 }
          }
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant='subtitle2' noWrap>
            {account.name}
          </Typography>

          <Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
              [`&.${menuItemClasses.selected}`]: {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold'
              }
            }
          }}
        >
          <MenuItem>Tài khoản</MenuItem>
          <MenuItem>Cài đặt</MenuItem>
        </MenuList>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button onClick={logout} fullWidth color='error' size='medium' variant='text'>
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  )
}
