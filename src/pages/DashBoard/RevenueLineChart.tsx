import { Card, CardContent, CardHeader, Typography, CardActions } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import moment from 'moment'

export function RevenueLineChart() {
  const chartData = [
    { date: '01/01/2024', revenue: 1000 },
    { date: '01/02/2024', revenue: 2000 },
    { date: '01/03/2024', revenue: 1500 },
    { date: '01/04/2024', revenue: 3000 },
    { date: '01/05/2024', revenue: 2500 },
    { date: '01/06/2024', revenue: 4000 },
    { date: '01/07/2024', revenue: 3500 },
    { date: '01/08/2024', revenue: 5000 },
    { date: '01/09/2024', revenue: 4500 },
    { date: '01/10/2024', revenue: 6000 },
    { date: '01/11/2024', revenue: 6000 },
    { date: '01/12/2024', revenue: 6000 }
  ]

  const dates = chartData.map((item) => moment(item.date, 'DD/MM/YYYY').toDate())
  const revenues = chartData.map((item) => item.revenue)

  return (
    <Card>
      <CardHeader
        title={<Typography variant='h6'>Doanh thu</Typography>}
        subheader='Phân tích doanh thu tháng 1 - 12 năm 2024'
      />
      <CardContent>
        <LineChart
          xAxis={[
            {
              data: dates,
              label: 'Ngày',
              valueFormatter: (value) => moment(value).format('DD/MM/YYYY')
            }
          ]}
          series={[
            {
              data: revenues,
              label: 'Doanh thu'
            }
          ]}
          height={300}
        />
      </CardContent>
      <CardActions>
        <Typography variant='body2' color='textSecondary'></Typography>
      </CardActions>
    </Card>
  )
}
