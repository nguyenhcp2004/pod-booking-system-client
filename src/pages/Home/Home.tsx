import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import homePageBanner from '../../assets/images/homePageBanner.png'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export default function Home() {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Secion */}
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ paddingX: '104px', paddingY: '24px' }}
      >
        <Grid item xs={6} style={{ alignContent: 'center' }}>
          <Typography variant='h2' sx={{ fontWeight: 'bold' }} color='primary'>
            FlexiPod
          </Typography>
          <Typography variant='h2' color='secondary'>
            Tiện lợi, riêng tư
          </Typography>
          <Typography variant='subtitle1' color='neutral'>
            Không gian tích hợp đa dạng dịch vụ giúp thúc đẩy công việc của bạn phát triển một cách tối đa.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <img src={homePageBanner} alt='' style={{ borderRadius: '8px', width: '100%' }} />
        </Grid>
      </Grid>

      {/* Rooms Section  */}
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ paddingX: '104px', paddingY: '24px' }}
      >
        <Grid item xs={12}>
          <Typography variant='h2' sx={{ fontWeight: 'bold', textAlign: 'center' }} color='primary'>
            Đặt phòng
          </Typography>
        </Grid>

        <Grid container spacing={2} style={{ paddingTop: '32px', paddingBottom: '32px' }}>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id='location-label'>Địa chỉ</InputLabel>
              <Select
                labelId='location-label'
                // value={location}
                label='Địa chỉ'
                // onChange={(e) => setLocation(e.target.value)}
              >
                <MenuItem value='TP.Thủ Đức'>TP.Thủ Đức</MenuItem>
                {/* Add more locations as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id='room-type-label'>Loại phòng</InputLabel>
              <Select
                labelId='room-type-label'
                // value={roomType}
                label='Loại phòng'
                // onChange={(e) => setRoomType(e.target.value)}
              >
                <MenuItem value='Phòng 2 người'>Phòng 2 người</MenuItem>
                {/* Add more room types as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <DatePicker
              // value={value}
              // onChange={(newValue) => setValue(newValue)
              sx={{ width: '100%' }}
              label='Ngày đặt'
              format='DD/MM/YYYY'
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id='time-slot-label'>Slot</InputLabel>
              <Select
                labelId='time-slot-label'
                // value={timeSlot}
                label='Slot'
                // onChange={(e) => setTimeSlot(e.target.value)}
              >
                <MenuItem value='7h - 9h'>7h - 9h</MenuItem>
                {/* Add more time slots as needed */}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
