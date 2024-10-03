import { Box, Button, Grid, Typography } from '@mui/material'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import { useTheme } from '@emotion/react';
import { tokens } from '~/themes/theme';

interface CommonProps {
  onNext: () => void
  onBack: () => void
}

export const BookingInfo: React.FC<CommonProps> = (props) => {
  const colors = tokens("light");
  return (
    <Box id="hehe" sx={{ height: '100%', marginX: '104px', paddingTop:"24px"}}>
      <Grid container spacing={2} sx={{ }}>
        <Grid item xs={12} lg={6} sx={{ paddingRight: '24px !important', paddingTop:"0px !important" }}>
          <Box>
            <Typography variant='h5' sx={{color:colors.primary[500], fontWeight:"700px"}}>Thông tin khách hàng</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6} sx={{ paddingLeft : '0px !important', paddingTop:"0px !important", background:"#FFF" }}>
          <Box>
            <BookingDetails />
          </Box>
          <Grid sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, padding:"20px"}}>
            <Grid item lg={9}>
              <Button onClick={props.onNext} fullWidth sx={{ background:colors.primary[500], color:"#FFF", borderRadius:"var(--12, 96px)" }}>
                Hoàn tất
              </Button>
            </Grid>
            <Grid item lg={4}>
              <Button variant="text" onClick={props.onBack} fullWidth sx={{background:"#FFF", color:colors.primary[500] }}>
                Bỏ qua
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
