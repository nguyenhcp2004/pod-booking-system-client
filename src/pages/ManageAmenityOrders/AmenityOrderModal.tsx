import { Add, Edit } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import BackdropCustom from '~/components/Progress/Backdrop'
import { ACTION } from '~/constants/mock'
import { AmenityOrderType } from '~/schemaValidations/amenityOrder.schema'
import { handleErrorApi } from '~/utils/utils'

const AmenityOrderModal = ({
  row,
  refetch,
  action
}: {
  row: AmenityOrderType
  refetch: () => void
  action: string
}) => {
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {action === ACTION.UPDATE ? (
        <IconButton onClick={handleClickOpen}>
          <Edit />
        </IconButton>
      ) : (
        <Button color='primary' startIcon={<Add />} onClick={handleClickOpen}>
          Tạo đơn tiện ích
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          sx: {
            position: 'relative'
          },
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries((formData as any).entries())
            const payload = {
              ...row,
              ...formJson
            }
            try {
              //   const result =
              //     action === ACTION.UPDATE
              //       ? await editRoomMutation.mutateAsync(payload)
              //       : await createRoomMutation.mutateAsync(payload)
              //   toast.success(result.data.message, {
              //     autoClose: 3000
              //   })
              refetch()
            } catch (error) {
              handleErrorApi({ error })
            }
            handleClose()
          }
        }}
      >
        <BackdropCustom loading={false} />
        <DialogTitle>{action === ACTION.CREATE ? 'Tạo phòng' : 'Chỉnh sửa ' + row?.name}</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='error'>
            Hủy
          </Button>
          <Button type='submit' color='success'>
            {action === ACTION.CREATE ? 'Tạo' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AmenityOrderModal
