import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import NavItem from '~/components/AdminSidebar/NavItem'

export default function AdminSideBar() {
  return (
    <Box
      sx={{
        padding: '20px 20px 0px',
        height: '100vh',
        width: '300px',
        borderRight: '1px solid #DFE3E8',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography
        variant='h3'
        component={'a'}
        href='/admin'
        sx={{
          fontWeight: '700',
          lineHeight: '120%',
          color: 'primary.main',
          textDecoration: 'none',
          paddingLeft: '12px'
        }}
      >
        Flexipod
      </Typography>
      <Box
        sx={{
          marginY: '16px',
          padding: '24px 12px 24px 16px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}
      >
        <NavItem />
      </Box>
    </Box>
  )
}
