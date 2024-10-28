import { Box, Divider, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Account } from '~/apis/orderApi'
import { useSearchAccounts } from '~/queries/useOrder'
import { BookingInfo, RoomContextType } from '~/contexts/BookingContext'

interface CustomerOrderCardProps {
  customer: Account | null
  setCustomer: React.Dispatch<React.SetStateAction<Account | null>>
  bookingData: BookingInfo
}

const CustomerOrderCard = ({ customer, setCustomer, bookingData }: CustomerOrderCardProps) => {
  const [searchCustomer, setSearchCustomer] = useState<string>('')
  const [listCustomer, setListCustomer] = useState<Account[]>([])
  const [showCustomerList, setShowCustomerList] = useState(false)

  const { data: searchCustomerData } = useSearchAccounts(searchCustomer)
  const theme = useTheme()

  useEffect(() => {
    setListCustomer(searchCustomer.trim() ? searchCustomerData || [] : [])
  }, [searchCustomer, searchCustomerData])

  return (
    <Box>
      <Box sx={{ padding: 3, bgcolor: 'white', borderRadius: '5px' }}>
        <Box sx={{ position: 'relative', marginBottom: '20px' }}>
          <TextField
            variant='outlined'
            label='Tìm kiếm khách hàng'
            value={showCustomerList ? searchCustomer : customer?.name || searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
            onFocus={() => setShowCustomerList(true)}
            fullWidth
          />
          {showCustomerList && (
            <Box
              sx={{
                width: '100%',
                position: 'absolute',
                zIndex: 5,
                maxHeight: '150px',
                top: '52px',
                overflowY: 'scroll',
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)'
              }}
            >
              {listCustomer.map((a, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    setSearchCustomer(a.name || '')
                    setCustomer(a)
                    setShowCustomerList(false)
                  }}
                  sx={{ '&:hover': { backgroundColor: theme.palette.grey[200] }, cursor: 'pointer' }}
                >
                  <Typography variant='body1' sx={{ paddingX: 2, paddingY: 2 }}>
                    {a.name}
                  </Typography>
                  {index !== listCustomer.length - 1 && <Divider sx={{ width: '100%' }} />}
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Box>
          <Typography variant='h6' sx={{ marginBottom: 1 }}>
            Khách hàng:
            <span style={{ color: customer ? 'inherit' : 'red', fontWeight: customer ? 'normal' : 'bold' }}>
              {customer?.name || 'Chưa chọn'}
            </span>
          </Typography>
          <Typography variant='body1' sx={{ marginBottom: 1 }}>
            Email: {customer?.email || 'Chưa có'}
          </Typography>
          <Typography variant='body1' sx={{ marginBottom: 1 }}>
            Hạng: {customer?.rankingName || 'Chưa có'}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          padding: 3,
          bgcolor: 'white',
          borderRadius: '5px',
          flexGrow: 1
        }}
      >
        <Typography variant='h6' sx={{ marginBottom: 3 }}>
          Các phòng và khung giờ đã chọn
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Typography variant='body1' sx={{ marginBottom: 1 }}>
              Danh sách phòng:
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 1 }}>
              {bookingData?.selectedRooms.map((room: RoomContextType) => room.name).join(', ') || 'Chưa chọn phòng'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Typography variant='body1' sx={{ marginBottom: 1 }}>
              Ngày:
            </Typography>
            <Typography
              variant='body2'
              sx={{
                marginBottom: 1,
                fontWeight: bookingData?.date ? 'normal' : 'bold',
                color: bookingData?.date ? 'inherit' : 'red'
              }}
            >
              {bookingData?.date || 'Chưa chọn ngày'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Typography variant='body1' sx={{ marginBottom: 1 }}>
              Khung giờ:
            </Typography>
            <Typography
              variant='body2'
              sx={{
                marginBottom: 1,
                fontWeight: bookingData?.timeSlots.length > 0 ? 'normal' : 'bold',
                color: bookingData?.timeSlots.length > 0 ? 'inherit' : 'red'
              }}
            >
              {bookingData?.timeSlots.length > 0 ? bookingData?.timeSlots.join(', ') : 'Chưa chọn slot'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CustomerOrderCard
