import React, { useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Card,
  useTheme,
  TextField,
  FormControl,
  Autocomplete,
  Divider
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Order } from '~/apis/orderApi'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import { slotType } from '~/contexts/BookingContext'

interface ViewOrderModalProps {
  open: boolean
  onClose: () => void
  order: Order | null
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ open, onClose, order }) => {
  const date = moment(order?.orderDetails[0].endTime)
  const [selectedDate] = useState<Moment>(moment(date, 'DD/MM/YYYY'))
  const theme = useTheme()
  if (!order) return null
  const listSlotFull: slotType[] = []
  order.orderDetails.map((orderDetail) => {
    const slot: slotType = (moment(orderDetail.startTime).format('HH:mm').toString() +
      ' - ' +
      moment(orderDetail.endTime).format('HH:mm').toString()) as slotType
    listSlotFull.push(slot)
  })
  const listSlot = [...new Set(listSlotFull)]
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
        <Card sx={{ padding: 3, marginY: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, paddingRight: 2 }}>
              <TextField
                label='Tình trạng'
                size='small'
                variant='outlined'
                value={order.orderDetails[0].status}
                InputProps={{
                  readOnly: true
                }}
                fullWidth
              />
            </Box>
            <Box sx={{ flex: 1, paddingX: 2 }}>
              <TextField
                label='Nhân viên phụ trách'
                size='small'
                variant='outlined'
                value={order.orderDetails[0].orderHandler.name}
                InputProps={{
                  readOnly: true
                }}
                fullWidth
              />
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
                  sx={{
                    '.MuiAutocomplete-inputRoot': {
                      opacity: 1,
                      pointerEvents: 'none'
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
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
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
                      pointerEvents: 'none'
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
        </Card>
        <Card sx={{ padding: 3, marginY: 2 }}>
          <Typography variant='h6' sx={{ marginBottom: 3 }}>
            Khách hàng: {order.orderDetails[0].customer.name}
          </Typography>
          <Typography variant='body1' sx={{ marginBottom: 1 }}>
            Email: {order.orderDetails[0].customer.email}
          </Typography>
          <Typography variant='body1' sx={{ marginBottom: 1 }}>
            Hạng: {order.orderDetails[0].customer.rankingName || 'Chưa có'}
          </Typography>
        </Card>
        <Card sx={{ padding: 3, marginY: 2 }}>
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
        </Card>
      </Box>
    </Modal>
  )
}

export default ViewOrderModal
