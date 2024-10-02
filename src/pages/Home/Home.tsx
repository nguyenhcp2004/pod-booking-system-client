import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import { FormControl, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material'
import homePageBanner from '../../assets/images/homePageBanner.png'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import PODRoomCard from '~/components/LandingPage/RoomCard'
import { useEffect, useState } from 'react'
import moment, { Moment } from 'moment'
import { useGetFilterRoom } from '~/queries/useFilterRoom'
import { FilterRoomQueryType } from '~/schemaValidations/room.schema'

export default function Home() {
  const [page, setPage] = useState(1)
  const [filterQuery, setFilterQuery] = useState<FilterRoomQueryType>({
    address: '123 Main St',
    capacity: 10,
    startTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
    endTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
    page: page,
    take: 4
  })
  const { data, refetch } = useGetFilterRoom(filterQuery)
  const [location, setLocation] = useState('')
  const [roomType, setRoomType] = useState('')
  const [date, setDate] = useState<Moment | null>()
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    setFilterQuery((prev) => ({ ...prev, page }))
  }, [page])

  useEffect(() => {
    refetch()
  }, [filterQuery, refetch])

  const handleBookRoom = (roomId: number) => {
    console.log(`Booking room with ID: ${roomId}`)
  }

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Secion */}/
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
              <Select
                labelId='location-label'
                value={location}
                label='Địa chỉ'
                onChange={(e) => setLocation(e.target.value)}
              >
                <MenuItem value='TP.Thủ Đức'>TP.Thủ Đức</MenuItem>
                {/* Add more locations as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth>
              <InputLabel id='room-type-label'>Loại phòng</InputLabel>
              <Select
                labelId='room-type-label'
                value={roomType}
                label='Loại phòng'
                onChange={(e) => setRoomType(e.target.value)}
              >
                <MenuItem value='Phòng 2 người'>Phòng 2 người</MenuItem>
                {/* Add more room types as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={3}>
            <DatePicker
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{ width: '100%' }}
              label='Ngày đặt'
              format='DD/MM/YYYY'
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth>
              <InputLabel id='time-slot-label'>Slot</InputLabel>
              <Select labelId='time-slot-label' value={time} label='Slot' onChange={(e) => setTime(e.target.value)}>
                <MenuItem value='7h - 9h'>7h - 9h</MenuItem>
                {/* Add more time slots as needed */}
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
              // roomTypeId={room.roomType.roomTypeId}
              // roomTypeName={room.roomType.roomTypeName}
              // roomTypeQuantity={room.roomType.roomTypeQuantity}
              // capacity={room.roomType.capacity}
              // building={room.roomType.building}
              // buildingId={room.roomType.building.buildingId}
              // address={room.roomType.building.address}
              // buildingDescription={room.roomType.building.buildingDescription}
              // hotlineNumber={room.roomType.building.hotlineNumber}
              // buildingStatus={room.roomType.building.buildingStatus}
              // buildingCreatedAt={room.roomType.building.buildingCreatedAt}
              // buildingUpdatedAt={room.roomType.building.buildingUpdatedAt}
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
