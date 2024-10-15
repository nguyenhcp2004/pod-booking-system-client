import React, { useEffect, useState } from 'react'
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

interface EditOrderModalProps {
  open: boolean
  onClose: () => void
  order: Order | null
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ open, onClose, order, setOrders }) => {
  const [editDate, setEditDate] = useState<Moment | null>(null)
  const [editSlot, setEditSlot] = useState('')
  const [editServicePackage, setEditServicePackage] = useState('')
  const [editStatus, setEditStatus] = useState('')

  useEffect(() => {
    if (order) {
      setEditDate(moment(order.date))
      setEditSlot(order.slot)
      setEditServicePackage(order.servicePackage)
      setEditStatus(order.status)
    }
  }, [order])

  const handleUpdate = () => {
    if (order) {
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.id
            ? {
                ...o,
                date: moment(editDate).format(DEFAULT_DATE_FORMAT),
                slot: editSlot,
                servicePackage: editServicePackage,
                status: editStatus
              }
            : o
        )
      )
    }
    onClose()
  }

  const timeSlots = Array.from({ length: 12 }, (_, index) => {
    const startHour = 7 + index * 2
    const endHour = startHour + 2
    const formatTime = (hour: number) =>
      `${hour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`
    return formatTime(startHour)
  })

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
      <DialogContent>
        <DatePicker
          label='Ngày'
          value={editDate}
          onChange={(date) => setEditDate(date)}
          format={DEFAULT_DATE_FORMAT}
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
        <FormControl fullWidth margin='normal'>
          <InputLabel>Khung giờ</InputLabel>
          <Select value={editSlot} onChange={(e) => setEditSlot(e.target.value)}>
            {timeSlots.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel>Gói dịch vụ</InputLabel>
          <Select value={editServicePackage} onChange={(e) => setEditServicePackage(e.target.value)}>
            <MenuItem value='Cơ bản'>Cơ bản</MenuItem>
            <MenuItem value='Premium'>Premium</MenuItem>
            <MenuItem value='Deluxe'>Deluxe</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel>Trạng thái</InputLabel>
          <Select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
            <MenuItem value='Hoạt động'>Hoạt động</MenuItem>
            <MenuItem value='Đã hủy'>Đã hủy</MenuItem>
            <MenuItem value='Đã hoàn thành'>Đã hoàn thành</MenuItem>
            <MenuItem value='Đang chờ'>Đang chờ</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleUpdate} color='primary'>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditOrderModal
