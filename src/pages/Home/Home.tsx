import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import { FormControl, InputLabel, MenuItem, Pagination, Select, Typography, SelectChangeEvent } from '@mui/material'
import homePageBanner from '../../assets/images/homePageBanner.png'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import PODRoomCard from '~/components/LandingPage/RoomCard'
import { useEffect, useState } from 'react'
import moment, { Moment } from 'moment'
import { useGetFilterRoom } from '~/queries/useFilterRoom'
import { FilterRoomQueryType } from '~/schemaValidations/room.schema'

const STORAGE_KEY = 'roomFilterStateLandingPage'

export default function Home() {
  const [page, setPage] = useState(1)
  const [filterQuery, setFilterQuery] = useState<FilterRoomQueryType>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      return {
        ...parsedState,
        page: 1,
        take: 4
      }
    }
    return {
      address: 'Thủ Đức',
      capacity: 10,
      startTime: moment().hour(9).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss'),
      endTime: moment().hour(11).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss'),
      page: 1,
      take: 4
    }
  })
  const { data, refetch } = useGetFilterRoom(filterQuery)
  const [location, setLocation] = useState(() => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    return savedState ? JSON.parse(savedState).address : 'Thủ Đức'
  })
  const [roomType, setRoomType] = useState(() => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    return savedState ? `Phòng ${JSON.parse(savedState).capacity} người` : 'Phòng 10 người'
  })
  const [date, setDate] = useState<Moment | null>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    return savedState ? moment(JSON.parse(savedState).startTime) : moment()
  })
  const [timeSlot, setTimeSlot] = useState<string>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      const { startTime, endTime } = JSON.parse(savedState)
      const start = moment(startTime).hour()
      const end = moment(endTime).hour()
      return `${start} - ${end}`
    }
    return '9 - 11'
  })

  useEffect(() => {
    setFilterQuery((prev) => ({ ...prev, page }))
  }, [page])

  useEffect(() => {
    refetch()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filterQuery))
  }, [filterQuery, refetch])

  const handleBookRoom = (roomId: number) => {
    console.log(`Booking room with ID: ${roomId}`)
  }

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleDateChange = (newDate: Moment | null) => {
    setDate(newDate)
    updateFilterQuery(newDate, timeSlot)
  }

  const handleTimeSlotChange = (event: SelectChangeEvent<string>) => {
    const newTimeSlot = event.target.value
    setTimeSlot(newTimeSlot)
    updateFilterQuery(date, newTimeSlot)
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

  const updateFilterQuery = (selectedDate: Moment | null, selectedTimeSlot: string) => {
    if (selectedDate && selectedTimeSlot) {
      const [startHour, endHour] = selectedTimeSlot.split(' - ').map((time) => time.replace('h', ''))
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
      {/* Hero Section */}
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ paddingX: '104px', paddingY: '24px' }}
      >
        <Grid size={{ xs: 6 }} style={{ alignContent: 'center' }}>
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
        <Grid size={{ xs: 6 }}>
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
        <Grid size={{ xs: 12 }}>
          <Typography variant='h3' sx={{ fontWeight: 'bold', textAlign: 'center' }} color='primary'>
            Đặt phòng
          </Typography>
        </Grid>
        {/* Rooms Section Filter */}
        <Grid container size={12} spacing={2} style={{ paddingTop: '32px', paddingBottom: '32px' }}>
          <Grid size={3}>
            <FormControl fullWidth>
              <InputLabel id='location-label'>Địa chỉ</InputLabel>
              <Select labelId='location-label' value={location} label='Địa chỉ' onChange={handleLocationChange}>
                <MenuItem value='Thủ Đức'>TP.Thủ Đức</MenuItem>
                <MenuItem value='Hồ Chí Minh'>TP.Hồ Chí Minh</MenuItem>
                <MenuItem value='Nha Trang'>TP.Nha Trang</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth>
              <InputLabel id='room-type-label'>Loại phòng</InputLabel>
              <Select labelId='room-type-label' value={roomType} label='Loại phòng' onChange={handleRoomTypeChange}>
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
              format='DD/MM/YYYY'
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth>
              <InputLabel id='time-slot-label'>Slot</InputLabel>
              <Select labelId='time-slot-label' value={timeSlot} label='Slot' onChange={handleTimeSlotChange}>
                <MenuItem value='7 - 9'>7h - 9h</MenuItem>
                <MenuItem value='9 - 11'>9h - 11h</MenuItem>
                <MenuItem value='13 - 15'>13h - 15h</MenuItem>
                <MenuItem value='15 - 17'>15h - 17h</MenuItem>
                <MenuItem value='17 - 19'>17h - 19h</MenuItem>
                <MenuItem value='19 - 21'>19h - 21h</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* Rooms Section Card */}
        <Grid container size={12} spacing={0}>
          {data?.data.data.map((room) => (
            <PODRoomCard
              key={room.id}
              roomId={room.id}
              roomName={room.name}
              price={room.price}
              roomDescription={room.description}
              image={room.image}
              roomStatus={room.status}
              roomCreatedAt={room.createdAt}
              roomUpdatedAt={room.updatedAt}
              roomType={room.roomType}
              onBookRoom={() => handleBookRoom(room.id)}
            />
          ))}
        </Grid>
        {/* Rooms Section Pagination Button */}
        <Grid size={12} sx={{ justifyContent: 'center', display: 'flex' }}>
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
