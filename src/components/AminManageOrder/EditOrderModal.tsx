import React, { useEffect, useState } from 'react'
import {
  FormControl,
  Modal,
  Box,
  useTheme,
  Typography,
  IconButton,
  TextField,
  Autocomplete,
  Divider,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Button
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import { Account, Order, OrderStatus, orderStatus } from '~/apis/orderApi'
import { GridValidRowModel } from '@mui/x-data-grid'
import { slotType } from '~/contexts/BookingContext'
import CloseIcon from '@mui/icons-material/Close'
import Calendar from '../Calendar/Calendar'

interface EditOrderModalProps {
  open: boolean
  onClose: () => void
  order: Order | null
  setOrders: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>
  staffList: Account[]
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ open, onClose, order, setOrders, staffList }) => {
  const date = moment(order?.orderDetails[0].endTime)
  const [selectedDate, setSelectedDate] = useState<Moment>(moment(date, 'DD/MM/YYYY'))
  const [status, setStatus] = useState<OrderStatus | null>(order?.orderDetails[0].status || null)
  const [staffId, setStaffId] = useState<string>(order?.orderDetails[0]?.orderHandler?.id || '')
  const [selectedDates, setSelectedDates] = useState<Moment[]>([])
  const [selectedSlots, setSelectedSlots] = useState<slotType[]>([])
  useEffect(() => {
    if (order) {
      setStatus(order.orderDetails[0].status || '')
      setStaffId(order?.orderDetails?.[0]?.orderHandler?.id || '')
    }
  }, [order])

  useEffect(() => {
    if (order) {
      setSelectedDates([selectedDate])
      const listSlotFull: slotType[] = []
      if (!order || !order.orderDetails || order.orderDetails.length === 0) {
        return
      }
      order.orderDetails.map((orderDetail) => {
        const slot: slotType = (moment(orderDetail.startTime).format('HH:mm').toString() +
          ' - ' +
          moment(orderDetail.endTime).format('HH:mm').toString()) as slotType
        listSlotFull.push(slot)
      })
      const listSlot = [...new Set(listSlotFull)]
      setSelectedSlots(listSlot)
    }
  }, [order])

  const theme = useTheme()
  const listSlotFull: slotType[] = []
  if (!order || !order.orderDetails || order.orderDetails.length === 0) {
    return null
  }
  order.orderDetails.map((orderDetail) => {
    const slot: slotType = (moment(orderDetail.startTime).format('HH:mm').toString() +
      ' - ' +
      moment(orderDetail.endTime).format('HH:mm').toString()) as slotType
    listSlotFull.push(slot)
  })
  const listSlot = [...new Set(listSlotFull)]

  const handleStaffChange = (orderId: string, newStaffId: string) => {
    console.log(`Order ID: ${orderId}, New Staff ID: ${newStaffId}`)
    setStaffId(newStaffId)
    setOrders((prevRows) => prevRows.map((row) => (row.id === orderId ? { ...row, staffId: newStaffId } : row)))
  }

  const handleUpdateOrder = () => {}

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '70vw',
          height: '80vh',
          padding: 3,
          margin: 'auto',
          bgcolor: theme.palette.grey[100],
          borderRadius: 2,
          marginTop: '70px',
          overflowY: 'auto'
        }}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' gap='10px'>
            <Typography variant='h5' sx={{ marginTop: '20px' }} fontWeight='500'>
              ID Đơn hàng:
            </Typography>
            <Typography variant='h5' sx={{ marginTop: '20px' }}>
              {order.id}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: 3, marginY: 2, bgcolor: 'white', borderRadius: '5px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, paddingRight: 2 }}>
              <FormControl fullWidth size='small'>
                <Autocomplete
                  value={status}
                  onChange={(_, status) => setStatus(status as OrderStatus)}
                  options={orderStatus}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => <TextField {...params} label='Tình trạng' size='small' />}
                  sx={{
                    '.MuiAutocomplete-inputRoot': {
                      height: '52px'
                    }
                  }}
                />
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, paddingX: 2 }}>
              <FormControl fullWidth>
                <InputLabel id='staff-select-label'>Nhân viên phụ trách</InputLabel>
                <Select
                  labelId='staff-select-label'
                  label='Nhân viên phụ trách'
                  value={staffId}
                  onChange={(e) => handleStaffChange(order.id, e.target.value)}
                  displayEmpty
                  renderValue={() => {
                    const selectedStaff = staffList.find((staff) => staff.id === staffId)
                    return selectedStaff ? selectedStaff.name : 'Chọn nhân viên'
                  }}
                  sx={{ color: 'black' }}
                >
                  <MenuItem value='' disabled>
                    Chọn nhân viên
                  </MenuItem>
                  {staffList.map((staff) => (
                    <MenuItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, paddingLeft: 2 }}>
              <TextField
                label='Chi nhánh'
                size='small'
                variant='outlined'
                value={order.orderDetails[0].buildingAddress}
                InputProps={{
                  readOnly: true
                }}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '52px'
                  },
                  '& .MuiInputLabel-root': {
                    lineHeight: '52px',
                    top: '-10px'
                  },
                  '& .MuiInputBase-input': {
                    height: '52px',
                    padding: '0 14px'
                  }
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <Box sx={{ flex: 1, paddingRight: 2 }}>
              <FormControl fullWidth size='small'>
                <Autocomplete
                  multiple
                  options={listSlot}
                  value={listSlot}
                  disableCloseOnSelect
                  limitTags={1}
                  sx={{
                    '.MuiAutocomplete-inputRoot': {
                      opacity: 1,
                      pointerEvents: 'none',
                      height: '52px'
                    },
                    '.MuiAutocomplete-endAdornment': {
                      display: 'none'
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        readOnly: true
                      }}
                      label='Slot'
                      size='small'
                      disabled
                    />
                  )}
                />
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, paddingX: 2 }}>
              <DatePicker
                label='Ngày đặt'
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiInputBase-root': {
                        height: '52px'
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 14px'
                      }
                    },
                    InputProps: {
                      readOnly: true,
                      endAdornment: <IconButton onMouseDown={(e) => e.preventDefault()} edge='end' />
                    }
                  }
                }}
                onOpen={() => {}}
                format={DEFAULT_DATE_FORMAT}
              />
            </Box>
            <Box sx={{ flex: 1, paddingLeft: 2 }}>
              <FormControl fullWidth size='small'>
                <Autocomplete
                  value={order.orderDetails[0].servicePackage}
                  options={order.orderDetails[0].servicePackage ? [order.orderDetails[0].servicePackage] : []}
                  getOptionLabel={(option) => option.name}
                  disableCloseOnSelect
                  sx={{
                    '.MuiAutocomplete-inputRoot': {
                      opacity: 1,
                      pointerEvents: 'none',
                      height: '52px'
                    },
                    '.MuiAutocomplete-endAdornment': {
                      display: 'none'
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        readOnly: true
                      }}
                      label='Gói dịch vụ'
                      size='small'
                    />
                  )}
                />
              </FormControl>
            </Box>
          </Box>
        </Box>
        <Grid container sx={{ width: '100%' }}>
          <Grid
            item
            lg={6}
            md={6}
            xs={12}
            sx={{ paddingRight: '12px', marginTop: '10px', bgcolor: 'white', padding: 2, borderRadius: '5px' }}
          >
            <Calendar selected={selectedDates} slots={selectedSlots} />
          </Grid>
          <Grid item lg={6} md={6} xs={12} sx={{ paddingLeft: '12px', marginTop: '10px' }}>
            <Box sx={{ padding: 3, bgcolor: 'white', borderRadius: '5px' }}>
              <Typography variant='h6' sx={{ marginBottom: 3 }}>
                Khách hàng: {order.orderDetails[0].customer.name}
              </Typography>
              <Typography variant='body1' sx={{ marginBottom: 1 }}>
                Email: {order.orderDetails[0].customer.email}
              </Typography>
              <Typography variant='body1' sx={{ marginBottom: 1 }}>
                Hạng: {order.orderDetails[0].customer.rankingName || 'Chưa có'}
              </Typography>
            </Box>
            <Box sx={{ padding: 3, marginY: 2, bgcolor: 'white', borderRadius: '5px' }}>
              <Typography variant='h6' sx={{ marginBottom: 3 }}>
                Chi tiết đơn hàng
              </Typography>
              {order.orderDetails.map((orderDetail, index) => (
                <Box key={index} sx={{}}>
                  <Typography variant='body1' sx={{ marginBottom: 1 }}>
                    Phòng: {orderDetail.roomName}
                  </Typography>
                  <Box>
                    {orderDetail.amenities.map((amenity, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='body2'>{amenity.name}</Typography>
                        <Typography variant='body2'>{amenity.price}</Typography>
                      </Box>
                    ))}
                  </Box>
                  {index !== order.orderDetails.length - 1 && <Divider sx={{ marginY: 2 }} />}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button variant='contained' onClick={handleUpdateOrder}>
            Cập nhật đơn hàng
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default EditOrderModal
