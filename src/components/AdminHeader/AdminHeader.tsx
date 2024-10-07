import Box from '@mui/material/Box'

export default function AdminHeader() {
  // const account = {
  //   name: 'John Doe',
  //   email: 'L6U8t@example.com',
  //   avatar: 'https://i.pravatar.cc/300'
  // }

  return (
    <Box sx={{ height: '72px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <Box gap={1} display='flex' alignItems='center'>
        <div>Avatar</div>
      </Box>
    </Box>
  )
}
