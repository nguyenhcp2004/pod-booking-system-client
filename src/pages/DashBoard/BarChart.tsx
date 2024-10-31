/* eslint-disable react-hooks/exhaustive-deps */
import { BarChart } from '@mui/x-charts/BarChart'
import { Card, CardContent, CardHeader, Typography, CardActions } from '@mui/material'
import { useGetNumberOrderByBuilding } from '~/queries/useOrderDetail'
import { useMemo } from 'react'

interface NumberOrderByBuildingDto {
  buildingNumber: number
  address: string
  numberOrders: number
}

// type ChartDataType = NumberOrderByBuildingDto & { [key: string]: string | number }

export function RoomBarChart() {
  const { data: numberOrderByBuildingRes, isLoading, error } = useGetNumberOrderByBuilding()

  const chartData: NumberOrderByBuildingDto[] = numberOrderByBuildingRes?.data.data || []

  const sortedData = useMemo(() => {
    return [...chartData]
      .sort((a, b) => b.numberOrders - a.numberOrders)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        numberOrdersLabel: item.numberOrders.toString() // Add a string version for labels
      }))
  }, [chartData])

  if (error) return <Typography>Có lỗi xảy ra: {error.message}</Typography>

  return (
    <Card>
      <CardHeader title={<Typography variant='h6'>Xếp hạng loại phòng</Typography>} subheader='Được gọi nhiều nhất' />
      <CardContent>
        <BarChart
          loading={isLoading}
          dataset={sortedData}
          margin={{ left: 140 }}
          yAxis={[{ scaleType: 'band', dataKey: 'address' }]}
          series={[{ dataKey: 'numberOrders', label: 'Đơn đặt' }]}
          xAxis={[
            {
              label: 'Đơn đặt'
            }
          ]}
          layout='horizontal'
          height={300}
          slotProps={{
            loadingOverlay: { message: 'Đang tải dữ liệu...' },
            noDataOverlay: { message: 'Chưa có dữ liệu doanh thu' }
          }}
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
