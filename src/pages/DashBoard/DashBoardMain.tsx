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
            <Card sx={{ height: '100%' }}>
              <CardHeader
                component={Box}
                title='Tổng doanh thu'
                sx={{ margin: 0 }}
                action={
                  <Box>
                    <AssessmentIcon sx={{ marginTop: 1.2, marginRight: 1 }} />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant='h5'>0</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box height='100%'>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title='Khách'
                sx={{ margin: 0 }}
                action={
                  <Box>
                    <PeopleAltIcon sx={{ marginTop: 1.2, marginRight: 1 }} />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant='h5'>0</Typography>
                <Typography variant='caption'>Đặt phòng</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box height='100%'>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title='Đơn hàng'
                sx={{ margin: 0 }}
                action={
                  <Box>
                    <ShoppingCartIcon sx={{ marginTop: 1.2, marginRight: 1 }} />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant='h5'>0</Typography>
                <Typography variant='caption'>Đã thanh toán</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box height='100%'>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title='Phòng đang phục vụ'
                sx={{ margin: 0 }}
                action={
                  <Box>
                    <DoorSlidingIcon sx={{ marginTop: 1.2 }} />
                  </Box>
                }
              />
              <CardContent>
                <Typography variant='h5'>0</Typography>
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
