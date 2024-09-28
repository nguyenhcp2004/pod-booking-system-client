import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import { FormControl, InputLabel, MenuItem, Pagination, Select, Typography } from '@mui/material'
import homePageBanner from '../../assets/images/homePageBanner.png'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import roomCardImage from '../../assets/images/roomCardImage.jpg'
import PODRoomCard from '~/components/LandingPage/RoomCard'
import { useState } from 'react'
import { Moment } from 'moment'

const podRooms = [
  {
    id: 1,
    image: roomCardImage, // Replace with actual image path
    name: 'Phòng POD đôi A',
    address: 'TP.Thủ Đức, Hồ Chí Minh',
    description:
      'Phòng làm việc tiện nghi, được trang bị đầy đủ cơ sở vật chất hiện đại để đáp ứng nhu cầu làm việc hoặc họp nhóm của bạn. Phù hợp với các freelancer, doanh nghiệp nhỏ hoặc nhóm làm việc từ xa.',
    capacity: '2 - 4 người',
    amenities: 'Wi-fi tốc độ cao, Điều hòa, Bàn ghế thoải mái, Ổ cắm điện',
    price: '20.000 VND/tiếng'
  },
  {
    id: 2,
    image: roomCardImage, // Replace with actual image path
    name: 'Phòng POD đôi B',
    address: 'Quận 1, Hồ Chí Minh',
    description:
      'Không gian làm việc yên tĩnh và riêng tư, được thiết kế để tối ưu hóa sự tập trung và sáng tạo. Lý tưởng cho các cuộc họp nhỏ hoặc làm việc độc lập.',
    capacity: '2 - 3 người',
    amenities: 'Wi-fi tốc độ cao, Máy chiếu, Bảng trắng, Nước uống miễn phí',
    price: '25.000 VND/tiếng'
  },
  {
    id: 3,
    image: roomCardImage,
    name: 'Phòng POD đơn C',
    address: 'Quận 3, Hồ Chí Minh',
    description:
      'Phòng làm việc nhỏ gọn, hoàn hảo cho các cuộc họp trực tuyến hoặc làm việc độc lập trong môi trường yên tĩnh.',
    capacity: '1 người',
    amenities: 'Wi-fi tốc độ cao, Điều hòa, Tai nghe chống ồn, Ổ cắm điện',
    price: '15.000 VND/tiếng'
  },
  {
    id: 4,
    image: roomCardImage,
    name: 'Phòng POD nhóm D',
    address: 'Quận 7, Hồ Chí Minh',
    description: 'Phòng rộng rãi, được trang bị đầy đủ tiện ích, phù hợp cho các nhóm làm việc từ 5 - 6 người.',
    capacity: '5 - 6 người',
    amenities: 'Wi-fi tốc độ cao, Máy chiếu, Điều hòa, Bàn ghế tiện lợi',
    price: '30.000 VND/tiếng'
  },
  {
    id: 5,
    image: roomCardImage,
    name: 'Phòng POD hội họp E',
    address: 'Quận Bình Thạnh, Hồ Chí Minh',
    description: 'Không gian lý tưởng cho các cuộc họp nhóm hoặc hội thảo nhỏ với sức chứa lên đến 10 người.',
    capacity: '8 - 10 người',
    amenities: 'Wi-fi tốc độ cao, Máy chiếu, Điều hòa, Nước uống miễn phí',
    price: '50.000 VND/tiếng'
  },
  {
    id: 6,
    image: roomCardImage,
    name: 'Phòng POD cao cấp F',
    address: 'Quận 5, Hồ Chí Minh',
    description:
      'Phòng POD cao cấp với nội thất sang trọng, phục vụ cho các cuộc họp quan trọng hoặc làm việc trong môi trường chuyên nghiệp.',
    capacity: '4 - 5 người',
    amenities: 'Wi-fi tốc độ cao, Điều hòa, Ghế da cao cấp, Máy chiếu, Nước uống miễn phí',
    price: '40.000 VND/tiếng'
  },
  {
    id: 7,
    image: roomCardImage,
    name: 'Phòng POD sáng tạo G',
    address: 'Quận Phú Nhuận, Hồ Chí Minh',
    description:
      'Phòng POD với thiết kế sáng tạo và tiện nghi cao cấp, lý tưởng cho các công việc đòi hỏi sự sáng tạo cao.',
    capacity: '3 - 4 người',
    amenities: 'Wi-fi tốc độ cao, Điều hòa, Ghế tựa thoải mái, Nước uống miễn phí',
    price: '35.000 VND/tiếng'
  },
  {
    id: 8,
    image: roomCardImage,
    name: 'Phòng POD công nghệ H',
    address: 'Quận 10, Hồ Chí Minh',
    description:
      'Không gian làm việc công nghệ cao với các thiết bị hiện đại phục vụ cho việc họp trực tuyến hoặc làm việc nhóm.',
    capacity: '5 - 7 người',
    amenities: 'Wi-fi tốc độ cao, Máy chiếu 4K, Điều hòa, Tai nghe chống ồn',
    price: '45.000 VND/tiếng'
  },
  {
    id: 9,
    image: roomCardImage,
    name: 'Phòng POD yên tĩnh I',
    address: 'Quận 4, Hồ Chí Minh',
    description:
      'Phòng POD được thiết kế để mang lại không gian yên tĩnh tối đa, giúp tăng cường sự tập trung và hiệu quả làm việc.',
    capacity: '2 - 3 người',
    amenities: 'Wi-fi tốc độ cao, Tai nghe chống ồn, Điều hòa, Ghế thư giãn',
    price: '22.000 VND/tiếng'
  },
  {
    id: 10,
    image: roomCardImage,
    name: 'Phòng POD sang trọng J',
    address: 'TP.Thủ Đức, Hồ Chí Minh',
    description:
      'Phòng làm việc sang trọng, phù hợp cho các cuộc họp quan trọng hoặc làm việc trong không gian chuyên nghiệp.',
    capacity: '3 - 5 người',
    amenities: 'Wi-fi tốc độ cao, Máy chiếu, Điều hòa, Ghế da, Nước uống miễn phí',
    price: '50.000 VND/tiếng'
  },
  {
    id: 11,
    image: roomCardImage,
    name: 'Phòng POD ban công K',
    address: 'Quận Tân Bình, Hồ Chí Minh',
    description: 'Phòng POD với ban công và view đẹp, lý tưởng cho các cuộc họp sáng tạo hoặc làm việc ngoài trời.',
    capacity: '4 - 6 người',
    amenities: 'Wi-fi tốc độ cao, Bàn ngoài trời, Ghế tựa thoải mái, Điều hòa',
    price: '28.000 VND/tiếng'
  },
  {
    id: 12,
    image: roomCardImage,
    name: 'Phòng POD hiện đại L',
    address: 'Quận 9, Hồ Chí Minh',
    description:
      'Phòng POD hiện đại với các thiết bị công nghệ tiên tiến, mang lại trải nghiệm làm việc chuyên nghiệp.',
    capacity: '3 - 5 người',
    amenities: 'Wi-fi tốc độ cao, Điều hòa, Máy chiếu, Ghế thư giãn',
    price: '32.000 VND/tiếng'
  }
]

export default function Home() {
  const [location, setLocation] = useState('')
  const [roomType, setRoomType] = useState('')
  const [date, setDate] = useState<Moment | null>()
  const [time, setTime] = useState<string>('')
  const handleBookRoom = (roomId: number) => {
    console.log(`Booking room with ID: ${roomId}`)
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Secion */}
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
          {podRooms.map((room) => (
            <PODRoomCard
              image={room.image}
              name={room.name}
              address={room.address}
              description={room.description}
              capacity={room.capacity}
              amenities={room.amenities}
              price={room.price}
              onBookRoom={() => handleBookRoom(room.id)}
              key={room.id}
            />
          ))}
        </Grid>
        {/* Rooms Section Pagination Button */}
        <Grid size={12}>
          <Pagination count={10} showFirstButton showLastButton />
        </Grid>
      </Grid>
    </Box>
  )
}
