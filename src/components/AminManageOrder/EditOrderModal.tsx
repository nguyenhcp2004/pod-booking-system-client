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
import { Order } from '~/apis/orderApi'
import { GridValidRowModel } from '@mui/x-data-grid'

interface EditOrderModalProps {
  open: boolean
  onClose: () => void
  order: Order | null
  setOrders: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ open, onClose, order, setOrders }) => {
  const [editDate, setEditDate] = useState<Moment | null>(null)
  const [editSlot, setEditSlot] = useState('')
  const [editServicePackage, setEditServicePackage] = useState('')
  const [editStatus, setEditStatus] = useState('')

  useEffect(() => {
    if (order) {
      // setEditDate(moment(order.date))
      // setEditSlot(order.slot)
      // setEditServicePackage(order.servicePackage)
      // setEditStatus(order.status)
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

// import React, { useState } from 'react'
// import {
//   Modal,
//   Box,
//   Typography,
//   IconButton,
//   Card,
//   useTheme,
//   TextField,
//   FormControl,
//   Autocomplete,
//   Checkbox,
//   Divider
// } from '@mui/material'
// import CloseIcon from '@mui/icons-material/Close'
// import { Order } from '~/apis/orderApi'
// import { SLOT } from '~/constants/slot'
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
// import CheckBoxIcon from '@mui/icons-material/CheckBox'
// import { DatePicker } from '@mui/x-date-pickers'
// import moment, { Moment } from 'moment'
// import { DEFAULT_DATE_FORMAT } from '~/utils/timeUtils'

// interface ViewOrderModalProps {
//   open: boolean
//   onClose: () => void
//   order: Order | null
// }

// const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ open, onClose, order }) => {
//   const today = moment()
//   const [selectedDate, setSelectedDate] = useState<Moment>(today)
//   const theme = useTheme()
//   if (!order) return null
//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           width: '70vw',
//           height: '80vh',
//           padding: 3,
//           margin: 'auto',
//           bgcolor: theme.palette.grey[100],
//           borderRadius: 2,
//           marginTop: '70px',
//           overflowY: 'auto'
//         }}
//       >
//         <Box display='flex' justifyContent='space-between' alignItems='center'>
//           <Box display='flex' gap='10px'>
//             <Typography variant='h5' sx={{ marginTop: '20px' }} fontWeight='500'>
//               ID Đơn hàng:
//             </Typography>
//             <Typography variant='h5' sx={{ marginTop: '20px' }}>
//               {order.id}
//             </Typography>
//           </Box>
//           <IconButton onClick={onClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//         <Card sx={{ padding: 3, marginY: 2 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Box sx={{ flex: 1, paddingRight: 2 }}>
//               <TextField
//                 label='Tình trạng'
//                 size='small'
//                 variant='outlined'
//                 value={order.orderDetails[0].status}
//                 InputProps={{
//                   readOnly: true
//                 }}
//                 fullWidth
//               />
//             </Box>
//             <Box sx={{ flex: 1, paddingX: 2 }}>
//               <TextField
//                 label='Nhân viên phụ trách'
//                 size='small'
//                 variant='outlined'
//                 value={order.orderDetails[0].orderHandler.name}
//                 InputProps={{
//                   readOnly: true
//                 }}
//                 fullWidth
//               />
//             </Box>
//             <Box sx={{ flex: 1, paddingLeft: 2 }}>
//               <TextField
//                 label='Chi nhánh'
//                 size='small'
//                 variant='outlined'
//                 value={order.orderDetails[0].buildingAddress}
//                 InputProps={{
//                   readOnly: true
//                 }}
//                 fullWidth
//               />
//             </Box>
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
//             <Box sx={{ flex: 1, paddingRight: 2 }}>
//               <FormControl fullWidth size='small'>
//                 <Autocomplete
//                   multiple
//                   options={SLOT}
//                   value={['09:00 - 10:00']}
//                   onChange={() => {}}
//                   //(_, slots) => {setSelectedSlots(slots as slotType[])}}
//                   disableCloseOnSelect
//                   limitTags={1}
//                   renderOption={(props, option, { selected }) => {
//                     const { key, ...optionProps } = props
//                     return (
//                       <li key={key} {...optionProps}>
//                         <Checkbox
//                           icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
//                           checkedIcon={<CheckBoxIcon fontSize='small' />}
//                           style={{ marginRight: 8 }}
//                           checked={selected}
//                           size='small'
//                         />
//                         {option}
//                       </li>
//                     )
//                   }}
//                   renderInput={(params) => <TextField {...params} label='Slot' size='small' />}
//                 />
//               </FormControl>
//             </Box>
//             <Box sx={{ flex: 1, paddingX: 2 }}>
//               <DatePicker
//                 label='Ngày đặt'
//                 value={selectedDate}
//                 onChange={(date) => date && setSelectedDate(date)}
//                 slotProps={{ textField: { size: 'small', fullWidth: true } }}
//                 format={DEFAULT_DATE_FORMAT}
//               />
//             </Box>
//             <Box sx={{ flex: 1, paddingLeft: 2 }}>
//               <FormControl fullWidth size='small'>
//                 <Autocomplete
//                   value={order.orderDetails[0].servicePackage}
//                   onChange={() => {}}
//                   //(_, servicePackage) => {setSelectedPackage(servicePackage)}
//                   options={order.orderDetails[0].servicePackage ? [order.orderDetails[0].servicePackage] : []}
//                   getOptionLabel={(option) => option.name}
//                   renderInput={(params) => <TextField {...params} label='Chọn gói' size='small' />}
//                 />
//               </FormControl>
//             </Box>
//           </Box>
//         </Card>
//         <Card sx={{ padding: 3, marginY: 2 }}>
//           <Typography variant='h6' sx={{ marginBottom: 3 }}>
//             Khách hàng: {order.orderDetails[0].customer.name}
//           </Typography>
//           <Typography variant='body1' sx={{ marginBottom: 1 }}>
//             Email: {order.orderDetails[0].customer.email}
//           </Typography>
//           <Typography variant='body1' sx={{ marginBottom: 1 }}>
//             Hạng: {order.orderDetails[0].customer.rankingName || 'Chưa có'}
//           </Typography>
//         </Card>
//         <Card sx={{ padding: 3, marginY: 2 }}>
//           <Typography variant='h6' sx={{ marginBottom: 3 }}>
//             Chi tiết đơn hàng
//           </Typography>
//           {order.orderDetails.map((orderDetail, index) => (
//             <Box key={index} sx={{}}>
//               <Typography variant='body1' sx={{ marginBottom: 1 }}>
//                 Phòng: {orderDetail.roomName}
//               </Typography>
//               <Box>
//                 {orderDetail.amenities.map((amenity, index) => (
//                   <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Typography variant='body2'>{amenity.name}</Typography>
//                     <Typography variant='body2'>{amenity.price}</Typography>
//                   </Box>
//                 ))}
//               </Box>
//               {index !== order.orderDetails.length - 1 && <Divider sx={{ marginY: 2 }} />}
//             </Box>
//           ))}
//         </Card>
//       </Box>
//     </Modal>
//   )
// }

// export default ViewOrderModal