import React, { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  Box,
  Typography,
  useTheme,
  IconButton,
  Grid,
  Divider,
  Backdrop,
  CircularProgress
} from '@mui/material'
import moment, { Moment } from 'moment'
import { BookingInfo, slotType } from '~/contexts/BookingContext'
import CloseIcon from '@mui/icons-material/Close'
import { Account, createOrderAD } from '~/apis/orderApi'
import Calendar from '../Calendar/Calendar'
import HeaderOrderComponent from './CreateOrderComponents/HeaderOrderComponent'
import CustomerOrderCard from './CreateOrderComponents/CustomerOrderCard'
import AddAmenityOrder from './CreateOrderComponents/AddAmenityOrder'
import BookingDetailsCustom from './CreateOrderComponents/BookingDetailsCustom'
import PaymentBox from './CreateOrderComponents/PaymentBox'
import { toast } from 'react-toastify'

interface CreateOrderModalProps {
  open: boolean
  onClose: () => void
  refetch: () => void
}

const initialBookingData: BookingInfo = {
  roomType: null,
  selectedRooms: [],
  date: moment().format('DD-MM-YYYY').toString(),
  timeSlots: [],
  servicePackage: null
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ open, onClose, refetch }) => {
  const theme = useTheme()

  const [selectedDates, setSelectedDates] = useState<Moment[]>([])
  const [selectedSlots, setSelectedSlots] = useState<slotType[]>([])
  const [customer, setCustomer] = useState<Account | null>(null)
  const [bookingData, setBookingData] = useState<BookingInfo>(initialBookingData)
  const [openPayment, setOpenPayment] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setBookingData(initialBookingData)
    setCustomer(null)
    setOpenPayment(false)
    setLoading(false)
    setSelectedSlots([])
  }, [open])

  const handleOfflinePayment = async () => {
    setLoading(true)
    if (!customer) return
    const response = await createOrderAD(bookingData, customer)
    if (response.code === 201) {
      toast.success('Tạo đơn hàng thành công')
      onClose()
      refetch()
    }
    setLoading(false)
  }

  const handleCardPayment = async () => {
    if (!customer) return
    const response = await createOrderAD(bookingData, customer)
    if (response.code == 201) {
      onClose()
      toast.success('Tạo đơn hàng thành công')
      refetch()
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '70vw',
          height: '90vh',
          margin: '40px auto',
          p: 3,
          bgcolor: theme.palette.grey[100],
          borderRadius: 2,
          overflowY: 'auto'
        }}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5' fontWeight={500} mt={2}>
            Tạo đơn hàng
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <HeaderOrderComponent
          bookingData={bookingData}
          setBookingData={setBookingData}
          setSelectedDates={setSelectedDates}
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
        />

        <Grid container spacing={2}>
          <Grid item lg={6} md={6}>
            <Calendar selected={selectedDates} slots={selectedSlots} />
          </Grid>

          <Grid item lg={6} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CustomerOrderCard customer={customer} setCustomer={setCustomer} bookingData={bookingData} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item lg={6} md={6}>
            <AddAmenityOrder bookingData={bookingData} setBookingData={setBookingData} />
          </Grid>

          <Grid item lg={6} md={6}>
            <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
              <BookingDetailsCustom bookingData={bookingData} setBookingData={setBookingData} />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant='text' onClick={onClose}>
            Hủy
          </Button>
          <Button variant='outlined' onClick={handleOfflinePayment}>
            Thanh toán tiền mặt
          </Button>
          <Button variant='outlined' onClick={() => setOpenPayment(true)}>
            Thanh toán qua thẻ
          </Button>
        </Box>

        {openPayment && <PaymentBox bookingData={bookingData} handleCreateOrder={handleCardPayment} />}

        <Backdrop open={loading} sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>
    </Modal>
  )
}

export default CreateOrderModal
