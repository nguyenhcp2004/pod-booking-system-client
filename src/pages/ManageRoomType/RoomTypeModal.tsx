import Edit from '@mui/icons-material/Edit'
import {
  Backdrop,
  Button,
  CircularProgress,
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
import Grid from '@mui/material/Grid'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { ACTION } from '~/constants/mock'
import { RoomTypeSchemaType } from '~/schemaValidations/roomType.schema'
import { useCreateRoomType, useUpdateRoomType } from '~/queries/useRoomType'
import { Building } from '~/constants/type'
import { useBuilding } from '~/apis/orderApi'
import { toast } from 'react-toastify'

const RoomTypeModal = ({ row, refetch, action }: { row: RoomTypeSchemaType; refetch: () => void; action: string }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(row?.name || '')
  const [price, setPrice] = useState(row?.price || 1000)
  const [quantity, setQuantity] = useState(row?.quantity || 0)
  const [capacity, setCapacity] = useState(row?.capacity || 1)
  const [building, setBuilding] = useState<Building | null>(row?.building || null)
  const [buildingId, setBuildingId] = useState<number>(row?.building.id || 0)
  const { data: allBuilding } = useBuilding()
  const createRoomMutation = useCreateRoomType()
  const updateRoomMutation = useUpdateRoomType()

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const payload = { name, price, quantity, capacity, buildingId }
    try {
      if (action === ACTION.UPDATE) {
        await updateRoomMutation.mutateAsync({ updateData: payload, roomTypeId: row.id })
        toast.success('Cập nhật phòng thành công')
      } else {
        await createRoomMutation.mutateAsync(payload)
        toast.success('Tạo phòng thành công')
      }
      refetch()
    } catch (error) {
      console.error('Error handling room type:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
      handleClose()
    }
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
      <Dialog open={open} onClose={handleClose} fullWidth PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
        <DialogTitle>{action === ACTION.CREATE ? 'Tạo phòng' : 'Chỉnh sửa: ' + row?.name}</DialogTitle>
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
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value < 1000) {
                    toast.error('Giá phòng không thể nhỏ hơn 1000 VND')
                  } else {
                    setPrice(value)
                  }
                }}
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid item xs={6}>
              {action === ACTION.UPDATE && (
                <TextField
                  fullWidth
                  label='Số lượng'
                  type='number'
                  value={quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value < 0) {
                      toast.error('Số lượng phòng không thể nhỏ hơn 0')
                    } else {
                      setQuantity(value)
                    }
                  }}
                  variant='outlined'
                  size='small'
                  required
                />
              )}
              {action === ACTION.CREATE && (
                <TextField
                  fullWidth
                  label='Số lượng'
                  type='number'
                  value={0}
                  variant='outlined'
                  size='small'
                  InputProps={{
                    readOnly: true
                  }}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Sức chứa'
                type='number'
                value={capacity}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value < 1) {
                    toast.error('Sức chứa không thể nhỏ hơn 1')
                  } else {
                    setCapacity(value)
                  }
                }}
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size='small'>
                <InputLabel id='building-select-label'>Chi nhánh</InputLabel>
                <Select
                  labelId='building-select-label'
                  label='Chi nhánh'
                  value={building?.id}
                  onChange={(event) => {
                    const selectedId = event.target.value
                    const building = allBuilding ? allBuilding.find((b) => b.id === selectedId) : null
                    if (building) {
                      setBuilding(building)
                    } else {
                      setBuilding(null)
                    }
                    setBuildingId(building ? building.id : 0)
                  }}
                >
                  {allBuilding &&
                    allBuilding.map((building) => (
                      <MenuItem key={building.id} value={building.id}>
                        {building.address}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
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
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default RoomTypeModal
