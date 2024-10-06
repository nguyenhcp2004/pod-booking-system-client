import Box from '@mui/material/Box'

export default function AdminHeader() {
  return (
    <Box sx={{ height: '72px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <Box gap={1} display='flex' alignItems='center'>
        <div>Search bar</div>
        <div>Notification</div>
        <div>Avatar</div>
      </Box>
    </Box>
  )
}
