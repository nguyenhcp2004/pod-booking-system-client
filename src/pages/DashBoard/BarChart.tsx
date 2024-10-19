import { BarChart } from '@mui/x-charts/BarChart' // Import BarChart from MUI
import { Card, CardContent, CardHeader, Typography, CardActions } from '@mui/material'
import { useMemo } from 'react'

// Fake chart data
const chartData = [
  { name: 'Phòng 2 người', successOrders: 120 },
  { name: 'Phòng 4 người', successOrders: 90 },
  { name: 'Phòng họp', successOrders: 70 },
  { name: 'Phòng họp 2', successOrders: 150 },
  { name: 'Phòng hội nghị', successOrders: 85 }
]

const colors = [
  'var(--color-chrome)',
  'var(--color-safari)',
  'var(--color-firefox)',
  'var(--color-edge)',
  'var(--color-other)'
]

export function RoomBarChart() {
  // Assigning colors to the chart data
  const chartDataWithColors = useMemo(
    () =>
      chartData.map((data, index) => ({
        ...data,
        fill: colors[index] ?? colors[colors.length - 1]
      })),
    []
  )

  return (
    <Card>
      <CardHeader title={<Typography variant='h6'>Xếp hạng món ăn</Typography>} subheader='Được gọi nhiều nhất' />
      <CardContent>
        <BarChart
          xAxis={[
            {
              data: chartDataWithColors.map((data) => data.name),
              label: 'Loại phòng'
            }
          ]}
          series={[
            {
              data: chartDataWithColors.map((data) => data.successOrders),
              label: 'Đơn thanh toán'
            }
          ]}
          layout='horizontal' // Setting the bar chart layout to horizontal
          height={300} // Adjust the height of the chart
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
