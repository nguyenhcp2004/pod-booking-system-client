import React, { useEffect, useMemo, useState } from 'react'
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
  Checkbox
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
                  label='Room type'
                  labelId='staff-select-label'
                  value={roomTypeID}
                  onChange={(e) => setRoomTypeID(e.target.value as number)}
                  fullWidth
                  displayEmpty
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
              <Box>
                <TextField
                  size='small'
                  variant='standard'
                  label='Tìm kiếm khách hàng'
                  value={customer?.name || searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  onFocus={() => setShowCustomerList(true)}
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
                {showCustomerList && (
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
