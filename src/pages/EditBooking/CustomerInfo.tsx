import { Box, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { tokens } from '~/themes/theme'

export default function CustomerInfo() {
  const colors = tokens('light')
  return (
    <Box
      sx={{
        bgcolor: 'white',
        padding: '20px',
        borderRadius: 2,
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)'
      }}
    >
      <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700' }}>
        Thông tin khách hàng
      </Typography>
      <Box sx={{ paddingTop: '24px' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
            <TextField
              id='outlined-required'
              label='Tên'
              defaultValue='Huỳnh Nguyên'
              fullWidth
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
            <TextField
              id='outlined-required'
              label='Số điện thoại'
              defaultValue='09xxxxxxxx'
              fullWidth
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
            <TextField
              id='outlined-required'
              label='Email'
              defaultValue='nguyen@gmail.com'
              fullWidth
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
