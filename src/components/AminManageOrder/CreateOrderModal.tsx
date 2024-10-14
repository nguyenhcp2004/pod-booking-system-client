import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Button,
  FormControl,
  InputLabel,
  Modal,
  Box,
  Typography,
  useTheme,
  IconButton,
  TextField,
  Autocomplete,
  Grid,
  Divider,
  Select,
  MenuItem,
  Checkbox,
  Grid2
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import { BookingInfo, slotType } from '~/contexts/BookingContext'
import CloseIcon from '@mui/icons-material/Close'
import { Building, Room, RoomTypeFix, ServicePackage } from '~/constants/type'
import { SLOT } from '~/constants/slot'
import { Account, createOrder, useBuilding, useRoomType, useSearchAccounts, useSearchBuilding } from '~/apis/orderApi'
import Calendar from '../Calendar/Calendar'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useGetRoomsByTypeAndSlots } from '~/queries/useFilterRoom'
import { getAllServicePackage } from '~/queries/useServicePackage'
import { Amenity, BookingContext } from '~/contexts/BookingContext'
import { AmenityType } from '~/schemaValidations/amenity.schema'
import { useGetAmenities } from '~/queries/useAmenity'
import { tokens } from '~/themes/theme'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'



interface CreateOrderModalProps {
  open: boolean
  onClose: () => void
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(moment())
  const [selectedDates, setSelectedDates] = useState<Moment[]>([])
  const [selectedSlots, setSelectedSlots] = useState<slotType[]>([])
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null)

  const [building, setBuilding] = useState<Building | null>(null)
  const [searchBuilding, setSearchBuilding] = useState<string>(building?.address || '')
  const [listBuilding, setListBuilding] = useState<Building[]>([])
  const [showBuildingList, setShowBuildingList] = useState(false)

  const [roomTypeID, setRoomTypeID] = useState<number | null>(null)
  const [roomTypeList, setRoomTypeList] = useState<RoomTypeFix[]>([])
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])

  const [customer, setCustomer] = useState<Account | null>(null)
  const [searchCustomer, setSearchCustomer] = useState<string>('')
  const [listCustomer, setListCustomer] = useState<Account[]>([])
  const [showCustomerList, setShowCustomerList] = useState(false)

  const theme = useTheme()
  const { data: searchBuildingData } = useSearchBuilding(searchBuilding)
  const { data: searchCustomerData } = useSearchAccounts(searchCustomer)
  const { data: servicePackage, isSuccess } = getAllServicePackage()
  const { data: allBuilding } = useBuilding()
  const { data: roomType } = useRoomType(building?.address || '')
  const { data: amenities = [], isLoading, error } = useGetAmenities()
  const colors = tokens(theme.palette.mode)


  const bookingContext = useContext(BookingContext)
  if (!bookingContext) {
    throw new Error('BookingContext must be used within a BookingProvider')
  }
  const { bookingData, setBookingData } = bookingContext
  const [detailAmenity, setDetailAmenity] = useState<AmenityType | null>(null)
  // const [room, setRoom] = useState<Room>(roomList?roomList[0]?.name : "")
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null)

  const [errorState, setErrorState] = useState<string | null>(null)

  const [quantity, setQuantity] = useState(0)

  const filteredAmenities = selectedAmenity ? amenities.filter((item) => item.type === selectedAmenity) : amenities

  const handleIncrement = () => {
    if (!detailAmenity) {
      setErrorState('Vui lòng chọn tiện ích')
      return
    } else {
      if (detailAmenity.quantity < quantity) {
        setErrorState('Số lượng tiện ích không đủ')
        return
      }
      if (detailAmenity.type === 'Office') {
        const room1 = bookingData.selectedRooms.filter((room1) => room1.name === room)[0]
        const preAmennity = room1.amenities.filter((item) => item.name === detailAmenity.name)
        console.log(preAmennity)
        if (preAmennity.length > 0) {
          if (preAmennity[0].quantity + quantity >= 2) {
            setErrorState('Bạn chỉ được chọn tối đa 2 dịch vụ này')
            return
          }
          setErrorState(null)
          setQuantity((prevQuantity) => prevQuantity + 1)
          return
        }
        if (quantity >= 2) {
          setErrorState('Bạn chỉ được chọn tối đa 2 dịch vụ này')
          return
        }
      }
      setErrorState(null)
      setQuantity((prevQuantity) => prevQuantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      setErrorState(null)
      setQuantity((prevQuantity) => prevQuantity - 1)
    }
  }

  const handleSelectAmenity = (item: AmenityType) => {
    setErrorState(null)
    setQuantity(0)
    if (detailAmenity?.name == item.name) {
      setDetailAmenity(null)
      return
    }
    setDetailAmenity(item)
  }

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
    typeId: Number(roomTypeID),
    slots: slotsFormmated
  })

  useEffect(() => {
    roomListRefetch()
  }, [selectedSlots, selectedDate, roomListRefetch])

  useEffect(() => {
    if (searchBuilding.trim().length > 0) {
      if (searchBuildingData) {
        setListBuilding(searchBuildingData)
      }
    } else {
      if (allBuilding) setListBuilding(allBuilding)
    }
  }, [searchBuilding, searchBuildingData, allBuilding])

  useEffect(() => {
    if (searchCustomer.trim().length > 0) {
      if (searchCustomerData) {
        setListCustomer(searchCustomerData)
      }
    } else {
      setListCustomer([])
    }
  }, [searchCustomer, searchCustomerData])

  useEffect(() => {
    if (building) {
      if (roomType) {
        setRoomTypeList(roomType)
      }
    } else {
      setRoomTypeList([])
    }
  }, [roomType, building])

  const handleCreateOrder = () => {
    const bookingData: BookingInfo = {
      roomType: roomTypeList.find((roomT) => roomT.id === roomTypeID) || null,
      selectedRooms: selectedRooms.map((room) => ({
        id: room.id,
        name: room.name,
        price: room.price,
        image: room.image,
        amenities: []
      })),
      date: selectedDate ? selectedDate.format(DEFAULT_DATE_FORMAT) : null,
      timeSlots: selectedSlots,
      servicePackage: selectedPackage
    }
    createOrder(bookingData)
  }

  const handleAddAmentity = () => {
    if (!detailAmenity) return
    if (quantity === 0) {
      setErrorState('Vui lòng chọn số lượng')
      return
    }
    const newAmenity: Amenity = {
      id: detailAmenity?.id,
      name: detailAmenity?.name,
      price: detailAmenity?.price,
      quantity: quantity
    }
    setBookingData((prev) => ({
      ...prev,
      selectedRooms: prev.selectedRooms.map((room1) => {
        if (room1.name === room) {
          if (room1.amenities.find((item) => item.name === newAmenity.name)) {
            return {
              ...room1,
              amenities: room1.amenities.map((item) => {
                if (item.name === newAmenity.name) {
                  return {
                    ...item,
                    quantity: item.quantity + newAmenity.quantity
                  }
                }
                return item
              })
            }
          } else {
            return {
              ...room1,
              amenities: [...room1.amenities, newAmenity]
            }
          }
        }
        return room1
      })
    }))
    setErrorState(null)
    setQuantity(0)
    setDetailAmenity(null)
    console.log(bookingData)
  }

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
              Tạo đơn hàng
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: 3, marginY: 2, bgcolor: 'white', borderRadius: '5px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, position: 'relative', paddingRight: 2 }}>
              <TextField
                size='small'
                variant='outlined'
                label='Địa chỉ'
                value={building?.address || searchBuilding}
                onChange={(e) => setSearchBuilding(e.target.value)}
                onFocus={() => setShowBuildingList(true)}
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
              {showBuildingList && (
                <Box
                  sx={{
                    width: '95%',
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
                  {listBuilding.map((b, index) => (
                    <Box
                      key={index}
                      onClick={() => {
                        setSearchBuilding(b.address)
                        setBuilding(b)
                        setShowBuildingList(false)
                      }}
                      sx={{ '&:hover': { backgroundColor: theme.palette.grey[200] }, cursor: 'pointer' }}
                    >
                      <Typography variant='body1' sx={{ paddingX: 2, paddingY: 2 }}>
                        {b.address}
                      </Typography>
                      {index !== listBuilding.length - 1 && <Divider sx={{ width: '100%' }} />}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <Box sx={{ flex: 1, paddingX: 2 }}>
              <FormControl fullWidth>
                <InputLabel id='staff-select-label'>Room type</InputLabel>
                <Select
                  labelId='staff-select-label'
                  label='Room type'
                  value={roomTypeID}
                  onChange={(e) => setRoomTypeID(e.target.value as number)}
                  fullWidth
                  renderValue={(selected) => {
                    const selectedRoomType = roomTypeList.find((roomT) => roomT.id == selected)
                    return selectedRoomType ? selectedRoomType.name : 'Room type'
                  }}
                >
                  <MenuItem value='' disabled>
                    Chọn room type
                  </MenuItem>
                  {roomTypeList.map((roomT) => (
                    <MenuItem key={roomT.id} value={roomT.id}>
                      {roomT.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, paddingLeft: 2 }}>
              <DatePicker
                label='Ngày đặt'
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                format={DEFAULT_DATE_FORMAT}
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
                    }
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
                  options={SLOT}
                  value={selectedSlots}
                  onChange={(_, slots) => {
                    setSelectedSlots(slots as slotType[])
                  }}
                  disableCloseOnSelect
                  limitTags={1}
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
            </Box>
            <Box sx={{ flex: 1, paddingX: 2 }}>
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
            </Box>
            <Box sx={{ flex: 1, paddingLeft: 2 }}>
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
              <Box sx={{ position: 'relative' }}>
                <TextField
                  size='small'
                  variant='standard'
                  label='Tìm kiếm khách hàng'
                  value={customer?.name || searchCustomer}
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
                          setSearchCustomer(a.name ?? '')
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
              {/* <Typography variant='h6' sx={{ marginBottom: 3 }}>
                Khách hàng: {order.orderDetails[0].customer.name}
              </Typography>
              <Typography variant='body1' sx={{ marginBottom: 1 }}>
                Email: {order.orderDetails[0].customer.email}
              </Typography>
              <Typography variant='body1' sx={{ marginBottom: 1 }}>
                Hạng: {order.orderDetails[0].customer.rankingName || 'Chưa có'}
              </Typography> */}
            </Box>
            <Box sx={{ padding: 3, marginY: 2, bgcolor: 'white', borderRadius: '5px' }}>
              <Typography variant='h6' sx={{ marginBottom: 3 }}>
                Chi tiết đơn hàng
              </Typography>
              {/* {order.orderDetails.map((orderDetail, index) => (
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
              ))} */}
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item lg={6} md={6}> 
          <Box sx={{ padding: '0px 20px 20px 20px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px 20px 0px 0px', gap: '24px' }}>
                {/* <FormControl fullWidth>
                  <InputLabel id='location-label'>Chọn Phòng</InputLabel>
                  <Select
                    labelId='room-type-label'
                    value={room}
                    label='Chọn Phòng'
                    onChange={(e) => setRoom(e.target.value)}
                  >
                    {bookingData?.selectedRooms.map((room, index) => (
                      <MenuItem key={index} value={room.name}>
                        {room.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <FormControl fullWidth>
                  <InputLabel id='amenities-label'>Chọn loại tiện ích</InputLabel>
                  <Select
                    labelId='amenities-label'
                    value={selectedAmenity || ''}
                    label='Chọn loại tiện ích'
                    onChange={(e) => {
                      setSelectedAmenity(e.target.value)
                    }}
                  >
                    {Array.from(new Set(amenities.map((amenity) => amenity.type))).map((uniqueType, index) => (
                      <MenuItem key={index} value={uniqueType}>
                        {uniqueType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ padding: '49px 0px 29px 0px' }}>
                <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '16px' }}>
                  Danh sách tiện ích
                </Typography>
                <Grid container spacing={4} sx={{ padding: '10px 0' }}>
                  {filteredAmenities.map((item, index) => (
                    <Grid   lg={4} md={6} xs={12}  key={index}>
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
                          backgroundColor: detailAmenity?.name == item.name ? colors.grey[100] : 'transparent'
                        }}
                        onClick={() => {
                          handleSelectAmenity(item)
                        }}
                      >
                        {item.name}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
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
                      <RemoveIcon sx={{ color: 'black' }} />
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
                      <AddIcon sx={{ color: 'black' }} />
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
                  onClick={() => handleAddAmentity()}
                >
                  Thêm tiện ích
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={6} md={6}></Grid>
        </Grid>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button variant='contained' onClick={handleCreateOrder}>
            Tạo đơn hàng
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default CreateOrderModal
