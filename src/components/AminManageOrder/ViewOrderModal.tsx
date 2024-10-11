import React from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Order } from '~/apis/orderApi'

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
          <strong>Khách hàng:</strong> {order.orderDetails[0].customer.name}
        </Typography>
        <Typography variant='body1'>
          <strong>Ngày:</strong> {order.orderDetails[0].startTime}
        </Typography>
        <Typography variant='body1'>
          <strong>Slot:</strong> {order.orderDetails[0].endTime}
        </Typography>
        <Typography variant='body1'>
          <strong>Phòng:</strong> {order.orderDetails.map((o) => o.roomName).join(', ')}
        </Typography>
        <Typography variant='body1'>
          <strong>Địa chỉ:</strong> {order.orderDetails[0].customer.buildingNumber}
        </Typography>
        <Typography variant='body1'>
          <strong>Trạng thái:</strong> {order.orderDetails[0].status}
        </Typography>
        <Typography variant='body1'>
          <strong>Nhân viên:</strong> {order.orderDetails[0].orderHandler.name}
        </Typography>
        <Typography variant='body1'>
          <strong>Gói dịch vụ:</strong> {order.orderDetails[0].servicePackage?.name}
        </Typography>
      </Box>
    </Modal>
  )
}

export default ViewOrderModal
