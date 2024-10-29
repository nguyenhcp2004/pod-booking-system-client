import { Card, CardContent, CardHeader, Typography, CardActions, Box } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import moment from 'moment'
import { useMemo } from 'react'
import { useGetRevenueByMonth } from '~/queries/useOrderDetail'
import { GetRevenueChartBodyType } from '~/schemaValidations/orderDetail.schema'
import { formatCurrency } from '~/utils/currency'

interface RevenueByMonthDto {
  date: string
  revenue: number
}

export function RevenueBarChart({ chartParams, view }: { chartParams: GetRevenueChartBodyType; view: string }) {
  const { data: revenueByMonthRes, isLoading, error } = useGetRevenueByMonth(chartParams)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chartData: RevenueByMonthDto[] = revenueByMonthRes?.data.data || []

  const { dates, revenues, title, label } = useMemo(() => {
    const sortedData = [...chartData].sort((a, b) => moment(a.date).diff(moment(b.date)))
    const dates = sortedData.map((item) => moment(item.date).toDate())
    const revenues = sortedData.map((item) => item.revenue)

    const firstMonth = moment(sortedData[0]?.date)
    const year = moment(sortedData[0]?.date).format('YYYY')

    const title =
      sortedData.length > 0
        ? `Phân tích doanh thu ${view === 'day' ? 'ngày ' + firstMonth.format('DD/MM/YYYY') : view === 'month' ? 'tháng ' + firstMonth.format('MM/YYYY') : `quý ${firstMonth.quarter()} - ${year}`} `
        : 'Chưa có dữ liệu doanh thu'
    const label =
      view === 'day'
        ? 'Ngày'
        : view === 'month'
          ? 'Ngày trong tháng ' + firstMonth.format('MM/YYYY')
          : 'Tháng trong quý ' + firstMonth.quarter() + ' - ' + year
    return { dates, revenues, title, label }
  }, [chartData, view])

  if (error) return <Typography>Có lỗi xảy ra: {error.message}</Typography>

  return (
    <Card>
      <CardHeader title={<Typography variant='h6'>Doanh thu</Typography>} subheader={title} />
      <CardContent>
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
          <BarChart
            loading={isLoading}
            height={300}
            series={[
              {
                data: revenues,
                label: 'Doanh thu',
                valueFormatter: (value) => {
                  return value !== null ? formatCurrency(value) : ''
                }
              }
            ]}
            margin={{ left: 100 }}
            xAxis={[
              {
                data: dates,
                valueFormatter: (value) => {
                  return view === 'day'
                    ? moment(value).format('DD/MM')
                    : view === 'month'
                      ? moment(value).format('DD')
                      : moment(value).format('MM/YYYY')
                },
                scaleType: 'band',
                label: label
              }
            ]}
            slotProps={{
              loadingOverlay: { message: 'Đang tải dữ liệu...' },
              noDataOverlay: { message: 'Chưa có dữ liệu doanh thu' }
            }}
          />
        </Box>
      </CardContent>
      <CardActions>
        <Typography variant='body2' color='textSecondary'></Typography>
      </CardActions>
    </Card>
  )
}
