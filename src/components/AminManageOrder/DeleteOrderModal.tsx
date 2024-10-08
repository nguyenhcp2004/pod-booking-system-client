import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, DialogContentText } from '@mui/material'

interface DeleteOrderModalProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
}

const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onDelete} variant='contained' color='error'>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteOrderModal
