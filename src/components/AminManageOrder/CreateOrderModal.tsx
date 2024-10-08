import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'

interface Order {
  id: string
  customerName: string
  date: string
  slot: string
  room: string
  address: string
  status: string
  staff: string
  servicePackage: string
}

interface CreateOrderModalProps {
  open: boolean
  onClose: () => void
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ open, onClose, setOrders }) => {
  const [date, setDate] = useState<Moment | null>(null)
  const [slot, setSlot] = useState('')
  const [servicePackage, setServicePackage] = useState('')
  const [status, setStatus] = useState('Active')

  const handleCreate = () => {
    const newOrder = {
      id: `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customerName: 'Tên khách hàng',
      date: moment(date).format(DEFAULT_DATE_FORMAT),
      slot,
      room: 'Room A',
      address: 'Địa chỉ',
      status,
      staff: 'Nhân viên',
      servicePackage
    }

    setOrders((prevOrders) => [...prevOrders, newOrder])
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tạo đơn hàng</DialogTitle>
      <DialogContent>
        <DatePicker
          label='Ngày'
          value={date}
          onChange={(newDate) => setDate(newDate)}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
          format={DEFAULT_DATE_FORMAT}
        />
        <FormControl fullWidth margin='normal'>
          <InputLabel>Slot</InputLabel>
          <Select value={slot} onChange={(e) => setSlot(e.target.value)}>
            {Array.from({ length: 6 }, (_, i) => {
              const startTime = moment()
                .startOf('day')
                .add(i * 2, 'hours')
                .format('HH:mm')
              const endTime = moment()
                .startOf('day')
                .add(i * 2 + 2, 'hours')
                .format('HH:mm')
              return (
                <MenuItem key={startTime} value={`${startTime} - ${endTime}`}>
                  {`${startTime} - ${endTime}`}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel>Gói dịch vụ</InputLabel>
          <Select value={servicePackage} onChange={(e) => setServicePackage(e.target.value)}>
            <MenuItem value='Basic'>Cơ bản</MenuItem>
            <MenuItem value='Premium'>Nâng cao</MenuItem>
            <MenuItem value='Deluxe'>Deluxe</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value='Hoạt động'>Hoạt động</MenuItem>
            <MenuItem value='Hủy bỏ'>Hủy bỏ</MenuItem>
            <MenuItem value='Hoàn thành'>Hoàn thành</MenuItem>
            <MenuItem value='Đang chờ'>Đang chờ</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleCreate} color='primary'>
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateOrderModal
