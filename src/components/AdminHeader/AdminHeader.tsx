import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AvatarPopover from '~/components/AvatarPopover'
import { useAppContext } from '~/contexts/AppProvider'
import { AccountType } from '~/schemaValidations/auth.schema'
export default function AdminHeader() {
  const { account } = useAppContext()
  return (
    <Box
      sx={{
        height: '72px',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'sticky',
        backgroundColor: '#F9FAFB',
        top: 0,
        zIndex: 999,
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <Box gap={1} display='flex' alignItems='center'>
        <IconButton sx={{ width: '40px', height: '40px' }}>
          <NotificationsIcon sx={{ width: '24px', height: '24px', color: 'grey.500' }} />
        </IconButton>
        <AvatarPopover account={account as AccountType} />
      </Box>
    </Box>
  )
}
