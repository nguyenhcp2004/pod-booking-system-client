import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import homePageBanner from '../../assets/images/homePageBanner.png'

export default function Home() {
  return (
    <Box sx={{ width: '100%', paddingX: '104px', paddingY: '24px' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Typography variant='h3' sx={{ fontWeight: 'bold' }} color='primary'>
            FlexiPod
          </Typography>
          <Typography variant='h3' color='secondary'>
            Tiện lợi, riêng tư
          </Typography>
          <Typography variant='subtitle2' color='neutral'>
            Không gian tích hợp đa dạng dịch vụ giúp thúc đẩy công việc của bạn phát triển một cách tối đa.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <img src={homePageBanner} alt='' />
        </Grid>
      </Grid>
    </Box>
  )
}
