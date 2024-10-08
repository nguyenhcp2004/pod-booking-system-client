import React from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

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

interface ViewOrderModalProps {
  open: boolean
  onClose: () => void
  order: Order | null
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ open, onClose, order }) => {
  if (!order) return null

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          padding: 2,
          margin: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          marginTop: '150px'
        }}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6'>Chi tiết đơn hàng</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant='body1'>
          <strong>ID:</strong> {order.id}
        </Typography>
        <Typography variant='body1'>
          <strong>Khách hàng:</strong> {order.customerName}
        </Typography>
        <Typography variant='body1'>
          <strong>Ngày:</strong> {order.date}
        </Typography>
        <Typography variant='body1'>
          <strong>Slot:</strong> {order.slot}
        </Typography>
        <Typography variant='body1'>
          <strong>Phòng:</strong> {order.room}
        </Typography>
        <Typography variant='body1'>
          <strong>Địa chỉ:</strong> {order.address}
        </Typography>
        <Typography variant='body1'>
          <strong>Trạng thái:</strong> {order.status}
        </Typography>
        <Typography variant='body1'>
          <strong>Nhân viên:</strong> {order.staff}
        </Typography>
        <Typography variant='body1'>
          <strong>Gói dịch vụ:</strong> {order.servicePackage}
        </Typography>
      </Box>
    </Modal>
  )
}

export default ViewOrderModal
