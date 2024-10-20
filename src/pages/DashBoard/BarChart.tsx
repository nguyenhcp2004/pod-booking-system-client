import { BarChart } from '@mui/x-charts/BarChart'
import { Card, CardContent, CardHeader, Typography, CardActions } from '@mui/material'

const chartData = [
  { name: 'Phòng 2 người', successOrders: 120 },
  { name: 'Phòng 4 người', successOrders: 90 },
  { name: 'Họp', successOrders: 70 },
  { name: 'Họp 2', successOrders: 150 },
  { name: 'Hội nghị', successOrders: 85 }
]

export function RoomBarChart() {
  return (
    <Card>
      <CardHeader title={<Typography variant='h6'>Xếp hạng loại phòng</Typography>} subheader='Được gọi nhiều nhất' />
      <CardContent>
        <BarChart
          dataset={chartData}
          yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
          series={[{ dataKey: 'successOrders', label: 'Đơn đặt' }]}
          xAxis={[
            {
              label: 'Đơn đặt'
            }
          ]}
          layout='horizontal'
          height={300}
        />
      </CardContent>
      <CardActions>
        <Typography variant='body2' color='textSecondary'>
          {/* Add any additional footer info here */}
        </Typography>
      </CardActions>
    </Card>
  )
}
