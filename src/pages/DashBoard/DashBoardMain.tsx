import { Card, CardContent, CardHeader, Typography, Button, Grid, Box } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { RoomBarChart } from '~/pages/DashBoard/BarChart'
import { RevenueLineChart } from '~/pages/DashBoard/RevenueLineChart'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DoorSlidingIcon from '@mui/icons-material/DoorSliding'

export default function DashboardMain() {
  const resetDateFilter = () => {}

  return (
    <div>
      <Box display='flex' justifyContent='flex-start' alignItems='center' gap={2}>
        <Box>
          <DateTimePicker label='Từ ngày' />
        </Box>
        <Box>
          <DateTimePicker label='Đến ngày' />
        </Box>
        <Button variant='outlined' onClick={resetDateFilter}>
          Reset
        </Button>
      </Box>

      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box height='100%'>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(to bottom right, #e3f2fd, #90caf9)',
                color: '#1e88e5'
              }}
            >
              <CardHeader
                component={Box}
                title='Tổng doanh thu'
                sx={{ margin: 0, color: 'inherit' }}
                action={
                  <Box>
                    <AssessmentIcon sx={{ marginTop: 1.2, marginRight: 1, color: 'inherit' }} />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant='h5' sx={{ color: 'inherit', fontWeight: 'bold' }}>
                  0
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box height='100%'>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(to bottom right, #e8f5e9, #a5d6a7)',
                color: '#43a047'
              }}
            >
              <CardHeader
                title='Khách'
                sx={{ margin: 0, color: 'inherit' }}
                action={
                  <Box>
                    <PeopleAltIcon sx={{ marginTop: 1.2, marginRight: 1, color: 'inherit' }} />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant='h5' sx={{ color: 'inherit', fontWeight: 'bold' }}>
                  0
                </Typography>
                <Typography variant='caption' sx={{ color: '#43a047' }}>
                  Đặt phòng
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box height='100%'>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(to bottom right, #fff3e0, #ffcc80)',
                color: '#fb8c00'
              }}
            >
              <CardHeader
                title='Đơn hàng'
                sx={{ margin: 0, color: 'inherit' }}
                action={
                  <Box>
                    <ShoppingCartIcon sx={{ marginTop: 1.2, marginRight: 1, color: 'inherit' }} />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant='h5' sx={{ color: 'inherit', fontWeight: 'bold' }}>
                  0
                </Typography>
                <Typography variant='caption' sx={{ color: '#fb8c00' }}>
                  Đã thanh toán
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box height='100%'>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(to bottom right, #fce4ec, #f48fb1)',
                color: '#d81b60'
              }}
            >
              <CardHeader
                title='Phòng đang phục vụ'
                sx={{ margin: 0, color: 'inherit' }}
                action={
                  <Box>
                    <DoorSlidingIcon sx={{ marginTop: 1.2, color: 'inherit' }} />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant='h5' sx={{ color: 'inherit', fontWeight: 'bold' }}>
                  0
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={7}>
          <RevenueLineChart />
        </Grid>
        <Grid item xs={12} md={5}>
          <RoomBarChart />
        </Grid>
      </Grid>
    </div>
  )
}
