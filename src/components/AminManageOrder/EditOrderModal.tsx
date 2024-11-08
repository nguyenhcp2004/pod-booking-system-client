import React, { useCallback, useEffect, useState } from 'react'
import {
  FormControl,
  Modal,
  Box,
  useTheme,
  Typography,
  IconButton,
  TextField,
  Autocomplete,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Backdrop,
  CircularProgress,
  Divider,
  SelectChangeEvent
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import {
  Account,
  Order,
  OrderDetail,
  OrderStatus,
  orderStatus,
  OrderUpdateStaffRequest,
  updateOrderApi
} from '~/apis/orderApi'
import { useRoomSameType, useUpdateStaff } from '~/queries/useOrder'
import { slotType } from '~/contexts/BookingContext'
import CloseIcon from '@mui/icons-material/Close'
import Calendar from '../Calendar/Calendar'
import { Room } from '~/constants/type'
import { toast } from 'react-toastify'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { mapOrderToRow } from '~/utils/order'
import { GridValidRowModel } from '@mui/x-data-grid'

interface EditOrderModalProps {
  open: boolean
  onClose: () => void
  order: Order | null
  staffList: Account[]
  refetch: () => void
  setRows: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ open, onClose, order, staffList, refetch, setRows }) => {
  const theme = useTheme()
  const date = moment(order?.orderDetails[0].startTime)
  const [selectedDate, setSelectedDate] = useState<Moment>(moment(date))
  const [selectedDates, setSelectedDates] = useState<Moment[]>([])
  const [selectedSlots, setSelectedSlots] = useState<slotType[]>([])
  const [listRoom, setListRoom] = useState<Room[]>([])
  const [updateOrder, setUpdateOrder] = useState<Order | null>(order)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const [updateStaffList, setUpdateStaffList] = useState<OrderUpdateStaffRequest[]>([])
  const [allStatus, setAllStatus] = useState<OrderStatus | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>('all')

  const { mutate: updateStaff } = useUpdateStaff()
  const { data: allRoom } = useRoomSameType(order?.orderDetails[0].roomId?.toString() || '0')
  useEffect(() => {
    setListRoom(allRoom || [])
  }, [allRoom])

  useEffect(() => {
    if (order) {
      setUpdateOrder(order)
    }
  }, [order, open])

  const genderRoomList = useCallback(() => {
    order?.orderDetails.map((od) => {
      const temp: Room = {
        id: od.roomId,
        name: od.roomName,
        description: '',
        image: '',
        status: '',
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString(),
        roomType: null
      }
      setSelectedRooms((prev) => [...prev, temp])
    })
  }, [order])

  const genderDateList = useCallback(() => {
    const dateList: Moment[] = []
    order?.orderDetails.forEach((od) => {
      if (od.status == 'Rejected' || od.status == 'Pending') {
        dateList.push(moment(od.startTime))
      }
    })
    setSelectedDates(dateList)
  }, [selectedDate, order])

  const resertCalendar = () => {
    genderRoomList()
    genderDateList()
  }

  useEffect(() => {
    genderRoomList()
  }, [order, open, genderRoomList])

  useEffect(() => {
    genderDateList()
  }, [selectedDate, order, open, genderDateList])

  useEffect(() => {
    if (order) {
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
  }, [order, selectedDate])

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value)
  }

  const filteredOrderDetails = updateOrder?.orderDetails.filter(
    (od) => selectedStatus === 'all' || od.status === selectedStatus
  )

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

  const getUniqueStartTimes = (order: Order) => {
    const uniqueStartTimes = new Set(order?.orderDetails.map((od) => moment(od.startTime).format('DD-MM-YYYY')))
    return Array.from(uniqueStartTimes).sort((a, b) => moment(a, 'DD-MM-YYYY').diff(moment(b, 'DD-MM-YYYY')))
  }

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

  const handleStaffChange = (newStaffId: string, orderDetail: OrderDetail) => {
    const selectedStaff = staffList.find((staff) => staff.id === newStaffId)
    if (!selectedStaff) {
      toast.error('Nhân viên không tồn tại')
      return
    }
    setUpdateOrder((prev) => {
      if (!prev) return prev
      const updatedOrderDetails = prev.orderDetails.map((item) =>
        item.id === orderDetail.id
          ? { ...item, orderHandler: { ...item.orderHandler, id: newStaffId, name: selectedStaff.name || '' } }
          : item
      )
      return { ...prev, orderDetails: updatedOrderDetails }
    })
    if (updateStaffList.filter((item) => item.id === orderDetail.id).length === 0) {
      if (orderDetail?.orderHandler?.id === newStaffId) return
      setUpdateStaffList((prev) => [
        ...prev,
        { id: orderDetail.id, orderHandler: { id: newStaffId, name: selectedStaff.name || '' } }
      ])
      return
    } else {
      if (orderDetail?.orderHandler?.id === newStaffId) {
        setUpdateStaffList((prev) => prev.filter((item) => item.id !== orderDetail.id))
        return
      }
      setUpdateStaffList((prev) =>
        prev.map((item) =>
          item.id === orderDetail.id
            ? { ...item, orderHandler: { id: newStaffId, name: selectedStaff.name || '' } }
            : item
        )
      )
    }
  }

  const handleStatusChange = (newStatus: OrderStatus, orderDetail: OrderDetail) => {
    setUpdateOrder((prev) => {
      if (!prev) return prev
      const updatedOrderDetails = prev.orderDetails.map((od) =>
        od.id == orderDetail.id
          ? {
              ...od,
              status: newStatus
            }
          : od
      )
      return { ...prev, orderDetails: updatedOrderDetails }
    })
  }

  const handleUpdateOrder = async () => {
    setLoading(true)
    await updateStaffList.map((item) => {
      updateStaff({ request: item })
      toast.success('Cập nhật staff thành công')
    })
    const response = await updateOrderApi(order, updateOrder, allStatus)
    if (response.code === 200) {
      toast.success('Cập nhật đơn hàng thành công')
    }
    setLoading(false)
    setRows((prevRows) => {
      console.log(prevRows)
      const updatedRows = prevRows.map((row) => (row.id === order.id && updateOrder ? mapOrderToRow(updateOrder) : row))
      return updatedRows
    })
    onClose()
    refetch()
  }

  const handleRoomChange = (room: Room, orderDetail: OrderDetail) => {
    setSelectedRooms([room])
    setSelectedDates([moment(orderDetail.startTime)])
    setUpdateOrder((prev) => {
      if (!prev) return prev
      const updatedOrderDetails = prev.orderDetails.map((od) =>
        od.id === orderDetail.id
          ? { ...od, roomId: room.id, roomName: room.name, roomPrice: order.orderDetails[0].roomPrice }
          : od
      )
      return { ...prev, orderDetails: updatedOrderDetails }
    })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '80vw',
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
            <Box sx={{ flex: 4 }}>
              <Typography variant='h6' sx={{ marginBottom: 2 }}>
                Khách hàng: {order.orderDetails[0]?.customer?.name || 'N/A'}
              </Typography>
              <Typography variant='body1' sx={{ marginBottom: 1 }}>
                Email: {order.orderDetails[0]?.customer?.email || 'N/A'}
              </Typography>
              <Typography variant='body1' sx={{ marginBottom: 1 }}>
                Hạng: {order.orderDetails[0]?.customer?.rankingName || 'Chưa có'}
              </Typography>
            </Box>
            <Box sx={{ flex: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
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
                        },
                        paddingRight: 2
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
                <Box sx={{ flex: 1, paddingRIght: 2 }}>
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
                <Box sx={{ flex: 1, paddingLeft: 2 }}>
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
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <Box sx={{ flex: 1 }}>
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
                <Box sx={{ flex: 1, paddingLeft: 2 }}>
                  <FormControl fullWidth size='small'>
                    <Autocomplete
                      value={allStatus || ''}
                      onChange={(_, status) => setAllStatus(status as OrderStatus)}
                      options={orderStatus}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField {...params} label='Cập nhật trạng thái tất cả' size='small' />
                      )}
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
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Grid container sx={{ width: '100%' }}>
          <Grid item lg={5} md={5} xs={12} sx={{ paddingRight: '12px', marginTop: '10px' }}>
            <Box sx={{ bgcolor: 'white', padding: 2, borderRadius: '5px' }}>
              <Box display='flex' sx={{ width: '100%' }} justifyContent='space-between'>
                <Typography variant='h6' sx={{ marginBottom: 2, color: theme.palette.primary.main }}>
                  Các lịch cần xử lý
                </Typography>
                <Button variant='text' onClick={() => resertCalendar()}>
                  <RestartAltIcon />
                </Button>
              </Box>
              <Calendar rooms={selectedRooms} selected={selectedDates} slots={selectedSlots} />
            </Box>
          </Grid>
          <Grid item lg={7} md={7} xs={12} sx={{ paddingLeft: '12px', marginTop: '10px' }}>
            <Box
              sx={{
                padding: 3,
                bgcolor: 'white',
                borderRadius: '5px',
                maxHeight: '540px',
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
                }
              }}
            >
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                sx={{ marginRight: 3, marginBottom: 2 }}
              >
                <Typography variant='h6' sx={{ color: theme.palette.primary.main }}>
                  Chi tiết đơn hàng
                </Typography>
                <Box sx={{ width: '200px' }}>
                  <FormControl fullWidth size='small' sx={{ minWidth: 220 }}>
                    <InputLabel id='order-status-label'>Trạng thái đơn hàng</InputLabel>
                    <Select
                      labelId='order-status-label'
                      value={selectedStatus ?? 'all'}
                      onChange={handleStatusFilterChange}
                      label='Trạng thái đơn hàng'
                    >
                      <MenuItem value='all'>All</MenuItem>
                      {Object.values(OrderStatus).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {filteredOrderDetails &&
                getUniqueStartTimes({ ...order, orderDetails: filteredOrderDetails }).map((uniqueDate, index) => (
                  <Box key={uniqueDate} sx={{ marginBottom: 4 }}>
                    <Typography variant='subtitle2' sx={{ marginBottom: 3 }}>
                      Ngày: {moment(uniqueDate, 'DD-MM-YYYY').format('DD/MM/YYYY')}
                    </Typography>

                    {filteredOrderDetails
                      .filter((item) => moment(item.startTime).format('DD-MM-YYYY') === uniqueDate)
                      .map((item, index) => {
                        const mergedAmenities = mergeAmenities(item.amenities)
                        return (
                          <Box key={index} sx={{ marginBottom: 2 }}>
                            <Box display='flex' justifyContent='space-between'>
                              <Box flex='1'>
                                <FormControl fullWidth>
                                  <InputLabel id={`room-select-label-${item.id}`}>Phòng</InputLabel>
                                  <Select
                                    labelId={`room-select-label-${item.id}`}
                                    label='Phòng'
                                    value={item.roomId || ''}
                                    renderValue={(selected) => {
                                      const room = listRoom.find((r) => r.id === selected)
                                      return room ? room.name : 'Chọn phòng'
                                    }}
                                    onChange={(e) =>
                                      handleRoomChange(listRoom.find((room) => room.id === e.target.value)!, item)
                                    }
                                    sx={{ width: '100%' }}
                                  >
                                    {listRoom.map((room) => (
                                      <MenuItem key={room.id} value={room.id}>
                                        {room.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Box>
                              <Box flex='1' sx={{ marginX: '10px' }}>
                                <FormControl fullWidth>
                                  <InputLabel id='staff-select-label'>Nhân viên phụ trách</InputLabel>
                                  <Select
                                    labelId='staff-select-label'
                                    label='Nhân viên phụ trách'
                                    value={item?.orderHandler?.id || ''}
                                    onChange={(e) => handleStaffChange(e.target.value, item)}
                                    renderValue={(value) => {
                                      const selectedStaff = staffList.find((staff) => staff.id === value)
                                      return selectedStaff ? selectedStaff.name : ''
                                    }}
                                    sx={{ color: 'black' }}
                                  >
                                    <MenuItem value='' disabled>
                                      Chọn nhân viên
                                    </MenuItem>
                                    {staffList &&
                                      staffList
                                        .filter((staff) => staff.buildingNumber === order.orderDetails[0].buildingId)
                                        .map((staff) => (
                                          <MenuItem key={staff.id} value={staff.id}>
                                            {staff.name}
                                          </MenuItem>
                                        ))}
                                  </Select>
                                </FormControl>
                              </Box>
                              <Box flex='1'>
                                <FormControl fullWidth size='small'>
                                  <Autocomplete
                                    value={item.status || ''}
                                    onChange={(_, status) => handleStatusChange(status as OrderStatus, item)}
                                    options={orderStatus}
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) => <TextField {...params} label='Trạng thái' size='small' />}
                                    sx={{ '.MuiAutocomplete-inputRoot': { height: '52px' } }}
                                  />
                                </FormControl>
                              </Box>
                            </Box>
                            <Box sx={{ marginTop: '10px' }}>
                              {mergedAmenities.length === 0 && (
                                <Typography variant='body2' sx={{ fontStyle: 'italic', color: 'lightgray' }}>
                                  Không có dịch vụ
                                </Typography>
                              )}
                              {mergedAmenities.length > 0 && (
                                <Typography variant='body1' sx={{ marginBottom: 1 }}>
                                  Dịch vụ:
                                </Typography>
                              )}
                              {mergedAmenities.map((amenity, idx) => (
                                <Box key={idx}>
                                  <Box
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
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )
                      })}
                    {index !== getUniqueStartTimes({ ...order, orderDetails: filteredOrderDetails }).length - 1 && (
                      <Divider />
                    )}
                  </Box>
                ))}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: 2 }}>
          <Button variant='outlined' onClick={() => onClose()}>
            Thoát
          </Button>
          <Button variant='contained' onClick={handleUpdateOrder}>
            Cập nhật đơn hàng
          </Button>
        </Box>
        <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>
    </Modal>
  )
}

export default EditOrderModal
