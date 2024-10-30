import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup
} from '@mui/material'

import { RoomBarChart } from '~/pages/DashBoard/BarChart'
import { RevenueBarChart } from '~/pages/DashBoard/RevenueBarChart'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DoorSlidingIcon from '@mui/icons-material/DoorSliding'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Grid from '@mui/material/Grid2'
import { useCountServedRooms } from '~/queries/useRoom'
import { useCountCurrentOrder, useCountOrder } from '~/queries/useOrder'
import { useEffect, useMemo, useState } from 'react'
import moment, { Moment } from 'moment'
import { CountOrderReqType } from '~/schemaValidations/order.schema'
import { useCountCurrentCustomer, useCountCustomer } from '~/queries/useAccount'
import { CountCustomerReqType } from '~/schemaValidations/account.schema'
import { useGetRevenue, useGetRevenueCurrentDay } from '~/queries/useOrderDetail'
import { GetRevenueReqType } from '~/schemaValidations/orderDetail.schema'
import { DatePicker } from '@mui/x-date-pickers'

export default function DashboardMain() {
  const [startTime, setStartTime] = useState<Moment>(moment().startOf('day'))
  const [endTime, setEndTime] = useState<Moment>(moment().endOf('day'))
  const [selectTime, setSelectTime] = useState<Moment>(moment().startOf('day'))

  const [selectMode, setSelectMode] = useState<'day' | 'month' | 'quarter'>('day')

  const quarterList = useMemo(() => {
    const from = moment().year(2024).startOf('year')
    const to = moment().endOf('year')
    const quarters = []
    const current = from.clone()
    while (current.isBefore(to)) {
      const quarter = current.clone()
      quarters.push({
        key: quarters.length + 1,
        label: `Quý ${current.quarter()}/${current.year()}`,
        value: quarter
      })
      current.add(1, 'quarter')
    }
    return quarters
  }, [])

  const [quarter, setQuarter] = useState<number>(quarterList[0].key)

  useEffect(() => {
    const start = selectMode === 'quarter' ? quarterList[quarter - 1].value.clone() : selectTime.clone()
    const end = selectMode === 'quarter' ? quarterList[quarter - 1].value.clone() : selectTime.clone()
    if (selectMode === 'day') {
      setStartTime(start.startOf('day'))
      setEndTime(end.endOf('day'))
    } else if (selectMode === 'month') {
      setStartTime(start.startOf('month'))
      setEndTime(end.endOf('month'))
    } else if (selectMode === 'quarter') {
      setStartTime(start.startOf('quarter'))
      setEndTime(end.endOf('quarter'))
    }
  }, [selectTime, selectMode, quarter])

  // useEffect(() => {
  //   console.log(startTime?.format('DD/MM/YYYY HH:mm'), endTime?.format('DD/MM/YYYY HH:mm'))
  // }, [startTime, endTime])

  const pickerMode = useMemo(() => {
    switch (selectMode) {
      case 'day':
        return {
          mode: 'day',
          label: 'Chọn ngày',
          format: 'DD/MM/YYYY'
        }
      case 'month':
        return {
          mode: 'month',
          label: 'Chọn tháng',
          format: 'MM/YYYY'
        }
      case 'quarter':
        return {
          mode: 'quarter',
          label: 'Chọn quý',
          format: 'MM/YYYY'
        }
      default:
        return {
          mode: 'day',
          label: 'Chọn ngày',
          format: 'DD/MM/YYYY'
        }
    }
  }, [selectMode])

  const handleGetToday = () => {
    setSelectTime(moment().startOf('day'))
    const currentQuarter = quarterList.find((tempQuarter) => tempQuarter.value.isSame(moment(), 'quarter'))
    if (currentQuarter) {
      setQuarter(currentQuarter.key)
    }
  }

  const handleNext = () => {
    const now = selectTime.clone()
    if (selectMode === 'day') {
      setSelectTime(now.add(1, 'day'))
    } else if (selectMode === 'month') {
      setSelectTime(now.add(1, 'month'))
    } else if (selectMode === 'quarter') {
      setSelectTime(now.add(1, 'quarter'))
      setQuarter((quarter) => quarter + 1)
    }
  }

  const handlePrev = () => {
    const now = selectTime.clone()
    if (selectMode === 'day') {
      setSelectTime(now.subtract(1, 'day'))
    } else if (selectMode === 'month') {
      setSelectTime(now.subtract(1, 'month'))
    } else if (selectMode === 'quarter') {
      setSelectTime(now.subtract(1, 'quarter'))
      setQuarter((quarter) => quarter - 1)
    }
  }

  const countOrderParam: CountOrderReqType = {
    startTime: startTime ? startTime.format('DD/MM/YYYYTHH:mm') : null,
    endTime: endTime ? endTime.format('DD/MM/YYYYTHH:mm') : null
  }
  const countCustomerParam: CountCustomerReqType = {
    startTime: startTime ? startTime.format('DD/MM/YYYYTHH:mm') : '',
    endTime: endTime ? endTime.format('DD/MM/YYYYTHH:mm') : ''
  }
  const getRevenueParam: GetRevenueReqType = {
    startTime: startTime ? startTime.format('DD/MM/YYYYTHH:mm') : '',
    endTime: endTime ? endTime.format('DD/MM/YYYYTHH:mm') : ''
  }

  const getRevenueChartParam = useMemo(() => {
    return {
      startTime: startTime.format('DD/MM/YYYYTHH:mm'),
      endTime: endTime.format('DD/MM/YYYYTHH:mm'),
      viewWith: selectMode
    }
  }, [startTime, endTime, selectMode])

  /**
   * Call api count served room
   */
  const { data } = useCountServedRooms()
  const numberServedRooms = data?.data.data

  /**
   * Call api count order
   */
  const { data: numberCurrentOrderRes } = useCountCurrentOrder()
  const { data: numberOrderRes } = useCountOrder(countOrderParam)
  const numberOrder = startTime && endTime ? numberOrderRes?.data.data : numberCurrentOrderRes?.data.data

  /**
   * Call api count customer
   */
  const { data: numberCurrentCustomerRes } = useCountCurrentCustomer()
  const { data: numberCustomerRes } = useCountCustomer(countCustomerParam)
  const numberCustomer = startTime && endTime ? numberCustomerRes?.data.data : numberCurrentCustomerRes?.data.data

  /**
   * Call api calculate revenue
   */
  const { data: revenueCurrentDay } = useGetRevenueCurrentDay()
  const { data: revenueRes } = useGetRevenue(getRevenueParam)
  const revenue = startTime && endTime ? revenueRes?.data.data : revenueCurrentDay?.data.data

  return (
    <div>
      <Box display='flex' justifyContent='flex-start' alignItems='center' gap={2}>
        <Box width={120}>
          <FormControl fullWidth>
            <InputLabel size='small'>Chế độ xem</InputLabel>
            <Select
              size='small'
              value={selectMode}
              label='Chế độ xem'
              onChange={(e) => setSelectMode(e.target.value as 'day' | 'month' | 'quarter')}
            >
              <MenuItem value={'day'}>Ngày</MenuItem>
              <MenuItem value={'month'}>Tháng</MenuItem>
              <MenuItem value={'quarter'}>Quý</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box minWidth={120}>
          {selectMode !== 'quarter' ? (
            <DatePicker
              label={pickerMode.label}
              value={selectTime}
              views={selectMode === 'month' ? ['month', 'year'] : ['year', 'month', 'day']}
              onChange={(date) => {
                if (date) setSelectTime(date)
              }}
              format={pickerMode.format}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          ) : (
            <FormControl fullWidth>
              <InputLabel size='small'>{pickerMode.label}</InputLabel>
              <Select
                size='small'
                label={pickerMode.label}
                value={quarter}
                onChange={(e) => setQuarter(e.target.value as number)}
              >
                {quarterList.map((quarter) => (
                  <MenuItem key={quarter.key} value={quarter.key}>
                    {quarter.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        <Button variant='outlined' onClick={handleGetToday}>
          Hôm nay
        </Button>

        <ButtonGroup size='small' color='primary'>
          <Button onClick={handlePrev} disabled={selectMode === 'quarter' && quarter == 1}>
            <NavigateBeforeIcon />
          </Button>
          <Button onClick={handleNext} disabled={selectMode === 'quarter' && quarter == quarterList.length}>
            <NavigateNextIcon />
          </Button>
        </ButtonGroup>
      </Box>

      <Grid container spacing={2} marginTop={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  {revenue?.toLocaleString('vi-VN')} VNĐ
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  {numberCustomer}
                </Typography>
                <Typography variant='caption' sx={{ color: '#43a047' }}>
                  Đặt phòng
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  {numberOrder}
                </Typography>
                <Typography variant='caption' sx={{ color: '#fb8c00' }}>
                  Đã thanh toán
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  {numberServedRooms}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RevenueBarChart chartParams={getRevenueChartParam} view={selectMode} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <RoomBarChart />
        </Grid>
      </Grid>
    </div>
  )
}
