import {
  Autocomplete,
  Box,
  Checkbox,
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
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import React, { useEffect, useMemo, useState, SetStateAction, Dispatch } from 'react'
import { useBuilding, useRoomType, useSearchBuilding } from '~/queries/useOrder'
import { SLOT } from '~/constants/slot'
import { Building, Room, RoomTypeFix, ServicePackage } from '~/constants/type'
import { BookingInfo, RoomContextType, slotType } from '~/contexts/BookingContext'
import { useGetRoomsByTypeAndSlots } from '~/queries/useFilterRoom'
import { getAllServicePackage } from '~/queries/useServicePackage'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

interface HeaderOrderComponentProps {
  bookingData: BookingInfo
  setBookingData: Dispatch<SetStateAction<BookingInfo>>
  setSelectedDates(date: Moment[]): void
  selectedSlots: slotType[]
  setSelectedSlots(slots: slotType[]): void
}

const HeaderOrderComponent: React.FC<HeaderOrderComponentProps> = ({
  bookingData,
  setBookingData,
  setSelectedDates,
  selectedSlots,
  setSelectedSlots
}) => {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(moment())

  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null)

  const [building, setBuilding] = useState<Building | null>(null)
  const [searchBuilding, setSearchBuilding] = useState<string>(building?.address || '')
  const [listBuilding, setListBuilding] = useState<Building[]>([])
  const [showBuildingList, setShowBuildingList] = useState(false)

  const [roomTypeID, setRoomTypeID] = useState<number | null>(null)
  const [roomTypeList, setRoomTypeList] = useState<RoomTypeFix[]>([])

  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])

  const theme = useTheme()
  const { data: servicePackage, isSuccess } = getAllServicePackage()
  const { data: searchBuildingData } = useSearchBuilding(searchBuilding)
  const { data: allBuilding } = useBuilding()
  const { data: roomType } = useRoomType(building?.address || '')

  const now = new Date()
  const currentHour = now.getHours()

  const availableSlots = useMemo(() => {
    if (selectedDate && selectedDate.isAfter(moment(), 'day')) {
      return SLOT
    } else {
      return SLOT.filter((slot) => {
        const startHour = parseInt(slot.split(':')[0], 10)
        return startHour > currentHour
      })
    }
  }, [selectedDate, currentHour])

  useEffect(() => {
    if (searchBuilding.trim()) {
      setListBuilding(searchBuildingData || [])
    } else {
      setListBuilding(allBuilding || [])
    }
  }, [searchBuilding, searchBuildingData, allBuilding])

  useEffect(() => {
    setRoomTypeList(building ? roomType || [] : [])
  }, [roomType, building])

  useEffect(() => {
    const dateList = []
    if (selectedDate) {
      dateList.push(selectedDate)
      if (selectedPackage) {
        if (selectedPackage.id == '2') {
          for (let i = 0; i < 7; i++) {
            dateList.push(moment(selectedDate).add(i, 'days'))
          }
        } else if (selectedPackage.id == '3') {
          dateList.push(moment(selectedDate).add(1, 'week'))
          dateList.push(moment(selectedDate).add(2, 'week'))
          dateList.push(moment(selectedDate).add(3, 'week'))
        } else if (selectedPackage.id == '4') {
          for (let i = 1; i < 30; i++) {
            dateList.push(moment(selectedDate).add(i, 'days'))
          }
        }
      }
    }
    setSelectedDates(dateList)
  }, [selectedDate, selectedPackage, setSelectedDates])

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

  const handleBuildingSearch = (query: string) => {
    setSearchBuilding(query)
    const buildings = query.trim() ? searchBuildingData || [] : allBuilding || []
    setListBuilding(buildings)
  }

  const handleSelectBuilding = (b: Building) => {
    setBuilding(b)
    setSearchBuilding(b.address)
    setRoomTypeList(roomType || [])
    setShowBuildingList(false)
  }

  const handleSelectRoomType = (e: SelectChangeEvent<number | null>) => {
    const value = Number(e.target.value) || null
    setRoomTypeID(value)
    const selectedRoomType = roomTypeList.find((room) => room.id === value) || null
    setBookingData((prev) => ({ ...prev, roomType: selectedRoomType }))
  }

  const handleSelectDate = (date: Moment | null) => {
    setSelectedDate(date)
    updateBookingData({ date: date ? date.format('YYYY-MM-DD') : null })
    updateSelectedDates(date, selectedPackage)
  }

  const updateBookingData = (updates: Partial<BookingInfo>) => {
    setBookingData((prev) => ({ ...prev, ...updates }))
  }

  const handleSelectPackage = (pkg: ServicePackage | null) => {
    setSelectedPackage(pkg)
    setBookingData((prev) => ({ ...prev, servicePackage: pkg }))
    updateSelectedDates(selectedDate, pkg)
  }

  const handleSelectSlots = (slots: slotType[]) => {
    setSelectedSlots(slots as slotType[])
    setBookingData((prev) => ({ ...prev, timeSlots: slots }))
  }

  const handleSelectRooms = (rooms: Room[]) => {
    setSelectedRooms(rooms)
    const listRoom: RoomContextType[] = rooms.map((room) => ({
      id: room.id,
      name: room.name,
      price: bookingData.roomType?.price,
      image: room.image,
      amenities: []
    }))
    setBookingData((prev) => ({ ...prev, selectedRooms: listRoom }))
  }

  const updateSelectedDates = (date: Moment | null, pkg: ServicePackage | null) => {
    const dateList: Moment[] = date ? [date] : []

    if (pkg?.id === '1') {
      for (let i = 1; i <= 3; i++) {
        dateList.push(moment(date).add(i, 'week'))
      }
    } else if (pkg?.id === '2') {
      for (let i = 0; i < 30; i++) {
        dateList.push(moment(date).add(i, 'days'))
      }
    }
    setSelectedDates(dateList)
  }

  return (
    <Box sx={{ padding: 3, marginY: 2, bgcolor: 'white', borderRadius: '5px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1, position: 'relative', paddingRight: 2 }}>
          <TextField
            size='small'
            variant='outlined'
            label='Địa chỉ'
            required
            value={showBuildingList ? searchBuilding : building?.address || searchBuilding}
            onChange={(e) => handleBuildingSearch(e.target.value)}
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
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)'
              }}
            >
              {listBuilding.map((b, index) => (
                <Box
                  key={index}
                  onClick={() => handleSelectBuilding(b)}
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
            <InputLabel id='staff-select-label'>Loại phòng</InputLabel>
            <Select
              labelId='staff-select-label'
              label='Loại phòng'
              value={roomTypeID || ''}
              required
              onChange={(e) => handleSelectRoomType(e)}
              fullWidth
              renderValue={(selected) => {
                const selectedRoomType = roomTypeList.find((roomT) => roomT.id == selected)
                return selectedRoomType ? selectedRoomType.name : 'Chọn loại phòng'
              }}
            >
              <MenuItem value='' disabled>
                Chọn loại phòng
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
            value={selectedDate || moment()}
            onChange={(date) => {
              handleSelectDate(date)
            }}
            format={DEFAULT_DATE_FORMAT}
            disablePast
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
              options={availableSlots}
              value={selectedSlots}
              onChange={(_, slots) => {
                handleSelectSlots(slots as slotType[])
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  minHeight: '52px'
                },
                '& .MuiInputLabel-root': {
                  lineHeight: '52px',
                  top: '-10px'
                }
              }}
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
              renderInput={(params) => <TextField {...params} label='Khung giờ' size='small' required />}
            />
          </FormControl>
        </Box>
        <Box sx={{ flex: 1, paddingX: 2 }}>
          <FormControl fullWidth size='small'>
            <Autocomplete
              multiple
              options={roomList?.data.data || []}
              limitTags={1}
              disableCloseOnSelect
              value={selectedRooms}
              onChange={(_, rooms) => {
                handleSelectRooms(rooms as Room[])
              }}
              sx={{
                '.MuiAutocomplete-inputRoot': {
                  minHeight: '52px'
                }
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Chọn phòng'
                  size='small'
                  required
                  InputLabelProps={{
                    sx: {
                      display: 'flex',
                      alignItems: 'center',
                      height: '70%'
                    }
                  }}
                />
              )}
            />
          </FormControl>
        </Box>
        <Box sx={{ flex: 1, paddingLeft: 2 }}>
          <FormControl fullWidth size='small'>
            <Autocomplete
              value={selectedPackage}
              onChange={(_, servicePackage) => {
                handleSelectPackage(servicePackage)
              }}
              sx={{
                '.MuiAutocomplete-inputRoot': {
                  minHeight: '52px'
                }
              }}
              options={isSuccess ? servicePackage?.data?.data : []}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Chọn gói'
                  size='small'
                  required
                  InputLabelProps={{
                    sx: {
                      display: 'flex',
                      alignItems: 'center',
                      height: '70%'
                    }
                  }}
                />
              )}
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
  )
}

export default HeaderOrderComponent
