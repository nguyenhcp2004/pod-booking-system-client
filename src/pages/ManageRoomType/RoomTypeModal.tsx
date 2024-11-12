import React, { useState } from 'react'
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
  TextField,
  Grid
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Edit from '@mui/icons-material/Edit'
import { toast } from 'react-toastify'
import { ACTION } from '~/constants/mock'
import { RoomTypeSchemaType } from '~/schemaValidations/roomType.schema'
import { useCreateRoomType, useUpdateRoomType } from '~/queries/useRoomType'
import { useBuilding } from '~/queries/useOrder'
import { Building } from '~/constants/type'

const formatNumberWithThousandSeparators = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const RoomTypeModal = ({ row, refetch, action }: { row: RoomTypeSchemaType; refetch: () => void; action: string }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(row?.name || '')
  const [price, setPrice] = useState(row?.price || 1000)
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
    const quantity = row?.quantity || 0
    if (price < 1000 && price > 1_000_000 && capacity < 1) {
      const payload = { name, price, quantity, capacity, buildingId }
      try {
        if (action === ACTION.UPDATE) {
          await updateRoomMutation.mutateAsync({ updateData: payload, roomTypeId: row.id })
          toast.success('Cập nhật loại phòng thành công')
        } else {
          await createRoomMutation.mutateAsync(payload)
          toast.success('Tạo thêm loại phòng mới thành công')
        }
        refetch()
      } catch (error) {
        toast.error('Có lỗi xảy ra, vui lòng thử lại: ' + error)
      } finally {
        setLoading(false)
        handleClose()
      }
    } else {
      toast.error('Giá trị nhập vào không hợp lệ')
      setLoading(false)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^0-9]/g, '')
    setPrice(value ? Number(value) : 0)
  }

  const handlePriceBlur = () => {
    if (price < 1000 || price > 1_000_000) {
      toast.error('Giá phòng phải nằm trong khoảng từ 1000 đến 1,000,000 VND.')
    } else {
      setPrice(formatNumberWithThousandSeparators(price))
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
          Thêm loại phòng
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
                inputProps={{
                  maxLength: 100
                }}
                helperText={`${name.length}/100`}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Giá'
                type='text'
                value={price === 0 ? '' : price}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
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
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setCapacity(value)
                }}
                onBlur={() => {
                  if (capacity < 1) {
                    toast.error('Sức chứa không thể nhỏ hơn 1')
                  }
                }}
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size='small' required>
                <InputLabel id='building-select-label'>Chi nhánh</InputLabel>
                <Select
                  labelId='building-select-label'
                  label='Chi nhánh'
                  value={building?.id || ''}
                  onChange={(event) => {
                    const selectedId = event.target.value
                    const selectedBuilding = allBuilding ? allBuilding.find((b) => b.id === selectedId) : null
                    setBuilding(selectedBuilding || null)
                    setBuildingId(selectedBuilding ? selectedBuilding.id : 0)
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                        overflowY: 'auto'
                      }
                    }
                  }}
                >
                  {allBuilding &&
                    allBuilding.map((building) => (
                      <MenuItem key={building.id} value={building.id}>
                        {building.address}
                      </MenuItem>
                    ))}
                </Select>
                {!building && <p style={{ color: 'red', fontSize: '12px' }}>Vui lòng chọn chi nhánh</p>}
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
