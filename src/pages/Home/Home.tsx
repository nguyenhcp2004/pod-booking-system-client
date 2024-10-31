import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
  SelectChangeEvent,
  Fade,
  Paper
} from '@mui/material'
import homePageBanner from '../../assets/images/homePageBanner.png'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import PODRoomTypeCard, { PODRoomTypeCardProps } from '~/components/LandingPage/RoomTypeCard'
import moment, { Moment } from 'moment'
import { useGetFilterRoomType } from '~/queries/useFilterRoomType'
import { FilterRoomTypeQuery } from '~/schemaValidations/roomType.schema'
import { Helmet } from 'react-helmet-async'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import { slotType } from '~/contexts/BookingContext'
import { useGetBuildingOptions } from '~/queries/useBuilding'
import { motion } from 'framer-motion'
import { useGetRoomTypeByAddress } from '~/queries/useRoomType'

export default function Component() {
  const [page, setPage] = useState(1)
  const [filterQuery, setFilterQuery] = useState<FilterRoomTypeQuery>({
    address: '',
    capacity: undefined,
    startTime: undefined,
    endTime: undefined,
    page: 1,
    take: 4
  })
  const { data, refetch } = useGetFilterRoomType(filterQuery)

  const { data: allBuildingRes } = useGetBuildingOptions()
  const allBuilding = allBuildingRes?.data.data

  const [location, setLocation] = useState<string | null>(null)
  const [roomType, setRoomType] = useState<string | null>(null)
  const [date, setDate] = useState<Moment | null>(moment())
  const [timeSlot, setTimeSlot] = useState<slotType | null>(null)

  const { data: roomTypeByAddress, refetch: refetchRoomTypeByAddress } = useGetRoomTypeByAddress(location || ' ')

  useEffect(() => {
    if (location) {
      refetchRoomTypeByAddress()
    }
  }, [location, refetchRoomTypeByAddress])

  useEffect(() => {
    setFilterQuery((prev) => ({ ...prev, page }))
  }, [page])

  useEffect(() => {
    refetch()
  }, [filterQuery, refetch])

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleDateChange = (newDate: Moment | null) => {
    setDate(newDate)
    updateFilterQuery(newDate, timeSlot as slotType)
  }

  const handleTimeSlotChange = (event: SelectChangeEvent<string>) => {
    const newTimeSlot = event.target.value
    setTimeSlot(newTimeSlot as slotType)
    updateFilterQuery(date, newTimeSlot as slotType)
  }

  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    const newLocation = event.target.value
    setLocation(newLocation)
    setFilterQuery((prev) => ({ ...prev, address: newLocation }))
    setRoomType('')
  }

  const handleRoomTypeChange = (event: SelectChangeEvent<string>) => {
    const newRoomType = event.target.value
    setRoomType(newRoomType)
    if (newRoomType === 'all') {
      setFilterQuery((prev) => ({ ...prev, capacity: undefined }))
    } else {
      const capacity = parseInt(newRoomType.split(' ')[1])
      setFilterQuery((prev) => ({ ...prev, capacity }))
    }
  }

  const updateFilterQuery = (selectedDate: Moment | null, selectedTimeSlot: slotType | null) => {
    if (selectedDate && selectedTimeSlot) {
      const [startHour, endHour] = selectedTimeSlot.split(' - ')
      const startTime = selectedDate.clone().hour(parseInt(startHour)).minute(0).second(0)
      const endTime = selectedDate.clone().hour(parseInt(endHour)).minute(0).second(0)

      setFilterQuery((prev) => ({
        ...prev,
        startTime: startTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DDTHH:mm:ss')
      }))
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Helmet>
        <title>Trang chủ | POD System</title>
        <meta name='description' content='Trang chủ dự án POD Booking System' />
      </Helmet>
      {/* Hero Section */}
      <Fade in={true} timeout={1000}>
        <Paper elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ px: { xs: 2, sm: 4, md: 13 }, py: { xs: 3, md: 4 } }}
          >
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography
                variant='h3'
                sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }}
                color='primary'
              >
                FlexiPod
              </Typography>
              <Typography variant='h3' color='secondary' sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                Tiện lợi, riêng tư
              </Typography>
              <Typography variant='subtitle1' color='neutral' sx={{ mt: 2 }}>
                Không gian làm việc linh hoạt với đa dạng dịch vụ hỗ trợ, từ các phòng họp tiện nghi đến dịch vụ chăm
                sóc khách hàng tận tâm, tạo điều kiện tốt nhất để bạn tập trung và phát triển công việc một cách tối đa.
                Chúng tôi không chỉ mang đến nơi làm việc mà còn cung cấp giải pháp toàn diện, giúp bạn dễ dàng kết nối,
                sáng tạo, và tối ưu hiệu suất trong từng bước tiến.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.img
                src={homePageBanner}
                alt='FlexiPod Banner'
                style={{ borderRadius: '8px', width: '100%', height: 'auto' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Fade>
      {/* Rooms Section  */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 4 }}>
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ px: { xs: 2, sm: 4, md: 13 }, py: { xs: 3, md: 4 } }}
        >
          {/* Rooms Section Title */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant='h3'
              sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '2rem', md: '3rem' }, mb: 4 }}
              color='primary'
            >
              Đặt phòng
            </Typography>
          </Grid>
          {/* Rooms Section Filter */}
          <Grid container size={12} spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel size='small' id='location-label'>
                  Địa chỉ
                </InputLabel>
                <Select
                  size='small'
                  labelId='location-label'
                  value={location || ''}
                  label='Địa chỉ'
                  onChange={handleLocationChange}
                >
                  <MenuItem value={''}>Tất cả</MenuItem>
                  {allBuilding?.map((building) => (
                    <MenuItem key={building.id} value={building.address}>
                      {building.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel size='small' id='room-type-label'>
                  Loại phòng
                </InputLabel>
                <Select
                  size='small'
                  labelId='room-type-label'
                  value={roomType || ''}
                  label='Loại phòng'
                  onChange={handleRoomTypeChange}
                  disabled={!location}
                >
                  <MenuItem value='all'>Tất cả</MenuItem>
                  {roomTypeByAddress?.data.data.map((roomType) => (
                    <MenuItem key={roomType.id} value={`Phòng ${roomType.capacity} người`}>
                      Phòng {roomType.capacity} người
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                value={date}
                onChange={handleDateChange}
                sx={{ width: '100%' }}
                label='Ngày đặt'
                format={DEFAULT_DATE_FORMAT}
                minDate={moment()}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel size='small' id='time-slot-label'>
                  Khung giờ
                </InputLabel>
                <Select
                  size='small'
                  labelId='time-slot-label'
                  value={timeSlot || ''}
                  label='Khung giờ'
                  onChange={handleTimeSlotChange}
                >
                  <MenuItem value='07:00 - 09:00'>7h - 9h</MenuItem>
                  <MenuItem value='09:00 - 11:00'>9h - 11h</MenuItem>
                  <MenuItem value='11:00 - 13:00'>11h - 13h</MenuItem>
                  <MenuItem value='13:00 - 15:00'>13h - 15h</MenuItem>
                  <MenuItem value='15:00 - 17:00'>15h - 17h</MenuItem>
                  <MenuItem value='17:00 - 19:00'>17h - 19h</MenuItem>
                  <MenuItem value='19:00 - 21:00'>19h - 21h</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* Rooms Section Card */}
          <Grid container spacing={3}>
            {data?.data.data.map((roomType: Omit<PODRoomTypeCardProps, 'date' | 'timeSlot'>) => (
              <Grid size={{ xs: 12 }} key={roomType.id}>
                <PODRoomTypeCard
                  {...roomType}
                  date={date ? date.format(DEFAULT_DATE_FORMAT) : null}
                  timeSlot={timeSlot ? [timeSlot as slotType] : []}
                />
              </Grid>
            ))}
          </Grid>
          {/* Rooms Section Pagination Button */}
          <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={data?.data.totalPage || 1}
              page={page}
              onChange={handleChangePage}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'primary.main'
                },
                '& .Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
