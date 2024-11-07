import { Autocomplete, Box, Button, Checkbox, Chip, FormControl, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import moment, { Moment } from 'moment'
import { DatePicker } from '@mui/x-date-pickers'
import { formatCurrency } from '~/utils/currency'
import ImageView from '~/components/ImageView/ImageView'
import Calendar from '~/components/Calendar/Calendar'
import { SLOT } from '~/constants/slot'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import { useEffect, useMemo, useState } from 'react'
import { ServicePackage, Room } from '~/constants/type'
import { RoomContextType, slotType } from '~/contexts/BookingContext'
import { getAllServicePackage } from '~/queries/useServicePackage'
import { useGetRoomsByTypeAndDate, useGetSlotsByRoomsAndDate, useGetUnavailableRooms } from '~/queries/useFilterRoom'
import { useNavigate, useParams } from 'react-router-dom'
import { BookingInfo, useBookingContext } from '~/contexts/BookingContext'
import { Helmet } from 'react-helmet-async'
import { useAppContext } from '~/contexts/AppProvider'
import { useGetImagesByRoomTypeId } from '~/queries/useImage'
import { ImageRoomTypeType } from '~/schemaValidations/roomImage.schema'

export default function RoomDetail() {
  const params = useParams<{ id: string }>()
  const [selectedDate, setSelectedDate] = useState<Moment | null>(moment())
  const [selectedDates, setSelectedDates] = useState<Moment[]>([])
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<slotType[]>([])
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const [images, setImages] = useState<ImageRoomTypeType[]>([])
  const BookingContext = useBookingContext()
  const { account } = useAppContext()

  const bookingData = BookingContext?.bookingData
  const setBookingData = BookingContext?.setBookingData
  const { data: servicePackage, isSuccess } = getAllServicePackage()
  const {
    data: unavailableRooms,
    refetch: unavailableRoomsRefetch,
    isFetching
  } = useGetUnavailableRooms({
    roomIds: selectedRooms?.map((room) => room.id) || [],
    startTime: selectedDates[0]?.format('YYYY-MM-DDT00:01:00'),
    endTime: selectedDates[selectedDates.length - 1]?.format('YYYY-MM-DDT23:59:00')
  })

  // const roomsError = useMemo(() => {
  //   const error =
  //     unavailableRooms?.data.data.filter((room) => {
  //       return room.slots.length >= 1
  //     }) || []

  //   if (error.length > 0) {
  //     toast.error('Phòng đã đầy')
  //   }
  //   return error
  // }, [unavailableRooms])
  const navigate = useNavigate()
  useEffect(() => {
    if (servicePackage?.data.data) {
      setSelectedPackage(servicePackage.data.data[0])
    }
  }, [servicePackage])
  useEffect(() => {
    unavailableRoomsRefetch()
  }, [selectedDates, selectedRooms, unavailableRoomsRefetch])
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    const dateList = []
    if (selectedDate) {
      dateList.push(selectedDate)
      if (selectedPackage) {
        if (selectedPackage.id == '2') {
          for (let i = 0; i < 7; i++) {
            dateList.push(moment(selectedDate).add(i, 'days'))
          }
        } else if (selectedPackage.id == '3') {
          dateList.push(moment(selectedDate).add(1, 'week'))
          dateList.push(moment(selectedDate).add(2, 'week'))
          dateList.push(moment(selectedDate).add(3, 'week'))
        } else if (selectedPackage.id == '4') {
          for (let i = 1; i < 30; i++) {
            dateList.push(moment(selectedDate).add(i, 'days'))
          }
        }
      }
    }
    setSelectedDates(dateList)
  }, [selectedDate, selectedPackage])

  const { data: roomList, refetch: roomListRefetch } = useGetRoomsByTypeAndDate({
    typeId: Number(params.id),
    date: selectedDate?.format('YYYY-MM-DD') || ''
  })

  const { data: slotData, refetch: slotListRefetch } = useGetSlotsByRoomsAndDate({
    roomIds: selectedRooms.map((room) => room.id),
    date: selectedDate?.format('YYYY-MM-DD') || ''
  })

  const { data: imagesData } = useGetImagesByRoomTypeId(Number(params.id))
  useEffect(() => {
    if (imagesData) {
      if (selectedRooms.length > 0) {
        const roomIds = selectedRooms.map((room) => room.id)
        setImages(imagesData.data.data.filter((image) => roomIds.includes(image.roomId)))
      } else {
        setImages(imagesData.data.data)
      }
    }
  }, [selectedRooms, imagesData])
  const slotList = useMemo(() => {
    return (
      slotData?.data.data.map((slot) => {
        return moment(slot.startTime).format('HH:mm') + ' - ' + moment(slot.endTime).format('HH:mm')
      }) || SLOT
    )
  }, [slotData])

  useEffect(() => {
    roomListRefetch()
  }, [selectedDate, roomListRefetch])

  useEffect(() => {
    slotListRefetch()
  }, [selectedRooms, selectedDate, slotListRefetch])

  useEffect(() => {
    setSelectedSlots((currentSlots) => currentSlots.filter((slot) => slotList.includes(slot)))
  }, [slotList])

  useEffect(() => {
    if (roomList?.data.data) {
      setSelectedRooms((currentRooms) => {
        return currentRooms.filter((room) => roomList.data.data.find((r) => r.id === room.id))
      })
    }
  }, [roomList])

  useEffect(() => {
    setBookingData?.((prev: BookingInfo) => {
      const price = bookingData?.roomType?.price
      const listRoom: RoomContextType[] = selectedRooms.map((room) => {
        return {
          id: room.id,
          name: room.name,
          price: price,
          image: room.image,
          amenities: []
        }
      })
      return {
        ...prev,
        selectedRooms: listRoom || [],
        date: selectedDate?.format('YYYY-MM-DD') || null,
        timeSlots: selectedSlots || [],
        servicePackage: selectedPackage || null
      }
    })
  }, [selectedRooms, selectedDate, selectedSlots, selectedPackage, bookingData, setBookingData])

  const checkData = useMemo(() => {
    return selectedRooms.length > 0 && selectedDate && selectedSlots.length > 0 && selectedPackage
  }, [selectedRooms, selectedDate, selectedSlots, selectedPackage])

  const handleBooking = () => {
    if (!account) {
      localStorage.setItem('redirectPath', location.pathname)
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    if (checkData) {
      navigate('/order-detail/1', { state: { from: location.pathname } })
    }
  }

  return (
    <Box
      sx={{
        padding: { xs: '24px 24px', sm: '24px 104px', lg: '24px 256px' },
        display: 'flex',
        flexDirection: 'column',
        gap: '28px'
      }}
    >
      <Helmet>
        <title> {bookingData?.roomType?.name || 'Loại phòng'} | POD System</title>
        <meta name='description' content='Chọn Phòng Hoàn Hảo Cho Mọi Dịp - Từ Họp Nhóm Đến Làm Việc Cá Nhân' />
      </Helmet>
      <Grid container size={12} spacing={6}>
        <Grid container size={{ xs: 12, md: 6 }} rowSpacing={1}>
          <Box sx={{ width: '100%' }}>
            <ImageView images={images} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ gap: '40px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
                {bookingData?.roomType?.name}
              </Typography>
              <Typography variant='h5' color='primary'>
                {formatCurrency(bookingData?.roomType?.price ?? 0)}
                <Typography color='neutral' display={'inline'}>
                  /tiếng
                </Typography>
              </Typography>
            </Box>
            <Box>
              <Grid container size={12} spacing={2}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <DatePicker
                    label='Ngày đặt'
                    minDate={moment()}
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    format={DEFAULT_DATE_FORMAT}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <FormControl fullWidth size='small'>
                    <Autocomplete
                      multiple
                      options={roomList?.data.data || []}
                      limitTags={2}
                      value={selectedRooms}
                      onChange={(_, rooms) => {
                        return setSelectedRooms(rooms)
                      }}
                      getOptionLabel={(option) => option.name}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index })
                          return (
                            <Chip
                              size='small'
                              variant='outlined'
                              label={option.name}
                              key={key}
                              onClick={() => {}}
                              {...tagProps}
                              sx={{ margin: '0px 3px !important' }}
                            />
                          )
                        })
                      }
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props
                        return (
                          <li key={key} {...optionProps}>
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                              checkedIcon={<CheckBoxIcon fontSize='small' />}
                              style={{ marginRight: 8 }}
                              checked={selected}
                              size='small'
                            />
                            {option.name}
                          </li>
                        )
                      }}
                      renderInput={(params) => <TextField {...params} label='Chọn phòng' size='small' />}
                    />
                  </FormControl>
                </Grid>
                {selectedRooms.length > 0 && (
                  <Grid size={12}>
                    <FormControl fullWidth size='small'>
                      <Autocomplete
                        multiple
                        options={slotList}
                        value={selectedSlots}
                        onChange={(_, slots) => {
                          setSelectedSlots(slots as slotType[])
                        }}
                        limitTags={1}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index })
                            return (
                              <Chip
                                size='small'
                                variant='outlined'
                                label={option}
                                key={key}
                                onClick={() => {}}
                                {...tagProps}
                                sx={{ margin: '0px 3px !important' }}
                              />
                            )
                          })
                        }
                        renderOption={(props, option, { selected }) => {
                          const { key, ...optionProps } = props
                          return (
                            <li key={key} {...optionProps}>
                              <Checkbox
                                icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                                checkedIcon={<CheckBoxIcon fontSize='small' />}
                                style={{ marginRight: 8 }}
                                checked={selected}
                                size='small'
                              />
                              {option}
                            </li>
                          )
                        }}
                        renderInput={(params) => <TextField {...params} label='Chọn khung giờ' size='small' />}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid size={12}>
                  <FormControl fullWidth size='small'>
                    <Autocomplete
                      value={selectedPackage}
                      onChange={(_, servicePackage) => {
                        setSelectedPackage(servicePackage)
                      }}
                      options={isSuccess ? servicePackage.data.data : []}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField {...params} label='Chọn gói' size='small' />}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    disabled={!checkData || isFetching}
                    onClick={handleBooking}
                  >
                    Đặt phòng
                  </Button>
                  {/* </Link> */}
                </Grid>
                <Grid size={12}>
                  <Calendar rooms={selectedRooms} selected={selectedDates} slots={selectedSlots} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ padding: '24px 40px', borderRadius: '16px', border: '1px solid ', minHeight: '200px' }}>
        <Typography variant='h4' color='primary' fontWeight={'bold'}>
          Chi tiết
        </Typography>
        <Typography variant='subtitle2'>{bookingData?.roomType?.building?.address}</Typography>
      </Box>
    </Box>
  )
}
