import { Autocomplete, Box, Button, Checkbox, Chip, FormControl, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import moment, { Moment } from 'moment'
import homePageBanner from '~/assets/images/homePageBanner.png'
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
import { useGetRoomsByTypeAndSlots } from '~/queries/useFilterRoom'
import { Link, useParams } from 'react-router-dom'
import { BookingInfo, useBookingContext } from '~/contexts/BookingContext'
import { Helmet } from 'react-helmet-async'

export default function RoomDetail() {
  const params = useParams<{ id: string }>()
  const [selectedDate, setSelectedDate] = useState<Moment | null>(moment())
  const [selectedDates, setSelectedDates] = useState<Moment[]>([])
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<slotType[]>([])
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const BookingContext = useBookingContext()
  const bookingData = BookingContext?.bookingData
  const setBookingData = BookingContext?.setBookingData
  const { data: servicePackage, isSuccess } = getAllServicePackage()

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
        if (selectedPackage.id == '1') {
          dateList.push(moment(selectedDate).add(1, 'week'))
          dateList.push(moment(selectedDate).add(2, 'week'))
          dateList.push(moment(selectedDate).add(3, 'week'))
        } else if (selectedPackage.id == '2') {
          for (let i = 0; i < 30; i++) {
            dateList.push(moment(selectedDate).add(i, 'days'))
          }
        }
      }
    }
    setSelectedDates(dateList)
  }, [selectedDate, selectedPackage])

  const slotsFormmated = useMemo(() => {
    return selectedSlots.map((slot) => {
      const [startTime, endTime] = slot.split('-')
      const formattedStartTime = moment(selectedDate)
        .set({
          hour: parseInt(startTime.split(':')[0]),
          minute: parseInt(startTime.split(':')[1]),
          second: 0,
          millisecond: 0
        })
        .format('YYYY-MM-DDTHH:mm:ss')
      const formattedEndTime = moment(selectedDate)
        .set({
          hour: parseInt(endTime.split(':')[0]),
          minute: parseInt(endTime.split(':')[1]),
          second: 0,
          millisecond: 0
        })
        .format('YYYY-MM-DDTHH:mm:ss')
      return `${formattedStartTime}_${formattedEndTime}`
    })
  }, [selectedSlots, selectedDate])

  const { data: roomList, refetch: roomListRefetch } = useGetRoomsByTypeAndSlots({
    typeId: Number(params.id),
    slots: slotsFormmated
  })

  useEffect(() => {
    roomListRefetch()
  }, [selectedSlots, selectedDate, roomListRefetch])

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
            <ImageView images={selectedRooms[0]?.image ? [selectedRooms[0]?.image] : [homePageBanner]} />
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
                      options={SLOT}
                      value={selectedSlots}
                      onChange={(_, slots) => {
                        setSelectedSlots(slots as slotType[])
                      }}
                      disableCloseOnSelect
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
                      renderInput={(params) => <TextField {...params} label='Slot' size='small' />}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12}>
                  <FormControl fullWidth size='small'>
                    <Autocomplete
                      multiple
                      options={roomList?.data.data || []}
                      limitTags={2}
                      disableCloseOnSelect
                      value={selectedRooms}
                      onChange={(_, rooms) => {
                        return setSelectedRooms(rooms)
                      }}
                      getOptionLabel={(option) => option.name}
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
                  <Link to='/order-detail/1' state={{ from: location.pathname }}>
                    <Button variant='contained' color='primary' fullWidth>
                      Đặt phòng
                    </Button>
                  </Link>
                </Grid>
                <Grid size={12}>
                  <Calendar selected={selectedDates} slots={selectedSlots} />
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
