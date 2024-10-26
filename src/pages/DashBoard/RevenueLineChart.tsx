import { Card, CardContent, CardHeader, Typography, CardActions } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import moment from 'moment'
import { useMemo } from 'react'
import { useGetRevenueByMonth } from '~/queries/useOrderDetail'

interface RevenueByMonthDto {
  date: string
  revenue: number
}

export function RevenueLineChart() {
  const { data: revenueByMonthRes, isLoading, error } = useGetRevenueByMonth()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chartData: RevenueByMonthDto[] = revenueByMonthRes?.data.data || []

  const { dates, revenues, monthRange } = useMemo(() => {
    const sortedData = [...chartData].sort((a, b) => moment(a.date).diff(moment(b.date)))
    const dates = sortedData.map((item) => moment(item.date).toDate())
    const revenues = sortedData.map((item) => item.revenue)

    const firstMonth = moment(sortedData[0]?.date).format('MM')
    const lastMonth = moment(sortedData[sortedData.length - 1]?.date).format('MM')
    const year = moment(sortedData[0]?.date).format('YYYY')
    const monthRange =
      sortedData.length > 0
        ? `Phân tích doanh thu tháng ${firstMonth}-${lastMonth} năm ${year}`
        : 'Chưa có dữ liệu doanh thu'

    return { dates, revenues, monthRange }
  }, [chartData])

  if (isLoading) return <Typography>Đang tải dữ liệu...</Typography>
  if (error) return <Typography>Có lỗi xảy ra: {error.message}</Typography>

  return (
    <Card>
      <CardHeader title={<Typography variant='h6'>Doanh thu</Typography>} subheader={monthRange} />
      <CardContent>
        {chartData.length > 0 ? (
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
                label: 'Doanh thu',
                valueFormatter: (value) => `${value?.toLocaleString('vi-VN')} VND`
              }
            ]}
            height={300}
            margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
          />
        ) : (
          <Typography>Không có dữ liệu</Typography>
        )}
      </CardContent>
      <CardActions>
        <Typography variant='body2' color='textSecondary'></Typography>
      </CardActions>
    </Card>
  )
}
