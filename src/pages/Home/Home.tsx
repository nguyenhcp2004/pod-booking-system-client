import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import { FormControl, InputLabel, MenuItem, Pagination, Select, Typography, SelectChangeEvent } from '@mui/material'
import homePageBanner from '../../assets/images/homePageBanner.png'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import PODRoomTypeCard, { PODRoomTypeCardProps } from '~/components/LandingPage/RoomTypeCard'
import moment, { Moment } from 'moment'
import { useGetFilterRoomType } from '~/queries/useFilterRoomType'
import { FilterRoomTypeQuery } from '~/schemaValidations/roomType.schema'
import { Helmet } from 'react-helmet-async'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import { slotType } from '~/contexts/BookingContext'
import { useGetAllBuilding } from '~/queries/useBuilding'

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

  const { data: allBuildingRes } = useGetAllBuilding()
  const allBuilding = allBuildingRes?.data.data

  const [location, setLocation] = useState<string | null>(null)
  const [roomType, setRoomType] = useState<string | null>(null)
  const [date, setDate] = useState<Moment | null>(moment())
  const [timeSlot, setTimeSlot] = useState<slotType | null>(null)

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
  }

  const handleRoomTypeChange = (event: SelectChangeEvent<string>) => {
    const newRoomType = event.target.value
    setRoomType(newRoomType)
    const capacity = parseInt(newRoomType.split(' ')[1])
    setFilterQuery((prev) => ({ ...prev, capacity }))
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
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ paddingX: '104px', paddingY: '24px' }}
      >
        <Grid size={6} style={{ alignContent: 'center' }}>
          <Typography variant='h3' sx={{ fontWeight: 'bold' }} color='primary'>
            FlexiPod
          </Typography>
          <Typography variant='h3' color='secondary'>
            Tiện lợi, riêng tư
          </Typography>
          <Typography variant='subtitle1' color='neutral'>
            Không gian tích hợp đa dạng dịch vụ giúp thúc đẩy công việc của bạn phát triển một cách tối đa.
          </Typography>
        </Grid>
        <Grid size={6}>
          <img src={homePageBanner} alt='' style={{ borderRadius: '8px', width: '100%' }} />
        </Grid>
      </Grid>
      {/* Rooms Section  */}
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ paddingX: '104px', paddingY: '24px' }}
      >
        {/* Rooms Section Title */}
        <Grid size={12}>
          <Typography variant='h3' sx={{ fontWeight: 'bold', textAlign: 'center' }} color='primary'>
            Đặt phòng
          </Typography>
        </Grid>
        {/* Rooms Section Filter */}
        <Grid container size={12} spacing={2} style={{ paddingTop: '32px', paddingBottom: '32px' }}>
          <Grid size={3}>
            <FormControl fullWidth>
              <InputLabel id='location-label'>Địa chỉ</InputLabel>
              <Select labelId='location-label' value={location || ''} label='Địa chỉ' onChange={handleLocationChange}>
                {allBuilding?.map((building) => (
                  <MenuItem key={building.id} value={building.address}>
                    {building.address}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth>
              <InputLabel id='room-type-label'>Loại phòng</InputLabel>
              <Select
                labelId='room-type-label'
                value={roomType || ''}
                label='Loại phòng'
                onChange={handleRoomTypeChange}
              >
                <MenuItem value='Phòng 2 người'>Phòng 2 người</MenuItem>
                <MenuItem value='Phòng 4 người'>Phòng 4 người</MenuItem>
                <MenuItem value='Phòng 6 người'>Phòng 6 người</MenuItem>
                <MenuItem value='Phòng 8 người'>Phòng 8 người</MenuItem>
                <MenuItem value='Phòng 10 người'>Phòng 10 người</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={3}>
            <DatePicker
              value={date}
              onChange={handleDateChange}
              sx={{ width: '100%' }}
              label='Ngày đặt'
              format={DEFAULT_DATE_FORMAT}
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth>
              <InputLabel id='time-slot-label'>Khung giờ</InputLabel>
              <Select
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
        <Grid container spacing={2}>
          {data?.data.data.map((roomType: Omit<PODRoomTypeCardProps, 'date' | 'timeSlot'>) => (
            <Grid size={12} key={roomType.id}>
              <PODRoomTypeCard
                {...roomType}
                date={date ? date.format(DEFAULT_DATE_FORMAT) : null}
                timeSlot={timeSlot ? [timeSlot as slotType] : []}
              />
            </Grid>
          ))}
        </Grid>
        {/* Rooms Section Pagination Button */}
        <Grid size={12} sx={{ justifyContent: 'center', display: 'flex', mt: 4 }}>
          <Pagination
            count={data?.data.totalPage || 1}
            page={page}
            onChange={handleChangePage}
            showFirstButton
            showLastButton
          />
        </Grid>
      </Grid>
    </Box>
  )
}
