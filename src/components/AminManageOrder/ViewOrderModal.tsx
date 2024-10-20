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

  const total = order.orderDetails.reduce((acc, detail) => {
    return (
      acc +
      (detail.roomPrice * order.orderDetails.length +
        detail.amenities.reduce((acc, amenity) => acc + amenity.price * amenity.quantity, 0)) *
        (1 - (order.orderDetails[0].servicePackage?.discountPercentage ?? 0) / 100)
    )
  }, 0)

  const mergeAmenities = (amenities: { name: string; price: number; quantity: number }[]) => {
    return amenities.reduce(
      (acc, amenity) => {
        const existing = acc.find((item) => item.name === amenity.name)
        if (existing) {
          existing.quantity += amenity.quantity
        } else {
          acc.push({ ...amenity })
        }
        return acc
      },
      [] as { name: string; price: number; quantity: number }[]
    )
  }

  const groupedOrderDetails = order.orderDetails.reduce(
    (acc, detail) => {
      const { roomName, amenities } = detail

      if (!acc[roomName]) {
        acc[roomName] = []
      }

      acc[roomName] = acc[roomName].concat(amenities)
      return acc
    },
    {} as Record<string, { name: string; price: number; quantity: number }[]>
  )

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
                fullWidth
              />
            </Box>
            <Box sx={{ flex: 1, paddingX: 2 }}>
              <TextField
                label='Nhân viên phụ trách'
                size='small'
                variant='outlined'
                value={order.orderDetails[0]?.orderHandler?.name || 'N/A'}
                InputProps={{
                  readOnly: true
                }}
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
                  sx={{
                    '.MuiAutocomplete-inputRoot': {
                      opacity: 1,
                      pointerEvents: 'none',
                      minHeight: '52px'
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
                      label='Khung giờ'
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
                onChange={() => {}}
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
              <TextField
                label='Gói dịch vụ'
                size='small'
                variant='outlined'
                value={order.orderDetails[0].servicePackage?.name}
                InputProps={{
                  readOnly: true
                }}
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
                fullWidth
              />
            </Box>
          </Box>
        </Card>
        <Card sx={{ padding: 3, marginY: 2 }}>
          <Typography variant='h6' sx={{ marginBottom: 3 }}>
            Khách hàng: {order.orderDetails[0]?.customer?.name}
          </Typography>
          <Typography variant='body1' sx={{ marginBottom: 1 }}>
            Email: {order.orderDetails[0]?.customer?.email}
          </Typography>
          <Typography variant='body1' sx={{ marginBottom: 1 }}>
            Hạng: {order.orderDetails[0]?.customer?.rankingName || 'Chưa có'}
          </Typography>
        </Card>
        <Card sx={{ padding: 3, marginY: 2 }}>
          <Typography variant='h6' sx={{ marginBottom: 3 }}>
            Chi tiết đơn hàng
          </Typography>
          {Object.entries(groupedOrderDetails).map(([roomName, amenities], index) => {
            const mergedAmenities = mergeAmenities(amenities)

            return (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', marginBottom: 1 }}>
                  <Typography variant='body1'>Phòng:</Typography>
                  <Typography variant='body1' sx={{ fontWeight: '500' }}>
                    {roomName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body1' sx={{ marginBottom: 1 }}>
                    Dịch vụ:
                  </Typography>
                  {mergedAmenities.length == 0 && (
                    <Typography variant='body2' sx={{ marginLeft: '30px' }}>
                      Không có dịch vụ
                    </Typography>
                  )}
                  {mergedAmenities.map((amenity, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        marginLeft: '30px',
                        justifyContent: 'space-between',
                        width: '150px',
                        alignItems: 'center'
                      }}
                    >
                      <Typography variant='body2' sx={{ marginBottom: '5px' }}>
                        • {amenity.name}
                      </Typography>
                      <Typography variant='body2'>x {amenity.quantity}</Typography>
                    </Box>
                  ))}
                </Box>
                {index !== Object.entries(groupedOrderDetails).length - 1 && <Divider sx={{ marginY: 2 }} />}
              </Box>
            )
          })}
          <Divider sx={{ marginY: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant='h6' sx={{ fontWeight: '500' }}>
              Tổng tiền: {total.toLocaleString()} VNĐ
            </Typography>
          </Box>
        </Card>
      </Box>
    </Modal>
  )
}

export default ViewOrderModal
