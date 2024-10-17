import Edit from '@mui/icons-material/Edit'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
//import { toast } from 'react-toastify'
//import BackdropCustom from '~/components/Progress/Backdrop'
import { ACTION } from '~/constants/mock'

//import { handleErrorApi } from '~/utils/utils'
import { RoomTypeSchemaType } from '~/schemaValidations/roomType.schema'

const RoomTypeModal = ({ row, refetch, action }: { row: RoomTypeSchemaType; refetch: () => void; action: string }) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(row?.name || '')
  const [price, setPrice] = useState(row?.price || 0)
  const [quantity, setQuantity] = useState(row?.quantity || 0)
  const [capacity, setCapacity] = useState(row?.capacity || 0)
  const [building, setBuilding] = useState(row?.building || '')

  //   const editRoomMutation = useEditRoomMutation()
  //   const createRoomMutation = useCreateRoomMutation()

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
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClickOpen}>
          Thêm phòng
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const payload = {
              id: row?.id,
              name,
              price,
              quantity,
              capacity,
              building
            }
            try {
              console.log(payload)
              //   const result =
              //     action === ACTION.UPDATE
              //       ? await editRoomMutation.mutateAsync(payload)
              //       : await createRoomMutation.mutateAsync(payload)
              //   toast.success(result.data.message, {
              //     autoClose: 3000
              //   })
              //   refetch()
            } catch (error) {
              console.log(error)
              //handleErrorApi({ error })
            }
            handleClose()
          }
        }}
      >
        {/* <BackdropCustom loading={editRoomMutation.isPending} /> */}
        <DialogTitle>{action === ACTION.CREATE ? 'Tạo phòng' : 'Chỉnh sửa ' + row?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Tên phòng'
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Giá'
                type='number'
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Số lượng'
                type='number'
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Sức chứa'
                type='number'
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Tòa nhà'
                value={building}
                onChange={(e) => setBuilding({ ...building, address: e.target.value })}
                variant='outlined'
                size='small'
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='error'>
            Hủy
          </Button>
          <Button type='submit' color='success'>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RoomTypeModal
