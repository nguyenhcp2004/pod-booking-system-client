import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useGetAmenities, useGetAmenitiesByType } from '~/queries/useAmenity'
import { tokens } from '~/themes/theme'
import Grid from '@mui/material/Grid2'
import { AmenityType } from '~/schemaValidations/amenity.schema'

import { Add, Remove } from '@mui/icons-material'
import { useSearchAccounts } from '~/queries/useOrder'
import { Account } from '~/apis/orderApi'
import { useGetBookedRoomsByAccountId } from '~/queries/useRoom'
import { BookedRoomSchemaType } from '~/schemaValidations/room.schema'
import { formatStartEndTime } from '~/utils/utils'
import { useBookingAmenityContext } from '~/contexts/BookingAmenityContext'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactionInfo } from '~/apis/paymentApi'
import { useCreateOrderDetailAmenityMutation } from '~/queries/useOrderDetailAmenity'

const AddAmenity = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const { selectedAmenities, bookedRoom, setBookedRoom, addAmenity } = useBookingAmenityContext()

  const [errorState, setErrorState] = useState<string | null>(null)
  const [selectedAmenityType, setSelectedAmenityType] = useState<string>('')
  const [quantity, setQuantity] = useState(0)
  const [detailAmenity, setDetailAmenity] = useState<AmenityType | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState<boolean | null>(null)
  const [orderCreated, setOrderCreated] = useState(0)
  const { data: responseAmenityByType, refetch: amenitiesRefetch } = useGetAmenitiesByType(selectedAmenityType)
  const { data: responseAllAmenities = [] } = useGetAmenities()
  const [searchCustomer, setSearchCustomer] = useState('')
  const [listCustomer, setListCustomer] = useState<Account[]>([])
  const [showCustomerList, setShowCustomerList] = useState(false)
  const [customer, setCustomer] = useState<Account | null>(null)
  const { data: searchCustomerData } = useSearchAccounts(searchCustomer)
  const { data: responese, refetch } = useGetBookedRoomsByAccountId({ accountId: customer?.id ?? '' })
  const createOrderDetailAmenityMutation = useCreateOrderDetailAmenityMutation()
  const amenities: AmenityType[] = responseAmenityByType?.data.data ?? []
  const allAmenities: AmenityType[] = responseAllAmenities ?? []
  const bookedRooms = useMemo(() => {
    return responese?.data.data || []
  }, [responese])
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const vnp_Amount = queryParams.get('vnp_Amount')
  const vnp_BankCode = queryParams.get('vnp_BankCode')
  const vnp_OrderInfo = queryParams.get('vnp_OrderInfo')
  const vnp_ResponseCode = queryParams.get('vnp_ResponseCode')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isLoading } = useQuery({
    queryKey: ['transactionInfo', vnp_Amount, vnp_BankCode, vnp_OrderInfo, vnp_ResponseCode],
    queryFn: async () => {
      const transactionResponse = await fetchTransactionInfo(
        vnp_Amount ?? '',
        vnp_BankCode ?? '',
        vnp_OrderInfo ?? '',
        vnp_ResponseCode ?? ''
      )
      if (!transactionResponse) {
        throw new Error('No response from API')
      }

      if (transactionResponse.status === 'OK' && orderCreated === 0) {
        setOrderCreated(orderCreated + 1)
        setStatus(true)
        // Create order detail amenities
        for (const amenity of selectedAmenities) {
          await createOrderDetailAmenityMutation.mutateAsync({
            orderDetailId: bookedRoom?.orderDetailId as string,
            amenityId: amenity.id,
            quantity: amenity.quantity,
            price: amenity.price
          })
        }

        return transactionResponse
      } else {
        if (orderCreated === 1) {
          setStatus(false)
        }
        throw new Error(transactionResponse.message || 'Transaction not successful')
      }
    },
    enabled: !!vnp_Amount && !!vnp_BankCode && !!vnp_OrderInfo && !!vnp_ResponseCode
  })
  useEffect(() => {
    if (selectedAmenityType) {
      amenitiesRefetch()
    }
    setDetailAmenity(null)
    setQuantity(0)
  }, [selectedAmenityType, refetch])

  useEffect(() => {
    refetch()
  }, [customer])
  useEffect(() => {
    setListCustomer(searchCustomer.trim() ? searchCustomerData || [] : [])
  }, [searchCustomer, searchCustomerData])

  const handleAddAmentity = () => {
    if (!detailAmenity) {
      setErrorState('Vui lòng chọn dịch vụ')
      return
    }
    if (quantity === 0) {
      setErrorState('Vui lòng chọn số lượng')
      return
    }
    if (!bookedRoom) {
      setErrorState('Vui lòng chọn phòng đã đặt')
      return
    }

    const newAmenity = {
      ...detailAmenity,
      quantity: quantity
    }

    addAmenity(newAmenity)
    setQuantity(0)
    setDetailAmenity(null)
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      // setErrorState(null)
      setQuantity((prevQuantity) => prevQuantity - 1)
    }
  }
  const handleIncrement = () => {
    if (!detailAmenity) {
      setErrorState('Vui lòng chọn dịch vụ')
      return
    } else {
      if (detailAmenity.quantity < quantity + 1) {
        setErrorState('Số lượng dịch vụ không đủ')
        return
      }
      if (detailAmenity.type === 'Office') {
        if (quantity + 1 >= 3) {
          setErrorState('Chỉ được đặt tối đa 2 dịch vụ thiết bị')
          return
        }
      }
      setErrorState(null)
      setQuantity((prevQuantity) => prevQuantity + 1)
    }
  }

  const handleSelectAmenity = (item: AmenityType) => {
    setQuantity(0)
    if (detailAmenity?.name === item.name) {
      setDetailAmenity(null)
      return
    }
    setDetailAmenity(item)
  }

  const handleAmenityTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedAmenityType(event.target.value)
  }

  const handleSelectBookedRoom = (event: SelectChangeEvent<string>) => {
    const selectedRoom = bookedRooms.find((room) => room.startTime === event.target.value)
    setBookedRoom(selectedRoom || null)
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: 3,
        borderRadius: 2,
        width: '100%'
      }}
    >
      <Box>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                size='small'
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
                    paddingRight: 4,
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
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel size='small'>Chọn Phòng</InputLabel>
              <Select
                size='small'
                label='Chọn Phòng'
                value={bookedRoom?.startTime || ''}
                onChange={handleSelectBookedRoom}
              >
                {bookedRooms.map((room: BookedRoomSchemaType) => (
                  <MenuItem key={room.id} value={room.startTime}>
                    {room.name} - {formatStartEndTime(room.startTime, room.endTime)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel size='small'>Chọn loại dịch vụ</InputLabel>
              <Select
                size='small'
                value={selectedAmenityType}
                label='Chọn loại dịch vụ'
                onChange={handleAmenityTypeChange}
              >
                <MenuItem value='Food'>Đồ ăn</MenuItem>
                <MenuItem value='Office'>Văn phòng phẩm</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ paddingY: '20px' }}>
          <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '16px' }}>
            Danh sách dịch vụ
          </Typography>
          <Box
            sx={{
              height: '300px',
              overflowY: 'scroll',
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#a9a9b1',
                borderRadius: '4px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent'
              },
              paddingRight: '10px'
            }}
          >
            <Grid container spacing={4} sx={{ padding: '10px 0' }}>
              {selectedAmenityType !== ''
                ? amenities.map((item) => (
                    <Grid size={{ lg: 4, md: 6, xs: 12 }} key={item.id}>
                      <Button
                        variant='outlined'
                        fullWidth
                        sx={{
                          padding: '10px 0px',
                          minHeight: '50px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          color: 'black',
                          borderColor: 'black',
                          fontSize: '14px',
                          backgroundColor: detailAmenity?.id === item.id ? colors.grey[100] : 'transparent'
                        }}
                        onClick={() => handleSelectAmenity(item)}
                      >
                        {item.name}
                      </Button>
                    </Grid>
                  ))
                : allAmenities.map((item) => (
                    <Grid size={{ lg: 4, md: 6, xs: 12 }} key={item.id}>
                      <Button
                        variant='outlined'
                        fullWidth
                        sx={{
                          padding: '10px 0px',
                          minHeight: '50px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          color: 'black',
                          borderColor: 'black',
                          fontSize: '14px',
                          backgroundColor: detailAmenity?.id === item.id ? colors.grey[100] : 'transparent'
                        }}
                        onClick={() => handleSelectAmenity(item)}
                      >
                        {item.name}
                      </Button>
                    </Grid>
                  ))}
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
            paddingBottom: '20px',
            paddingTop: '20px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {errorState && (
              <Typography
                variant='subtitle2'
                sx={{ color: 'red', paddingBottom: '10px', position: 'absolute', bottom: '40px' }}
              >
                {errorState}
              </Typography>
            )}
            <Typography
              variant='subtitle2'
              sx={{ fontWeight: 700, fontSize: '16px', padding: '0px 20px 0px 0px', color: colors.grey[200] }}
            >
              Số lượng
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant='outlined'
                onClick={handleDecrement}
                disabled={quantity === 0}
                sx={{
                  minWidth: '35px',
                  height: '40px',
                  borderRadius: '8px 0px 0px 8px',
                  '&:last-of-type': { borderTopRightRadius: '4px', borderBottomRightRadius: '4px' },
                  borderColor: colors.grey[200]
                }}
              >
                <Remove sx={{ color: 'black' }} />
              </Button>
              <Typography
                variant='body1'
                aria-readonly='true'
                sx={{
                  width: '80px',
                  textAlign: 'center',
                  height: '40px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: colors.grey[200],
                  padding: '9.2px 8px 8px 8px',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'default'
                }}
              >
                {quantity}
              </Typography>
              <Button
                variant='outlined'
                onClick={handleIncrement}
                sx={{
                  minWidth: '35px',
                  height: '40px',
                  borderRadius: '0px 8px 8px 0px',
                  '&:first-of-type': { borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' },
                  borderColor: colors.grey[200]
                }}
              >
                <Add sx={{ color: 'black' }} />
              </Button>
            </Box>
          </Box>
          <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '20px', textAlign: 'center' }}>
            {detailAmenity?.price ? detailAmenity.price * quantity : 0} VND
          </Typography>
        </Box>
        <Box sx={{ padding: '20px 0px 10px 0px' }}>
          <Button
            variant='outlined'
            fullWidth
            sx={{
              minHeight: '40px',
              borderRadius: '96px',
              border: '1px solid #A9A9B1',
              boxShadow:
                '0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.20)',
              color: colors.grey[500],
              fontSize: '15px',
              fontWeight: '500px',
              textTransform: 'uppercase'
            }}
            onClick={() => {
              handleAddAmentity()
            }}
          >
            Thêm dịch vụ
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AddAmenity
