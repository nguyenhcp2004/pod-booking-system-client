import { Box, Button, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BookingDetails from '~/components/BookingDetails/BookingDetails'
import { tokens } from '~/themes/theme'
import moment, { Moment } from 'moment'
import Calendar from '~/components/Calendar/Calendar'
import { useEffect, useState } from 'react'
import { slotType, useBookingContext } from '~/contexts/BookingContext'
import { toast } from 'react-toastify'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Helmet } from 'react-helmet-async'
import { useAppContext } from '~/contexts/AppProvider'
import { isValidVietnamPhoneNumber } from '~/utils/utils'
import { UpdateAccountPhoneNumberType } from '~/schemaValidations/account.schema'
import { useUpdateAccountPhoneNumber } from '~/queries/useAccount'
import { Room } from '~/constants/type'
import { useGetRoomsByTypeAndDate } from '~/queries/useFilterRoom'
import envConfig from '~/constants/config'

interface CommonProps {
  onNext: () => void
}

export const BookingInfo: React.FC<CommonProps> = (props) => {
  const colors = tokens('light')
  const bookingContext = useBookingContext()
  const [selectedDates, setSelectedDates] = useState<Moment[]>([])
  const [selectedSlots, setSelectedSlots] = useState<slotType[]>([])
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const bookingData = bookingContext!.bookingData
  const socketCL = new SockJS(envConfig.VITE_SOCKET_URL)
  const client = Stomp.over(socketCL)
  const { account: account, setAccount } = useAppContext()
  const [phoneNumber, setPhoneNumber] = useState(account?.phoneNumber || '')
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const updateAccountPhoneNumberMutation = useUpdateAccountPhoneNumber()

  useEffect(() => {
    const dateList = []

    if (bookingData) {
      const initialDate = moment(bookingData.date)
      dateList.push(initialDate)
      setSelectedSlots(bookingData.timeSlots)
      const selectedPackage = bookingData.servicePackage
      if (selectedPackage) {
        if (selectedPackage.id == '2') {
          for (let i = 0; i < 7; i++) {
            dateList.push(moment(initialDate).add(i, 'days'))
          }
        } else if (selectedPackage.id == '3') {
          dateList.push(moment(initialDate).add(1, 'week'))
          dateList.push(moment(initialDate).add(2, 'week'))
          dateList.push(moment(initialDate).add(3, 'week'))
        } else if (selectedPackage.id == '4') {
          for (let i = 0; i < 30; i++) {
            dateList.push(moment(initialDate).add(i, 'days'))
          }
        }
      }
      setSelectedDates(dateList)
    }
  }, [bookingData, bookingData.servicePackage?.id])

  const { data: roomList } = useGetRoomsByTypeAndDate({
    typeId: Number(bookingData?.roomType?.id),
    date: bookingData?.date ? moment(bookingData.date).format('YYYY-MM-DD') : ''
  })

  useEffect(() => {
    if (roomList?.data.data && bookingData.selectedRooms) {
      setSelectedRooms(() => {
        return roomList.data.data.filter((room) =>
          bookingData.selectedRooms.some((selectedRoom) => selectedRoom.id === room.id)
        )
      })
    }
  }, [roomList, bookingData.selectedRooms])

  useEffect(() => {
    client.connect({}, () => {
      client.subscribe('/topic/payments', (data) => {
        const roomId = JSON.parse(data.body)
        if (bookingData.selectedRooms.some((room) => room.id == roomId.id)) {
          toast.success(`Phòng ${roomId.name} vừa được đặt`)
        }
      })
    })

    return () => {
      if (client.connected) {
        client.disconnect(() => {})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData]) // Không nên thêm client vào dependency này vì thằng stomp nó vào đây lại tạo lại 1 client mới
  // Dẫn đến thông báo 2 lần
  // Đồng thời thì thằng stompjs nó khó chịu là vào mỗi page thì mình sẽ phải tạo 1 socket mới luôn, tức dù mình navigate nó cũng disconnect
  if (!bookingData) return null

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value)
  }
  const handleNext = async () => {
    if (!account?.phoneNumber) {
      if (!isValidVietnamPhoneNumber(phoneNumber)) {
        setPhoneError('Số điện thoại không hợp lệ')
        return
      }
      const updateAccountPhoneNumber: UpdateAccountPhoneNumberType = {
        id: account?.id as string,
        phoneNumber: phoneNumber
      }

      try {
        await updateAccountPhoneNumberMutation.mutateAsync(updateAccountPhoneNumber)
        setAccount((prev) => (prev ? { ...prev, phoneNumber: phoneNumber } : prev))
        setPhoneError(null)
      } catch {
        toast.error('Cập nhật số điện thoại thất bại')
      }
    }
    props.onNext()
  }

  return (
    <Box id='hehe' sx={{ height: '100%', marginX: '104px' }}>
      <Helmet>
        <title>Thông tin đặt phòng | POD System</title>
        <meta name='description' content='Chi tiết đặt phòng: Tìm phòng phù hợp với lịch trình của bạn' />
      </Helmet>
      <Grid container spacing={2} sx={{}}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ paddingRight: '24px !important', paddingTop: '0px !important' }}>
          <Box>
            <Box sx={{ padding: '20px 20px 20px 20px', minHeight: '253px', background: '#FFF' }}>
              <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700' }}>
                Thông tin khách hàng
              </Typography>
              <Box sx={{ paddingTop: '24px' }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
                    <TextField
                      id='outlined-required'
                      label='Tên'
                      defaultValue={account?.name || ''}
                      fullWidth
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
                    <TextField
                      id='outlined-required'
                      label='Số điện thoại'
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      fullWidth
                      error={!!phoneError}
                      helperText={phoneError}
                      InputProps={{
                        readOnly: account?.phoneNumber ? true : false
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }} sx={{ marginBottom: 'auto', paddingTop: '25px !important' }}>
                    <TextField
                      id='outlined-required'
                      label='Email'
                      defaultValue={account?.email || ''}
                      fullWidth
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box sx={{ marginTop: '24px', background: '#FFF' }}>
              <Box sx={{ padding: '20px' }}>
                <Typography variant='h5' sx={{ color: colors.primary[500], fontWeight: '700', paddingBottom: '20px' }}>
                  Lịch đặt
                </Typography>
                <Box>
                  <Grid size={{ xs: 12 }}>
                    <Calendar rooms={selectedRooms} selected={selectedDates} slots={selectedSlots} />
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }} sx={{ paddingLeft: '0px !important', paddingTop: '0px !important' }}>
          <Box>
            <BookingDetails />
          </Box>
          <Grid
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '20px',
              paddingTop: 3,
              backgroundColor: 'white'
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Button
                onClick={handleNext}
                fullWidth
                sx={{ background: colors.primary[500], color: '#FFF', borderRadius: 'var(--12, 96px)' }}
              >
                Đặt phòng
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
